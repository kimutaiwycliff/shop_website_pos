'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useDebounce } from '@/utilities/useDebounce'

export interface SearchResult {
  id: string
  title: string
  collection: string
  slug: string
  meta?: {
    title?: string
    description?: string
    image?: string | { url: string }
  }
  categories?: Array<{
    categoryID: string
    title: string
  }>
  price?: number
  sku?: string
  barcode?: string
  brand?: {
    name: string
  }
  searchPriority?: number
  relevanceScore?: number
}

export interface SearchConfig {
  collections: string[]
  limit?: number
  enableFuzzySearch?: boolean
  searchPriority?: boolean
  sortBy?: string
  filters?: Record<string, any>
  debounceMs?: number
}

export interface AdvancedSearchHook {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  totalResults: number
  search: (searchQuery: string, additionalFilters?: Record<string, any>) => Promise<void>
  clearSearch: () => void
}

export function useAdvancedSearch(config: SearchConfig): AdvancedSearchHook {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  const debouncedQuery = useDebounce(query, config.debounceMs || 300)

  // Memoize config properties to prevent unnecessary re-renders
  const stableConfig = useMemo(
    () => ({
      collections: config.collections,
      filters: config.filters,
      limit: config.limit || 20,
      sortBy: config.sortBy,
      searchPriority: config.searchPriority,
      enableFuzzySearch: config.enableFuzzySearch,
    }),
    [
      JSON.stringify(config.collections),
      JSON.stringify(config.filters),
      config.limit,
      config.sortBy,
      config.searchPriority,
      config.enableFuzzySearch,
    ],
  )

  const search = useCallback(
    async (searchQuery: string, additionalFilters?: Record<string, any>) => {
      if (!searchQuery.trim()) {
        setResults([])
        setTotalResults(0)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()

        // Build search where clause
        const where: any = {
          or: [],
        }

        // Add title search
        where.or.push({ title: { like: searchQuery } })

        // Add meta title and description search
        where.or.push({ 'meta.title': { like: searchQuery } })
        where.or.push({ 'meta.description': { like: searchQuery } })

        // Add product-specific searches
        if (stableConfig.collections.includes('products')) {
          where.or.push({ sku: { like: searchQuery } })
          where.or.push({ barcode: { equals: searchQuery } })
          where.or.push({ 'brand.name': { like: searchQuery } })
        }

        // Add slug search
        where.or.push({ slug: { like: searchQuery } })

        // Add additional filters
        if (stableConfig.filters || additionalFilters) {
          const filters = { ...stableConfig.filters, ...additionalFilters }
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              where[key] = value
            }
          })
        }

        searchParams.append('where', JSON.stringify(where))
        searchParams.append('limit', stableConfig.limit.toString())
        searchParams.append('depth', '2')

        if (stableConfig.sortBy) {
          searchParams.append('sort', stableConfig.sortBy)
        } else if (stableConfig.searchPriority) {
          searchParams.append('sort', '-searchPriority,-createdAt')
        }

        const response = await fetch(`/api/search?${searchParams.toString()}`)

        if (!response.ok) {
          throw new Error('Search request failed')
        }

        const data = await response.json()

        // Process and enhance results
        const processedResults = data.docs.map((doc: any) => {
          const result: SearchResult = {
            id: doc.id,
            title: doc.title,
            collection: doc.doc.relationTo,
            slug: doc.slug,
            meta: doc.meta,
            searchPriority: doc.searchPriority || 1,
          }

          // Add product-specific fields
          if (doc.doc.relationTo === 'products') {
            result.price = doc.price
            result.sku = doc.sku
            result.barcode = doc.barcode
            result.brand = doc.brand
          }

          result.categories = doc.categories

          // Calculate relevance score based on multiple factors
          result.relevanceScore = calculateRelevanceScore(result, searchQuery)

          return result
        })

        // Sort by relevance score if fuzzy search is enabled
        if (stableConfig.enableFuzzySearch) {
          processedResults.sort(
            (a: SearchResult, b: SearchResult) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
          )
        }

        setResults(processedResults)
        setTotalResults(data.totalDocs || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
        setTotalResults(0)
      } finally {
        setIsLoading(false)
      }
    },
    [stableConfig],
  )

  // Auto-search when query changes - only depend on debouncedQuery, not search function
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery)
    } else {
      setResults([])
      setTotalResults(0)
    }
  }, [debouncedQuery]) // Removed search from dependencies to break the cycle

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setTotalResults(0)
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    totalResults,
    search,
    clearSearch,
  }
}

// Calculate relevance score for fuzzy search
function calculateRelevanceScore(result: SearchResult, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()
  const titleLower = result.title.toLowerCase()

  // Exact title match gets highest score
  if (titleLower === queryLower) {
    score += 100
  } else if (titleLower.includes(queryLower)) {
    // Partial title match
    score += 50
    // Bonus for match at beginning
    if (titleLower.startsWith(queryLower)) {
      score += 25
    }
  }

  // SKU exact match (for products)
  if (result.sku && result.sku.toLowerCase() === queryLower) {
    score += 80
  }

  // Barcode exact match (for products)
  if (result.barcode && result.barcode === query) {
    score += 90
  }

  // Brand name match
  if (result.brand?.name && result.brand.name.toLowerCase().includes(queryLower)) {
    score += 30
  }

  // Meta title match
  if (result.meta?.title && result.meta.title.toLowerCase().includes(queryLower)) {
    score += 20
  }

  // Meta description match
  if (result.meta?.description && result.meta.description.toLowerCase().includes(queryLower)) {
    score += 10
  }

  // Category match
  if (result.categories?.some((cat) => cat.title.toLowerCase().includes(queryLower))) {
    score += 15
  }

  // Apply search priority multiplier
  score *= result.searchPriority || 1

  return score
}

// Utility for creating search where clauses
export function createSearchWhere(
  query: string,
  collections: string[],
  additionalFilters?: Record<string, any>,
) {
  const where: any = {
    or: [
      { title: { like: query } },
      { 'meta.title': { like: query } },
      { 'meta.description': { like: query } },
      { slug: { like: query } },
    ],
  }

  // Add product-specific search fields
  if (collections.includes('products')) {
    where.or.push(
      { sku: { like: query } },
      { barcode: { equals: query } },
      { 'brand.name': { like: query } },
    )
  }

  // Add additional filters
  if (additionalFilters) {
    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        where[key] = value
      }
    })
  }

  return where
}

// Utility for highlight matching text
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

// Utility for search suggestions/autocomplete
export function generateSearchSuggestions(query: string, results: SearchResult[]): string[] {
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  results.forEach((result) => {
    // Add title suggestions
    if (result.title.toLowerCase().includes(queryLower)) {
      suggestions.add(result.title)
    }

    // Add brand suggestions
    if (result.brand?.name && result.brand.name.toLowerCase().includes(queryLower)) {
      suggestions.add(result.brand.name)
    }

    // Add category suggestions
    result.categories?.forEach((cat) => {
      if (cat.title.toLowerCase().includes(queryLower)) {
        suggestions.add(cat.title)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
}
