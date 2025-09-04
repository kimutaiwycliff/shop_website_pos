'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { ProductGridBlock as ProductGridBlockType } from '@/payload-types'
import { Product, Brand } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Grid, List, Filter, Heart, Eye, ShoppingCart, Star, Search, ScanLine } from 'lucide-react'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import Image from 'next/image'
import { SearchResult } from '@/lib/advancedSearch'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import BarcodeScanner from '../../components/BarcodeScanner'

type Props = {
  products?: Product[]
} & ProductGridBlockType

const ProductGridComponent: React.FC<Props> = ({
  title,
  description,
  limit = 12,
  columns = 'four',
  showFilters = true,
  showSorting = true,
  showPagination = true,
  enableQuickView = true,
  enableWishlist = true,
  showCompare = false,
  cardStyle = 'standard',
  showProductBadges = true,
  backgroundColor = 'transparent',
  spacing = 'normal',
  products: initialProducts = [],
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [searchMode, setSearchMode] = useState<'text' | 'barcode'>('text')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const itemsPerPage = limit || 12

  // Use search results when available, otherwise use initial products
  const currentProducts = searchResults.length > 0 ? searchResults : products

  // Enhanced search functionality
  const handleSearchResult = useCallback(async (result: SearchResult) => {
    if (result.collection === 'products') {
      setIsSearching(true)
      try {
        // Fetch full product data
        const response = await fetch(`/api/products/${result.id}`)
        if (response.ok) {
          const productData = await response.json()
          setSearchResults([productData])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }, [])

  // Handle barcode scan
  const handleBarcodeScan = useCallback(async (barcode: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(
        `/api/products?where[barcode][equals]=${encodeURIComponent(barcode)}`,
      )
      if (response.ok) {
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setSearchResults(data.docs)
          setShowBarcodeScanner(false)
        } else {
          alert(`No product found with barcode: ${barcode}`)
        }
      }
    } catch (error) {
      console.error('Error searching by barcode:', error)
      alert('Error searching for product')
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchResults([])
    setCurrentPage(1)
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    currentProducts.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((cat) => {
          if (typeof cat === 'object' && 'title' in cat && cat.title) {
            cats.add(cat.title)
          }
        })
      }
    })
    return Array.from(cats)
  }, [currentProducts])

  const brands = useMemo(() => {
    const brandSet = new Set<string>()
    currentProducts.forEach((product) => {
      if (
        product.brand &&
        typeof product.brand === 'object' &&
        'name' in product.brand &&
        product.brand.name
      ) {
        brandSet.add(product.brand.name)
      }
    })
    return Array.from(brandSet)
  }, [currentProducts])

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = [...currentProducts]

    // Apply filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.categories) return false
        return product.categories.some((cat) => {
          if (typeof cat === 'object' && 'title' in cat && cat.title) {
            return selectedCategories.includes(cat.title)
          }
          return false
        })
      })
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.brand || typeof product.brand !== 'object') return false
        return selectedBrands.includes((product.brand as Brand).name || '')
      })
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = product.price || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
          return (a.title || '').localeCompare(b.title || '')
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [currentProducts, selectedCategories, selectedBrands, priceRange, sortBy])

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return processedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [processedProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage)

  const getColumnClasses = () => {
    const baseClasses = 'grid gap-4 sm:gap-6'
    switch (columns) {
      case 'two':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`
      case 'three':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
      case 'four':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
      case 'five':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
      case 'six':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6`
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
    }
  }

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return 'py-0'
      case 'small':
        return 'py-8'
      case 'normal':
        return 'py-12'
      case 'large':
        return 'py-16'
      default:
        return 'py-12'
    }
  }

  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'white':
        return 'bg-white'
      case 'light':
        return 'bg-gray-50'
      case 'dark':
        return 'bg-gray-900 text-white'
      default:
        return 'bg-transparent'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const primaryImage = product.images?.[0]
    const hasDiscount = product.originalPrice && product.originalPrice > (product.price || 0)
    const discountPercentage = hasDiscount
      ? Math.round(((product.originalPrice! - (product.price || 0)) / product.originalPrice!) * 100)
      : 0

    return (
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-200 hover:shadow-lg',
          cardStyle === 'minimal' && 'border-0 shadow-none hover:shadow-md',
          cardStyle === 'compact' && 'p-2',
        )}
      >
        <div className="relative overflow-hidden">
          {primaryImage && (
            <div className="aspect-square relative">
              <Image
                src={typeof primaryImage.image === 'object' ? primaryImage.image.url || '' : ''}
                alt={primaryImage.alt || product.title || ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {showProductBadges && (
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {hasDiscount && (
                    <Badge variant="destructive" className="text-xs">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.inStock === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              )}

              {(enableWishlist || enableQuickView || showCompare) && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {enableWishlist && (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  )}
                  {enableQuickView && (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {showCompare && (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Grid className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <CardContent className={cn('p-4', cardStyle === 'compact' && 'p-2')}>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {product.brand && typeof product.brand === 'object' && 'name' in product.brand && (
            <p className="text-sm text-muted-foreground mt-1">{(product.brand as Brand).name}</p>
          )}

          {cardStyle === 'detailed' && product.sku && (
            <p className="text-xs text-muted-foreground mt-1 font-mono">SKU: {product.sku}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-lg">{formatPrice(product.price || 0)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          {cardStyle === 'detailed' && (
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600',
                  )}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(24)</span>
            </div>
          )}
        </CardContent>

        <CardFooter className={cn('p-4 pt-0', cardStyle === 'compact' && 'p-2 pt-0')}>
          <Button className="w-full" size={cardStyle === 'compact' ? 'sm' : 'default'}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className={cn('w-full', getBackgroundClasses(), getSpacingClasses())}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(title || description) && (
          <div className="text-center mb-8">
            {title && <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>}
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {/* Advanced Search Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <AdvancedSearch
                config={{
                  collections: ['products'],
                  enableFuzzySearch: true,
                  searchPriority: true,
                  limit: 20,
                }}
                placeholder="Search products by name, SKU, barcode, or brand..."
                enableFilters={true}
                enableSuggestions={true}
                onResultSelect={handleSearchResult}
                maxResults={20}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-md border">
                <Button
                  variant={searchMode === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSearchMode('text')}
                  className="rounded-r-none"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Text
                </Button>
                <Button
                  variant={searchMode === 'barcode' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setSearchMode('barcode')
                    setShowBarcodeScanner(true)
                  }}
                  className="rounded-l-none"
                >
                  <ScanLine className="h-4 w-4 mr-1" />
                  Scan
                </Button>
              </div>

              {(searchResults.length > 0 || isSearching) && (
                <Button variant="outline" size="sm" onClick={clearSearch} disabled={isSearching}>
                  Clear Search
                </Button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge variant="secondary">
                {searchResults.length} search result{searchResults.length !== 1 ? 's' : ''}
              </Badge>
              <span>•</span>
              <button onClick={clearSearch} className="text-primary hover:underline">
                Show all products
              </button>
            </div>
          )}
        </div>

        {/* Barcode Scanner Dialog */}
        {showBarcodeScanner && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Scan Product Barcode</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowBarcodeScanner(false)}>
                  ×
                </Button>
              </div>
              <BarcodeScanner
                onScan={handleBarcodeScan}
                onError={(error: string) => console.error('Scanner error:', error)}
                isActive={showBarcodeScanner}
                enableTorch={true}
              />
            </div>
          </div>
        )}

        {/* Filters and View Controls */}
        {(showFilters || showSorting) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showSorting && (
              <div className="flex items-center gap-2">
                <Label htmlFor="sort">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && showFiltersPanel && (
            <div className="w-64 shrink-0 space-y-6">
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category])
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== category),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={`cat-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? getColumnClasses() : 'space-y-4'}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductGridComponent
