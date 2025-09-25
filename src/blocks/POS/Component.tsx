'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { POSBlock as POSBlockType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingCart,
  User,
  Percent,
  Receipt,
  Camera,
  Lock,
  Unlock,
  ScanLine,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import BarcodeScanner from '../../components/BarcodeScanner'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { SearchResult } from '@/lib/advancedSearch'

interface POSItem {
  id: string
  product: {
    id: string
    title: string
    price: number
    sku: string
    barcode?: string
    barcodeImage?: {
      url: string
      alt: string
    }
    images?: Array<{
      image: {
        url: string
        alt: string
      }
    }>
    inStock: number
  }
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
}

interface POSCustomer {
  id?: string
  name: string
  phone?: string
  email?: string
}

type Props = POSBlockType

const POSComponent: React.FC<Props> = ({
  title = 'Point of Sale',
  storeName = 'Main Store',
  cashierRequired = true,
  enableBarcodeScanning = true,
  //   enableCustomerDisplay = true,
  enableReceiptPrinting = true,
  //   enableCashDrawer = true,
  paymentMethods = [],
  //   receiptSettings,
  taxSettings,
  discountSettings,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentCashier, setCurrentCashier] = useState<any>(null)
  const [cart, setCart] = useState<POSItem[]>([])
  const [customer, setCustomer] = useState<POSCustomer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amountPaid, setAmountPaid] = useState(0)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState<string | null>(null)
  const [barcodeInput, setBarcodeInput] = useState('')
  const [isLocked, setIsLocked] = useState(cashierRequired)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  // Add state for VAT editing
  const [showVatDialog, setShowVatDialog] = useState(false)
  const [customTaxRate, setCustomTaxRate] = useState<number | null>(null)
  const [customTaxIncluded, setCustomTaxIncluded] = useState<boolean | null>(null)

  // Mock products data - replace with real API call
  const [mockProducts] = useState([
    {
      id: '1',
      title: 'Premium Cotton T-Shirt',
      price: 2500,
      sku: 'TSH-001',
      barcode: '1234567890123',
      inStock: 15,
      images: [{ image: { url: '/api/media/tshirt.jpg', alt: 'T-Shirt' } }],
    },
    {
      id: '2',
      title: 'Denim Jeans',
      price: 4500,
      sku: 'JNS-001',
      barcode: '1234567890124',
      inStock: 8,
      images: [{ image: { url: '/api/media/jeans.jpg', alt: 'Jeans' } }],
    },
  ])

  // Fetch products from the database with improved query parameter handling
  const fetchProducts = useCallback(async (query?: string) => {
    setIsLoadingProducts(true)
    
    // Retry mechanism
    const maxRetries = 3
    let retries = 0
    
    const attemptFetch = async (): Promise<void> => {
      try {
        // Build query parameters properly
        const params = new URLSearchParams()
        params.append('limit', '100')
        params.append('where[status][equals]', 'published')
        
        if (query) {
          params.append('q', query)
        }

        const response = await fetch(`/api/products?${params.toString()}`)
        
        if (response.ok) {
          const result = await response.json()
          setProducts(result.docs || [])
        } else {
          const errorText = await response.text().catch(() => 'Unknown error')
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
      } catch (error) {
        retries++
        
        if (retries < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries))
          return attemptFetch()
        } else {
          // All retries failed
          console.error('Failed to fetch products after', maxRetries, 'attempts:', error)
          // Show user-friendly error message
          alert('Failed to load products after multiple attempts. Please try again later.')
          // Fallback to mock data if API fails
          setProducts(mockProducts)
        }
      }
    }
    
    await attemptFetch()
    setIsLoadingProducts(false)
  }, [mockProducts])

  // Find product by barcode with improved query parameter handling
  const findProductByBarcode = useCallback(async (barcode: string) => {
    try {
      // Build query parameters properly
      const params = new URLSearchParams()
      params.append('where[barcode][equals]', barcode)
      params.append('where[status][equals]', 'published')
      params.append('limit', '1')
      
      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.docs?.[0] || null
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error('Failed to find product by barcode:', response.status, response.statusText, errorText)
        alert('Failed to search for product by barcode. Please try again.')
      }
    } catch (error) {
      console.error('Error finding product by barcode:', error)
      alert('Network error while searching for product. Please check your connection and try again.')
    }
    return null
  }, [])

  // Handle advanced search result selection
  const handleSearchResult = useCallback(async (result: SearchResult) => {
    if (result.collection === 'products') {
      setIsSearching(true)
      try {
        // Use API endpoint for client-side fetching to avoid server-only imports
        const response = await fetch(`/api/products/${result.id}`)
        
        if (response.ok) {
          const productData = await response.json()
          addToCart(productData)
        } else {
          const errorText = await response.text().catch(() => 'Unknown error')
          console.error('Failed to fetch product:', response.status, response.statusText, errorText)
          alert('Failed to load product details. Please try again.')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        alert('Network error while loading product. Please check your connection and try again.')
      } finally {
        setIsSearching(false)
      }
    }
  }, [])

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchQuery('')
  }, [])
  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      console.log('Barcode scanned:', barcode)

      // First check if product is already in the filtered list
      let product = products.find((p: any) => p.barcode === barcode)

      // If not found, search the database
      if (!product) {
        product = await findProductByBarcode(barcode)
      }

      if (product) {
        addToCart(product)
        // Show success feedback
        setShowBarcodeScanner(false)
      } else {
        // Show error - product not found
        alert(`Product with barcode ${barcode} not found`)
      }
    },
    [products, findProductByBarcode],
  )

  // Load products on component mount
  useEffect(() => {
    console.log('POS component mounted, fetching products...')
    fetchProducts()
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        console.log('Searching products with query:', searchQuery)
        fetchProducts(searchQuery)
      } else if (searchQuery.length === 0) {
        console.log('Clearing search, fetching all products')
        fetchProducts()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, fetchProducts])

  const defaultTaxRate = 0 // 0% VAT

  const subtotal = cart.reduce((sum, item) => sum + (item.lineTotal - item.discount), 0)
  // Use custom tax rate if set, otherwise use the default from settings
  const taxRate = customTaxRate !== null ? customTaxRate : taxSettings?.defaultTaxRate || defaultTaxRate
  // Use custom tax included setting if set, otherwise use the default from settings
  const taxIncluded =
    customTaxIncluded !== null ? customTaxIncluded : taxSettings?.taxIncluded || false
  const taxAmount = taxIncluded ? 0 : (subtotal * taxRate) / 100
  const total = subtotal + taxAmount
  const change = amountPaid - total

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Function to update product stock in the database
  const updateProductStock = useCallback(async (productId: string, newStock: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inStock: newStock,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        const error = new Error(`HTTP ${response.status}: ${errorText}`)
        console.error('Failed to update product stock:', error)
        throw error;
      }

      const updatedProduct = await response.json();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }, []);

  // Refresh products data
  const refreshProducts = useCallback(async () => {
    console.log('Refreshing products data...')
    await fetchProducts();
  }, [fetchProducts])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToCart = (product: any) => {
    console.log('Adding product to cart:', product.title, 'Stock available:', product.inStock);
    
    // Check if product is in stock
    if (product.inStock <= 0) {
      console.log('Product is out of stock:', product.title);
      alert('This product is out of stock and cannot be added to the cart.');
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Check if adding another would exceed stock
      if (existingItem.quantity >= product.inStock) {
        console.log('Cannot add more of this product. Stock limit reached for:', product.title);
        alert(`Cannot add more of this product. Only ${product.inStock} items in stock.`);
        return;
      }
      console.log('Updating quantity for existing item:', product.title);
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      console.log('Adding new item to cart:', product.title);
      const newItem: POSItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        lineTotal: product.price,
      };
      setCart([...cart, newItem]);
    }

    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const item = cart.find((item) => item.id === itemId);
    
    if (!item) return;

    console.log('Updating quantity for item:', item.product.title, 'New quantity:', newQuantity, 'Stock available:', item.product.inStock);

    // Check if new quantity exceeds stock
    if (newQuantity > item.product.inStock) {
      console.log('Cannot update quantity. Stock limit reached for:', item.product.title);
      alert(`Cannot add more of this product. Only ${item.product.inStock} items in stock.`);
      return;
    }

    if (newQuantity <= 0) {
      console.log('Removing item from cart:', item.product.title);
      removeFromCart(itemId);
      return;
    }

    setCart(
      cart.map((cartItem) => {
        if (cartItem.id === itemId) {
          const lineTotal = newQuantity * cartItem.unitPrice;
          return { ...cartItem, quantity: newQuantity, lineTotal };
        }
        return cartItem;
      }),
    );
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const applyDiscount = (itemId: string, discountAmount: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const maxDiscount = (item.lineTotal * (discountSettings?.maxDiscountPercent || 50)) / 100
          const finalDiscount = Math.min(discountAmount, maxDiscount)
          return { ...item, discount: finalDiscount }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setCart([])
    setCustomer(null)
    setAmountPaid(0)
    setPaymentMethod('')
  }

  const processSale = async () => {
    if (cart.length === 0 || !paymentMethod) return;

    console.log('Processing sale with items:', cart);

    try {
      // Update stock for each item in the cart
      const stockUpdatePromises = cart.map(async (item) => {
        const newStock = item.product.inStock - item.quantity;
        console.log(`Updating stock for ${item.product.title}: ${item.product.inStock} -> ${newStock}`);
        
        try {
          // Update product stock in the database
          await updateProductStock(item.product.id, newStock);
          
          // If stock reaches zero, update product status
          if (newStock === 0) {
            console.log(`Product ${item.product.title} is now out of stock`);
            try {
              const response = await fetch(`/api/products/${item.product.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'out-of-stock',
                }),
              });
              
              if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error')
                console.error('Failed to update product status:', response.status, response.statusText, errorText)
              }
            } catch (error) {
              console.error('Error updating product status:', error)
            }
          }
        } catch (error) {
          console.error('Error updating stock for product:', item.product.title, error)
          throw new Error(`Failed to update stock for ${item.product.title}: ${(error as Error).message}`)
        }
        
        return { productId: item.product.id, newStock };
      });

      // Wait for all stock updates to complete
      await Promise.all(stockUpdatePromises);

      // Simulate processing
      console.log('Processing sale:', {
        cart,
        customer,
        paymentMethod,
        total,
        amountPaid,
        change,
      });

      // Print receipt if enabled
      if (enableReceiptPrinting) {
        printReceipt();
      }

      // Refresh product data to reflect updated stock levels
      await refreshProducts();

      // Clear cart and close dialog
      clearCart();
      setShowPaymentDialog(false);

      alert('Sale completed successfully!');
    } catch (error) {
      console.error('Error processing sale:', error);
      alert(`There was an error processing the sale: ${(error as Error).message || 'Please try again.'}`);
    }
  };

  const printReceipt = () => {
    // In a real implementation, this would interface with a receipt printer
    console.log('Printing receipt...')
  }

  const handleBarcodeInput = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput) {
      await handleBarcodeScan(barcodeInput)
      setBarcodeInput('')
    }
  }

  const login = () => {
    // Mock login - in real app this would authenticate
    setCurrentCashier({ name: 'John Doe', id: '1' })
    setIsLocked(false)
  }

  const logout = () => {
    setCurrentCashier(null)
    setIsLocked(true)
    clearCart()
  }

  // Function to apply custom VAT settings
  const applyCustomVat = () => {
    setShowVatDialog(false)
  }

  // Function to remove VAT
  const removeVat = () => {
    setCustomTaxRate(0)
    setShowVatDialog(false)
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-muted-foreground">{storeName}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Please login to continue</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cashier-id">Cashier ID</Label>
              <Input id="cashier-id" placeholder="Enter your cashier ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input id="pin" type="password" placeholder="Enter your PIN" />
            </div>
            <Button onClick={login} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{title}</h1>
            <Badge variant="outline">{storeName}</Badge>
          </div>

          <div className="flex items-center gap-4">
            {currentCashier && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{currentCashier.name}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <Unlock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {/* Advanced Search */}
          <div className="space-y-2">
            <AdvancedSearch
              config={{
                collections: ['products'],
                enableFuzzySearch: true,
                searchPriority: true,
                limit: 50,
                debounceMs: 200,
              }}
              placeholder="Search products, SKU, barcode, or brand..."
              enableFilters={false}
              enableSuggestions={true}
              onResultSelect={handleSearchResult}
              maxResults={10}
              className="w-full"
            />

            <div className="flex items-center gap-2">
              {enableBarcodeScanning && (
                <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ScanLine className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Scan Barcode</DialogTitle>
                    </DialogHeader>
                    <BarcodeScanner
                      onScan={handleBarcodeScan}
                      onError={(error: string) => console.error('Scanner error:', error)}
                      isActive={showBarcodeScanner}
                      enableTorch={true}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {enableBarcodeScanning && (
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Barcode scanner input..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeInput}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 overflow-auto">
            {isLoadingProducts ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No products found</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                )}
              </div>
            ) : (
              products.map((product) => (
                <Card
                  key={product.id}
                  className={cn(
                    'cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                    product.inStock <= 0 && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => product.inStock > 0 && addToCart(product)}
                >
                  <CardContent className="p-3">
                    {product.images?.[0] && (
                      <div className="aspect-square relative mb-2">
                        <Image
                          src={product.images[0].image.url}
                          alt={product.images[0].image.alt}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">SKU: {product.sku}</p>
                    {product.barcode && (
                      <p className="text-xs text-muted-foreground mb-1 font-mono">
                        Barcode: {product.barcode}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                      <Badge
                        variant={product.inStock > 0 ? 'default' : 'destructive'}
                        className={cn(
                          'text-xs',
                          product.inStock > 0
                            ? product.inStock <= 5 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
                        )}
                      >
                        {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart ({cart.length})
              </h2>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear
              </Button>
            </div>

            {/* Customer */}
            <div className="mt-3">
              <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    {customer ? customer.name : 'Add Customer'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Customer Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer-name">Name</Label>
                      <Input
                        id="customer-name"
                        placeholder="Customer name"
                        value={customer?.name || ''}
                        onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-phone">Phone</Label>
                      <Input
                        id="customer-phone"
                        placeholder="Phone number"
                        value={customer?.phone || ''}
                        onChange={(e) =>
                          setCustomer((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                    <Button onClick={() => setShowCustomerDialog(false)} className="w-full">
                      Save Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Search or scan products to add</p>
              </div>
            ) : (
              cart.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} each
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            Stock: {item.product.inStock}
                          </span>
                          {item.quantity >= item.product.inStock && (
                            <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                              Max available
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity >= item.product.inStock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {formatPrice(item.lineTotal - item.discount)}
                        </div>
                        {item.discount > 0 && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            -{formatPrice(item.discount)}
                          </div>
                        )}
                      </div>
                    </div>

                    {discountSettings?.enableLineItemDiscounts && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedItemForDiscount(item.id)
                          setShowDiscountDialog(true)
                        }}
                      >
                        <Percent className="h-4 w-4 mr-2" />
                        Discount
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {!taxIncluded && (
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* VAT Settings Button */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVatDialog(true)}
                  className="flex-1"
                >
                  VAT Settings
                </Button>
              </div>

              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Charge {formatPrice(total)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Process Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatPrice(total)}</div>
                      <p className="text-muted-foreground">Amount to charge</p>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods
                            ?.filter((pm) => pm.enabled)
                            .map((method) => (
                              <SelectItem key={method.method} value={method.method}>
                                <div className="flex items-center gap-2">
                                  {method.method === 'cash' && <Banknote className="h-4 w-4" />}
                                  {method.method === 'mpesa' && <Smartphone className="h-4 w-4" />}
                                  {(method.method === 'credit_card' ||
                                    method.method === 'debit_card') && (
                                    <CreditCard className="h-4 w-4" />
                                  )}
                                  <span className="capitalize">
                                    {method.method.replace('_', ' ')}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod === 'cash' && (
                      <div>
                        <Label htmlFor="amount-paid">Amount Paid</Label>
                        <Input
                          id="amount-paid"
                          type="number"
                          placeholder="Enter amount received"
                          value={amountPaid || ''}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                        />
                        {amountPaid > 0 && (
                          <div className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <span>Change due:</span>
                              <span
                                className={
                                  change < 0
                                    ? 'text-red-500 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }
                              >
                                {formatPrice(Math.abs(change))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={processSale}
                      disabled={!paymentMethod || (paymentMethod === 'cash' && change < 0)}
                      className="w-full"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Complete Sale
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discount-amount">Discount Amount (KES)</Label>
              <Input
                id="discount-amount"
                type="number"
                placeholder="Enter discount amount"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedItemForDiscount) {
                    const discountAmount = Number((e.target as HTMLInputElement).value)
                    applyDiscount(selectedItemForDiscount, discountAmount)
                    setShowDiscountDialog(false)
                    setSelectedItemForDiscount(null)
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* VAT Settings Dialog */}
      <Dialog open={showVatDialog} onOpenChange={setShowVatDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>VAT Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vat-rate">VAT Rate (%)</Label>
              <Input
                id="vat-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter VAT rate"
                value={customTaxRate !== null ? customTaxRate : taxSettings?.defaultTaxRate || 16}
                onChange={(e) => setCustomTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="vat-included"
                checked={
                  customTaxIncluded !== null ? customTaxIncluded : taxSettings?.taxIncluded || false
                }
                onCheckedChange={(checked: boolean) => setCustomTaxIncluded(checked)}
              />
              <Label htmlFor="vat-included">Tax Included in Prices</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyCustomVat} className="flex-1">
                Apply VAT
              </Button>
              <Button variant="outline" onClick={removeVat} className="flex-1">
                Remove VAT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default POSComponent
