'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, Loader2, ShoppingBag, Tag, Barcode } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAdvancedSearch, SearchConfig, SearchResult } from '@/lib/advancedSearch'
import Image from 'next/image'

export interface AdvancedSearchProps {
  config: SearchConfig
  placeholder?: string
  className?: string
  enableFilters?: boolean
  enableSuggestions?: boolean
  maxResults?: number
  onResultSelect?: (result: SearchResult) => void
  onResultsChange?: (results: SearchResult[]) => void
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  config,
  placeholder = 'Search products, brands, or scan barcode...',
  className,
  enableFilters = true,
  enableSuggestions = true,
  maxResults = 10,
  onResultSelect,
  onResultsChange,
}) => {
  const [showResults, setShowResults] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState(config.sortBy || 'relevance')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { query, setQuery, results, isLoading, error, totalResults, search, clearSearch } =
    useAdvancedSearch({
      ...config,
      sortBy,
      filters: {
        ...config.filters,
        ...(priceRange.min && { 'price.gte': parseFloat(priceRange.min) }),
        ...(priceRange.max && { 'price.lte': parseFloat(priceRange.max) }),
      },
    })

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle results change callback
  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(results)
    }
  }, [results, onResultsChange])

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result)
    }
    setShowResults(false)
  }

  const handleClearFilters = () => {
    setSortBy('relevance')
    setPriceRange({ min: '', max: '' })
  }

  const getCollectionIcon = (collection: string) => {
    switch (collection) {
      case 'products':
        return <ShoppingBag className="h-4 w-4" />
      case 'brands':
        return <Tag className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const displayResults = results.slice(0, maxResults)

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20"
          onFocus={() => query.trim() && setShowResults(true)}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {enableFilters && (
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Search Filters</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="title">Name (A-Z)</SelectItem>
                        <SelectItem value="-createdAt">Newest First</SelectItem>
                        <SelectItem value="price">Price (Low to High)</SelectItem>
                        <SelectItem value="-price">Price (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range (only for products) */}
                  {config.collections.includes('products') && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Price Range (KES)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                          }
                          className="h-8"
                        />
                        <span className="text-sm text-muted-foreground">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {query && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="h-7 w-7 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && query.trim() && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            )}

            {/* Error State */}
            {error && <div className="p-4 text-center text-sm text-destructive">{error}</div>}

            {/* Results */}
            {!isLoading && !error && displayResults.length > 0 && (
              <>
                <div className="p-3 border-b bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {totalResults} result{totalResults !== 1 ? 's' : ''}
                    </span>
                    {totalResults > maxResults && (
                      <span className="text-xs text-muted-foreground">
                        Showing first {maxResults}
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {displayResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="block p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        {/* Result Image */}
                        {result.meta?.image && (
                          <div className="flex-shrink-0">
                            <Image
                              src={
                                typeof result.meta.image === 'string'
                                  ? result.meta.image
                                  : result.meta.image.url
                              }
                              alt={result.title}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getCollectionIcon(result.collection)}
                            <h4 className="font-medium text-sm truncate">{result.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {result.collection}
                            </Badge>
                          </div>

                          {/* Product-specific info */}
                          {result.collection === 'products' && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                              {result.sku && (
                                <span className="flex items-center gap-1">
                                  <Barcode className="h-3 w-3" />
                                  {result.sku}
                                </span>
                              )}
                              {result.price && (
                                <span className="font-medium text-primary">
                                  KES {result.price.toLocaleString()}
                                </span>
                              )}
                              {result.brand?.name && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.brand.name}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          {result.meta?.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.meta.description}
                            </p>
                          )}

                          {/* Categories */}
                          {result.categories && result.categories.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {result.categories.slice(0, 3).map((cat) => (
                                <Badge key={cat.categoryID} variant="outline" className="text-xs">
                                  {cat.title}
                                </Badge>
                              ))}
                              {result.categories.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{result.categories.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* No Results */}
            {!isLoading && !error && displayResults.length === 0 && query.trim() && (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No results found</p>
                <p className="text-xs text-muted-foreground">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
