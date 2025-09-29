'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { InventoryManagementBlock as InventoryManagementBlockType } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  Search,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  BarChart3,
  Download,
  Edit,
  History,
  Truck,
  ScanLine,
  Camera,
  Save,
  X,
  Filter,
  Eye,
} from 'lucide-react'
import Image from 'next/image'
import BarcodeScanner from '../../components/BarcodeScanner'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { SearchResult } from '@/lib/advancedSearch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// Define types for our inventory data
interface InventoryItem {
  id: string
  product: {
    id: string
    title: string
    sku: string
    barcode?: string
    images?: Array<{
      image: {
        url: string
        alt: string
      }
    }>
    price: number
    inStock: number
    lowStockThreshold?: number
    costPrice?: number
    // Add variant information with images
    sizes?: Array<{
      sizeName: string
      sizeCode?: string
      inStock: boolean
      stockQuantity: number
      // Add size variant images
      images?: Array<{
        image: {
          url: string
          alt: string
        }
      }>
    }>
    colors?: Array<{
      colorName: string
      colorCode?: string
      // Add color variant images
      images?: Array<{
        image: {
          url: string
          alt: string
        }
      }>
    }>
  }
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  location: {
    warehouse: string
    aisle: string
    shelf: string
  }
  lastUpdated: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  supplier: {
    name: string
    leadTime: number
    contact?: string
  }
  costPrice: number
  totalValue: number
  stockMovements?: Array<{
    type: 'sale' | 'restock' | 'return' | 'damage' | 'loss' | 'adjustment'
    quantity: number
    previousStock: number
    newStock: number
    reason: string
    reference?: string
    user?: string
    timestamp: string
  }>
}

interface Supplier {
  id: string
  name: string
  contact?: string
  phone?: string
  email?: string
  leadTime?: number
}

type Props = InventoryManagementBlockType

const InventoryManagementComponent: React.FC<Props> = ({
  title = 'Inventory Management',
  enableBulkActions = true,
  enableStockAlerts = true,
}) => {
  // Default values for properties not in the block type
  const enableStockTransfers = true
  const enableStockHistory = true
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showStockAdjustment, setShowStockAdjustment] = useState(false)
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = useState<string | null>(null)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [showReorderDialog, setShowReorderDialog] = useState(false)
  const [reorderItems, setReorderItems] = useState<string[]>([])
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scannedProduct, setScannedProduct] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [showStockHistory, setShowStockHistory] = useState(false)
  const [selectedItemHistory, setSelectedItemHistory] = useState<InventoryItem | null>(null)
  const [showSupplierDialog, setShowSupplierDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // State for new product form
  const [newProduct, setNewProduct] = useState({
    title: '',
    sku: '',
    barcode: '',
    price: 0,
    costPrice: 0,
    inStock: 0,
    lowStockThreshold: 5,
  })

  // State for supplier form
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    leadTime: 7,
  })

  // State for variant restocking
  const [showVariantRestock, setShowVariantRestock] = useState(false)
  const [selectedItemForVariantRestock, setSelectedItemForVariantRestock] = useState<string | null>(
    null,
  )
  const [selectedVariant, setSelectedVariant] = useState<{ size?: string; color?: string } | null>(
    null,
  )
  const [variantAdjustmentQuantity, setVariantAdjustmentQuantity] = useState(0)
  const [variantAdjustmentReason, setVariantAdjustmentReason] = useState('')

  // Fetch products from the database
  const fetchProducts = useCallback(async (query?: string) => {
    setIsLoadingProducts(true)
    setLoading(true)

    try {
      // Build query parameters properly
      const params = new URLSearchParams()
      params.append('limit', '100')
      params.append('where[status][not_equals]', 'draft')
      params.append('depth', '2')

      if (query) {
        params.append('q', query)
      }

      const response = await fetch(`/api/products?${params.toString()}`)

      if (response.ok) {
        const result = await response.json()
        setProducts(result.docs || [])

        // Transform products to inventory items
        const inventoryItems: InventoryItem[] =
          result.docs?.map((product: any) => ({
            id: product.id,
            product: {
              id: product.id,
              title: product.title,
              sku: product.sku,
              barcode: product.barcode,
              images: product.images,
              price: product.price,
              inStock: product.inStock,
              lowStockThreshold: product.lowStockThreshold,
              costPrice: product.costPrice,
              // Include variant information with images
              sizes:
                product.sizes?.map((size: any) => ({
                  sizeName: size.sizeName,
                  sizeCode: size.sizeCode,
                  inStock: size.inStock,
                  stockQuantity: size.stockQuantity,
                  // Include size variant images
                  images: size.images,
                })) || [],
              colors:
                product.colors?.map((color: any) => ({
                  colorName: color.colorName,
                  colorCode: color.colorCode,
                  // Include color variant images
                  images: color.images,
                })) || [],
            },
            currentStock: product.inStock,
            minStockLevel: product.lowStockThreshold || 5,
            maxStockLevel: 100, // Default value
            reorderPoint: product.lowStockThreshold || 5,
            location: { warehouse: 'Main Store', aisle: 'A1', shelf: '1' }, // Default values
            lastUpdated: product.updatedAt || new Date().toISOString(),
            status:
              product.inStock === 0
                ? 'out_of_stock'
                : product.inStock <= (product.lowStockThreshold || 5)
                  ? 'low_stock'
                  : 'in_stock',
            supplier: product.supplier
              ? {
                  name: product.supplier.name || 'Unknown Supplier',
                  leadTime: product.supplier.leadTime || 7,
                  contact: product.supplier.contactPerson || '',
                }
              : { name: 'Default Supplier', leadTime: 7, contact: '' },
            costPrice: product.costPrice || product.price * 0.6, // Estimate cost price
            totalValue: product.inStock * (product.costPrice || product.price * 0.6),
          })) || []

        setInventoryData(inventoryItems)
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load inventory data. Please try again later.')
    } finally {
      setIsLoadingProducts(false)
      setLoading(false)
    }
  }, [])

  // Fetch inventory data from the inventory collection
  const fetchInventoryData = useCallback(async () => {
    try {
      const response = await fetch('/api/inventory?depth=2&limit=100')

      if (response.ok) {
        const result = await response.json()
        // Merge inventory data with product data
        setInventoryData((prevData) =>
          prevData.map((item) => {
            const inventoryRecord = result.docs?.find((inv: any) => inv.product === item.product.id)
            if (inventoryRecord) {
              return {
                ...item,
                minStockLevel: inventoryRecord.minStockLevel,
                maxStockLevel: inventoryRecord.maxStockLevel || 100,
                reorderPoint: inventoryRecord.reorderPoint || inventoryRecord.minStockLevel,
                location: inventoryRecord.location || item.location,
                supplier: inventoryRecord.supplier
                  ? {
                      name: inventoryRecord.supplier.name || 'Unknown Supplier',
                      leadTime: inventoryRecord.supplier.leadTime || 7,
                      contact: inventoryRecord.supplier.contactPerson || '',
                    }
                  : { name: 'Default Supplier', leadTime: 7, contact: '' },
                stockMovements: inventoryRecord.stockMovements || [],
              }
            }
            return item
          }),
        )
      }
    } catch (error) {
      console.error('Failed to fetch inventory data:', error)
    }
  }, [])

  // Fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch('/api/suppliers?limit=100')

      if (response.ok) {
        const result = await response.json()
        const supplierData: Supplier[] =
          result.docs?.map((sup: any) => ({
            id: sup.id,
            name: sup.name,
            contact: sup.contactPerson,
            phone: sup.phone,
            email: sup.email,
            leadTime: sup.leadTime || 7,
          })) || []

        setSuppliers(supplierData)
      } else {
        console.error('Failed to fetch suppliers')
        // Fallback to mock data
        setSuppliers([
          { id: '1', name: 'Default Supplier', leadTime: 7 },
          { id: '2', name: 'Premium Supplier', leadTime: 3, contact: 'John Doe' },
          { id: '3', name: 'Budget Supplier', leadTime: 14, contact: 'Jane Smith' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      // Fallback to mock data
      setSuppliers([
        { id: '1', name: 'Default Supplier', leadTime: 7 },
        { id: '2', name: 'Premium Supplier', leadTime: 3, contact: 'John Doe' },
        { id: '3', name: 'Budget Supplier', leadTime: 14, contact: 'Jane Smith' },
      ])
    }
  }, [])

  // Find product by barcode
  const findProductByBarcode = useCallback(async (barcode: string) => {
    try {
      const params = new URLSearchParams()
      params.append('where[barcode][equals]', barcode)
      params.append('where[status][not_equals]', 'draft')
      params.append('limit', '1')
      params.append('depth', '2')

      const response = await fetch(`/api/products?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        return data.docs?.[0] || null
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error(
          'Failed to find product by barcode:',
          response.status,
          response.statusText,
          errorText,
        )
        return null
      }
    } catch (error) {
      console.error('Error finding product by barcode:', error)
      return null
    }
  }, [])

  // Handle advanced search result selection
  const handleSearchResult = useCallback(
    async (result: SearchResult) => {
      if (result.collection === 'products') {
        setIsSearching(true)
        try {
          const response = await fetch(`/api/products/${result.id}?depth=2`)

          if (response.ok) {
            const productData = await response.json()
            const inventoryItem = inventoryData.find((item) => item.product.id === productData.id)
            if (inventoryItem) {
              setSelectedItems([inventoryItem.id])
              setSelectedItemForAdjustment(inventoryItem.id)
              setShowStockAdjustment(true)
            } else {
              toast.error(`Product "${productData.title}" not found in inventory`)
            }
          } else {
            const errorText = await response.text().catch(() => 'Unknown error')
            console.error(
              'Failed to fetch product:',
              response.status,
              response.statusText,
              errorText,
            )
            toast.error('Failed to load product details. Please try again.')
          }
        } catch (error) {
          console.error('Error fetching product:', error)
          toast.error(
            'Network error while loading product. Please check your connection and try again.',
          )
        } finally {
          setIsSearching(false)
        }
      }
    },
    [inventoryData],
  )

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchQuery('')
  }, [])

  // Load data on component mount
  useEffect(() => {
    console.log('Inventory Management component mounted, fetching products...')
    fetchProducts()
    fetchSuppliers()
  }, [fetchProducts, fetchSuppliers])

  // Fetch inventory data after products are loaded
  useEffect(() => {
    if (products.length > 0) {
      fetchInventoryData()
    }
  }, [products, fetchInventoryData])

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredAndSortedData = useMemo(() => {
    const filtered = inventoryData.filter((item) => {
      const matchesSearch =
        item.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.product.barcode && item.product.barcode.includes(searchQuery))

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in_stock' && item.status === 'in_stock') ||
        (statusFilter === 'low_stock' && item.status === 'low_stock') ||
        (statusFilter === 'out_of_stock' && item.status === 'out_of_stock') ||
        (statusFilter === 'restock' && item.currentStock <= item.reorderPoint)

      return matchesSearch && matchesStatus
    })

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.product.title.localeCompare(b.product.title)
        case 'sku':
          return a.product.sku.localeCompare(b.product.sku)
        case 'stock_asc':
          return a.currentStock - b.currentStock
        case 'stock_desc':
          return b.currentStock - a.currentStock
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [inventoryData, searchQuery, statusFilter, sortBy])

  const stockAlerts = inventoryData.filter(
    (item) => item.status === 'low_stock' || item.status === 'out_of_stock',
  )

  // Items that need restocking (at or below reorder point)
  const restockItems = inventoryData.filter((item) => item.currentStock <= item.reorderPoint)

  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0)
  const totalItems = inventoryData.reduce((sum, item) => sum + item.currentStock, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
          >
            In Stock
          </Badge>
        )
      case 'low_stock':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
          >
            Low Stock
          </Badge>
        )
      case 'out_of_stock':
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          >
            Out of Stock
          </Badge>
        )
      case 'discontinued':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-border"
          >
            Discontinued
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-border text-foreground">
            Unknown
          </Badge>
        )
    }
  }

  // Update product stock in the database
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
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const updatedProduct = await response.json()
      return updatedProduct
    } catch (error) {
      console.error('Error updating product stock:', error)
      throw error
    }
  }, [])

  // Update variant stock in the database
  const updateVariantStock = useCallback(async (productId: string, sizes: any[]) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sizes: sizes,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const updatedProduct = await response.json()
      return updatedProduct
    } catch (error) {
      console.error('Error updating variant stock:', error)
      throw error
    }
  }, [])

  // Add stock movement to inventory record
  const addStockMovement = useCallback(
    async (
      inventoryId: string,
      type: 'sale' | 'restock' | 'return' | 'damage' | 'loss' | 'adjustment',
      quantity: number,
      reason: string,
      previousStock: number,
      newStock: number,
    ) => {
      try {
        // In a real implementation, you would add the stock movement to the inventory record
        console.log('Adding stock movement:', {
          inventoryId,
          type,
          quantity,
          reason,
          previousStock,
          newStock,
        })
        // This would typically be a POST to /api/inventory/:id/stock-movements
        return true
      } catch (error) {
        console.error('Error adding stock movement:', error)
        return false
      }
    },
    [],
  )

  const handleStockAdjustment = async (itemId: string, quantity: number, reason: string) => {
    const toastId = toast.loading('Adjusting stock...')
    try {
      setInventoryData((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const newStock = Math.max(0, item.currentStock + quantity)
            const newStatus =
              newStock === 0
                ? 'out_of_stock'
                : newStock <= item.minStockLevel
                  ? 'low_stock'
                  : 'in_stock'

            return {
              ...item,
              currentStock: newStock,
              status: newStatus,
              totalValue: newStock * item.costPrice,
              lastUpdated: new Date().toISOString(),
            }
          }
          return item
        }),
      )

      // Find the item to get product ID
      const item = inventoryData.find((item) => item.id === itemId)
      if (item) {
        // Update product stock in database
        await updateProductStock(item.product.id, item.currentStock + quantity)

        // Add stock movement record
        const inventoryRecord = inventoryData.find((i) => i.product.id === item.product.id)
        if (inventoryRecord) {
          await addStockMovement(
            inventoryRecord.id,
            quantity > 0 ? 'restock' : 'adjustment',
            Math.abs(quantity),
            reason,
            item.currentStock,
            item.currentStock + quantity,
          )
        }
      }

      console.log('Stock adjustment:', { itemId, quantity, reason })
      setShowStockAdjustment(false)
      setSelectedItemForAdjustment(null)
      setAdjustmentQuantity(0)
      setAdjustmentReason('')
      toast.success('Stock adjusted successfully', { id: toastId })
    } catch (error) {
      console.error('Error adjusting stock:', error)
      toast.error('Failed to adjust stock. Please try again.', { id: toastId })
    }
  }

  // Handle variant stock adjustment
  const handleVariantStockAdjustment = async (
    itemId: string,
    variant: { size?: string; color?: string },
    quantity: number,
    reason: string,
  ) => {
    const toastId = toast.loading('Adjusting variant stock...')
    try {
      // Find the item to get product ID
      const item = inventoryData.find((item) => item.id === itemId)
      if (!item) {
        throw new Error('Item not found')
      }

      // Update the specific variant stock
      const updatedSizes =
        item.product.sizes?.map((size) => {
          if (size.sizeName === variant.size) {
            const newStock = Math.max(0, size.stockQuantity + quantity)
            return {
              ...size,
              stockQuantity: newStock,
              inStock: newStock > 0,
            }
          }
          return size
        }) || []

      // Recalculate total product stock
      const totalStock = updatedSizes.reduce((sum, size) => sum + size.stockQuantity, 0)

      const newStatus =
        totalStock === 0
          ? 'out_of_stock'
          : totalStock <= item.minStockLevel
            ? 'low_stock'
            : 'in_stock'

      // Update state
      setInventoryData((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              product: {
                ...item.product,
                sizes: updatedSizes,
                inStock: totalStock,
              },
              currentStock: totalStock,
              status: newStatus,
              totalValue: totalStock * item.costPrice,
              lastUpdated: new Date().toISOString(),
            }
          }
          return item
        }),
      )

      // Update product stock in database
      await updateProductStock(item.product.id, totalStock)

      // Update variant stock in database
      await updateVariantStock(item.product.id, updatedSizes)

      // Add stock movement record
      const inventoryRecord = inventoryData.find((i) => i.product.id === item.product.id)
      if (inventoryRecord) {
        await addStockMovement(
          inventoryRecord.id,
          quantity > 0 ? 'restock' : 'adjustment',
          Math.abs(quantity),
          `${reason} - ${variant.size ? `Size: ${variant.size}` : ''}${variant.color ? ` Color: ${variant.color}` : ''}`,
          item.currentStock,
          totalStock,
        )
      }

      console.log('Variant stock adjustment:', { itemId, variant, quantity, reason })
      setShowVariantRestock(false)
      setSelectedItemForVariantRestock(null)
      setSelectedVariant(null)
      setVariantAdjustmentQuantity(0)
      setVariantAdjustmentReason('')
      toast.success('Variant stock adjusted successfully', { id: toastId })
    } catch (error) {
      console.error('Error adjusting variant stock:', error)
      toast.error('Failed to adjust variant stock. Please try again.', { id: toastId })
    }
  }

  const handleBulkAdjustment = () => {
    console.log('Bulk adjustment for items:', selectedItems)
    // Implementation for bulk adjustment
  }

  const generateReorderReport = () => {
    const itemsToReorder = inventoryData.filter((item) => item.currentStock <= item.reorderPoint)
    setReorderItems(itemsToReorder.map((item) => item.id))
    setShowReorderDialog(true)
  }

  const exportReorderReport = () => {
    const itemsToReorder = inventoryData.filter((item) => reorderItems.includes(item.id))

    // Create CSV content
    const headers = [
      'Product Name',
      'SKU',
      'Current Stock',
      'Reorder Point',
      'Suggested Order Quantity',
      'Supplier',
      'Lead Time (Days)',
      'Cost Price',
      'Total Cost',
    ]
    const rows = itemsToReorder.map((item) => [
      item.product.title,
      item.product.sku,
      item.currentStock.toString(),
      item.reorderPoint.toString(),
      Math.max(10, item.reorderPoint * 2).toString(), // Suggested order quantity
      item.supplier.name,
      item.supplier.leadTime.toString(),
      formatPrice(item.costPrice),
      formatPrice(item.costPrice * Math.max(10, item.reorderPoint * 2)),
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `reorder-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportInventory = () => {
    // Create CSV content
    const headers = [
      'Product Name',
      'SKU',
      'Barcode',
      'Current Stock',
      'Min Stock Level',
      'Max Stock Level',
      'Reorder Point',
      'Status',
      'Location',
      'Supplier',
      'Cost Price',
      'Total Value',
    ]
    const rows = inventoryData.map((item) => [
      item.product.title,
      item.product.sku,
      item.product.barcode || '',
      item.currentStock.toString(),
      item.minStockLevel.toString(),
      item.maxStockLevel.toString(),
      item.reorderPoint.toString(),
      item.status,
      `${item.location.warehouse} - ${item.location.aisle}-${item.location.shelf}`,
      item.supplier.name,
      formatPrice(item.costPrice),
      formatPrice(item.totalValue),
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePurchaseOrder = () => {
    const itemsToOrder = inventoryData.filter((item) => reorderItems.includes(item.id))

    // In a real implementation, this would generate a proper purchase order
    // For now, we'll just show a toast with the items that would be ordered
    const orderDetails = itemsToOrder
      .map((item) => {
        const suggestedOrder = Math.max(10, item.reorderPoint * 2)
        return `${item.product.title} - ${suggestedOrder} units from ${item.supplier.name}`
      })
      .join('\n')

    toast.success(`Purchase Order Generated!

Items to order:
${orderDetails}

This would typically be sent to the supplier via email or integrated with a procurement system.`)
    setShowReorderDialog(false)
  }

  // Barcode scanning functionality
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
        // Find the inventory item for this product
        const inventoryItem = inventoryData.find((item) => item.product.id === product.id)

        if (inventoryItem) {
          setScannedProduct(inventoryItem)
          setSelectedItemForAdjustment(inventoryItem.id)
          setShowStockAdjustment(true)
          setShowBarcodeScanner(false)
        } else {
          toast.error(`Product "${product.title}" not found in inventory`)
        }
      } else {
        // Show error - product not found
        toast.error(`Product with barcode ${barcode} not found`)
      }
    },
    [products, findProductByBarcode, inventoryData],
  )

  const handleBarcodeInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput) {
      handleBarcodeScan(barcodeInput)
      setBarcodeInput('')
    }
  }

  // Add a new product
  const handleAddProduct = async () => {
    const toastId = toast.loading('Adding product...')
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          status: newProduct.inStock > 0 ? 'published' : 'out-of-stock',
        }),
      })

      if (response.ok) {
        const product = await response.json()
        console.log('Product added:', product)
        setShowAddProductDialog(false)
        setNewProduct({
          title: '',
          sku: '',
          barcode: '',
          price: 0,
          costPrice: 0,
          inStock: 0,
          lowStockThreshold: 5,
        })
        // Refresh the product list
        fetchProducts()
        toast.success('Product added successfully', { id: toastId })
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product. Please try again.', { id: toastId })
    }
  }

  // View stock history
  const viewStockHistory = (item: InventoryItem) => {
    setSelectedItemHistory(item)
    setShowStockHistory(true)
  }

  // Add a new supplier
  const handleAddSupplier = async () => {
    const toastId = toast.loading('Adding supplier...')
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSupplier.name,
          contactPerson: newSupplier.contact,
          phone: newSupplier.phone,
          email: newSupplier.email,
          leadTime: newSupplier.leadTime,
          active: true,
        }),
      })

      if (response.ok) {
        const supplier = await response.json()
        console.log('Supplier added:', supplier)
        setShowSupplierDialog(false)
        setNewSupplier({
          name: '',
          contact: '',
          phone: '',
          email: '',
          leadTime: 7,
        })
        // Refresh the supplier list
        fetchSuppliers()
        toast.success('Supplier added successfully', { id: toastId })
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('Error adding supplier:', error)
      toast.error('Failed to add supplier. Please try again.', { id: toastId })
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-foreground" />
            <span className="ml-2 text-foreground">Loading inventory data...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Error Loading Inventory</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{inventoryData.length} products</span>
              <span>{totalItems} total units</span>
              <span>{formatPrice(totalValue)} total value</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddProductDialog(true)}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateReorderReport}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reorder Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportInventory}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stock Alerts */}
        {enableStockAlerts && stockAlerts.length > 0 && (
          <Card className="mb-6 border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Stock Alerts ({stockAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stockAlerts.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-card rounded border border-border"
                  >
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {item.product.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.currentStock} units (min: {item.minStockLevel})
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {stockAlerts.length > 6 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    View All {stockAlerts.length} Alerts
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={generateReorderReport}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reorder Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restock Items
        {restockItems.length > 0 && (
          <Card className="mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <AlertTriangle className="h-5 w-5" />
                Items Needing Restock ({restockItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {restockItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-card rounded border border-border"
                  >
                    <div>
                      <div className="font-medium text-sm text-foreground">{item.product.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.currentStock} units (reorder at: {item.reorderPoint})
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Restock
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {restockItems.length > 6 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateReorderReport}
                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    View All {restockItems.length} Items
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={generateReorderReport}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reorder Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Filters and Search */}
        <Card className="mb-6 bg-card text-card-foreground border-border">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                {/* Advanced Search */}
                <AdvancedSearch
                  config={{
                    collections: ['products'],
                    enableFuzzySearch: true,
                    searchPriority: true,
                    limit: 50,
                    debounceMs: 200,
                    filters: {
                      // Only show products that are in inventory
                      'inventory.exists': true,
                    },
                  }}
                  placeholder="Search inventory by product name, SKU, barcode..."
                  enableFilters={false}
                  enableSuggestions={true}
                  onResultSelect={handleSearchResult}
                  maxResults={10}
                  className="mb-2"
                />

                {/* Barcode Scanner Integration */}
                <div className="flex gap-2">
                  <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <ScanLine className="h-4 w-4 mr-2" />
                        Scan Barcode
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-background text-foreground">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Scan Product Barcode</DialogTitle>
                      </DialogHeader>
                      <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onError={(error: string) => console.error('Scanner error:', error)}
                        isActive={showBarcodeScanner}
                        enableTorch={true}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Manual Barcode Input */}
                  <div className="relative flex-1">
                    <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Or enter barcode manually..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={handleBarcodeInput}
                      className="pl-10 border-input text-foreground bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 border-input text-foreground bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="restock">Needs Restock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-input text-foreground bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border-border">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="sku">SKU</SelectItem>
                    <SelectItem value="stock_asc">Stock (Low to High)</SelectItem>
                    <SelectItem value="stock_desc">Stock (High to Low)</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts()}
                  className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {enableBulkActions && selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkAdjustment}
                      className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Bulk Adjust
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Bulk Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedItems([])}
                      className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {enableBulkActions && (
                    <TableHead className="w-12 text-foreground">
                      <Checkbox
                        checked={selectedItems.length === filteredAndSortedData.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(filteredAndSortedData.map((item) => item.id))
                          } else {
                            setSelectedItems([])
                          }
                        }}
                      />
                    </TableHead>
                  )}
                  <TableHead className="text-foreground">Product</TableHead>
                  <TableHead className="text-foreground">SKU</TableHead>
                  <TableHead className="text-foreground">Barcode</TableHead>
                  <TableHead className="text-foreground">Current Stock</TableHead>
                  <TableHead className="text-foreground">Min/Max</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Location</TableHead>
                  <TableHead className="text-foreground">Value</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-border">
                    {enableBulkActions && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems([...selectedItems, item.id])
                            } else {
                              setSelectedItems(selectedItems.filter((id) => id !== item.id))
                            }
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Show variant image with improved size and styling */}
                        <div className="w-12 h-12 relative rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                          {item.product.sizes &&
                          item.product.sizes.length > 0 &&
                          item.product.sizes[0].images?.[0] ? (
                            <Image
                              src={item.product.sizes[0].images[0].image.url}
                              alt={item.product.sizes[0].images[0].image.alt}
                              fill
                              className="object-cover"
                            />
                          ) : item.product.colors &&
                            item.product.colors.length > 0 &&
                            item.product.colors[0].images?.[0] ? (
                            <Image
                              src={item.product.colors[0].images[0].image.url}
                              alt={item.product.colors[0].images[0].image.alt}
                              fill
                              className="object-cover"
                            />
                          ) : item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].image.url}
                              alt={item.product.images[0].image.alt}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 dark:text-gray-500 text-xs">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.product.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)}
                          </div>
                          {/* Show variant information if available */}
                          {item.product.sizes && item.product.sizes.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.product.sizes.length} variants
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                        {item.product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      {item.product.barcode ? (
                        <code className="text-xs bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded font-mono text-blue-800 dark:text-blue-200">
                          {item.product.barcode}
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-sm">No barcode</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.currentStock}</span>
                        {item.currentStock <= item.reorderPoint && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        {/* Show variant restock button if variants exist */}
                        {item.product.sizes && item.product.sizes.length > 0 && (
                          <Dialog
                            open={showVariantRestock && selectedItemForVariantRestock === item.id}
                            onOpenChange={(open) => {
                              setShowVariantRestock(open)
                              if (!open) {
                                setSelectedItemForVariantRestock(null)
                                setSelectedVariant(null)
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedItemForVariantRestock(item.id)}
                                className="border-input text-foreground hover:bg-accent hover:text-accent-foreground ml-2"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Variants
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-background text-foreground max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">
                                  Restock Variants - {item.product.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Show selected variant image */}
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                    {selectedVariant?.size &&
                                    item.product.sizes?.find(
                                      (size) => size.sizeName === selectedVariant.size,
                                    )?.images?.[0] ? (
                                      <Image
                                        src={
                                          item.product.sizes.find(
                                            (size) => size.sizeName === selectedVariant.size,
                                          )!.images![0].image.url
                                        }
                                        alt={
                                          item.product.sizes.find(
                                            (size) => size.sizeName === selectedVariant.size,
                                          )!.images![0].image.alt
                                        }
                                        fill
                                        className="object-contain rounded"
                                      />
                                    ) : selectedVariant?.color &&
                                      item.product.colors?.find(
                                        (color) => color.colorName === selectedVariant.color,
                                      )?.images?.[0] ? (
                                      <Image
                                        src={
                                          item.product.colors.find(
                                            (color) => color.colorName === selectedVariant.color,
                                          )!.images![0].image.url
                                        }
                                        alt={
                                          item.product.colors.find(
                                            (color) => color.colorName === selectedVariant.color,
                                          )!.images![0].image.alt
                                        }
                                        fill
                                        className="object-contain rounded"
                                      />
                                    ) : item.product.images?.[0] ? (
                                      <Image
                                        src={item.product.images[0].image.url}
                                        alt={item.product.images[0].image.alt}
                                        fill
                                        className="object-contain rounded"
                                      />
                                    ) : (
                                      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                                          No image
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">{item.product.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedVariant?.size && `Size: ${selectedVariant.size}`}
                                      {selectedVariant?.color && `Color: ${selectedVariant.color}`}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-foreground">
                                    Current Stock: {item.currentStock}
                                  </Label>
                                </div>

                                {/* Variant Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                  {item.product.sizes && item.product.sizes.length > 0 && (
                                    <div>
                                      <Label className="text-foreground">Size</Label>
                                      <Select
                                        value={selectedVariant?.size || ''}
                                        onValueChange={(value) =>
                                          setSelectedVariant((prev) => ({ ...prev, size: value }))
                                        }
                                      >
                                        <SelectTrigger className="border-input text-foreground bg-background">
                                          <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background text-foreground border-border">
                                          {item.product.sizes.map((size) => (
                                            <SelectItem key={size.sizeName} value={size.sizeName}>
                                              {size.sizeName} ({size.stockQuantity} in stock)
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  {item.product.colors && item.product.colors.length > 0 && (
                                    <div>
                                      <Label className="text-foreground">Color</Label>
                                      <Select
                                        value={selectedVariant?.color || ''}
                                        onValueChange={(value) =>
                                          setSelectedVariant((prev) => ({ ...prev, color: value }))
                                        }
                                      >
                                        <SelectTrigger className="border-input text-foreground bg-background">
                                          <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background text-foreground border-border">
                                          {item.product.colors.map((color) => (
                                            <SelectItem
                                              key={color.colorName}
                                              value={color.colorName}
                                            >
                                              {color.colorName}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>

                                {/* Quantity Adjustment */}
                                <div>
                                  <Label htmlFor="variant-adjustment" className="text-foreground">
                                    Adjustment Quantity
                                  </Label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setVariantAdjustmentQuantity((prev) => prev - 1)
                                      }
                                      className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                                      disabled={variantAdjustmentQuantity <= -item.currentStock}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      id="variant-adjustment"
                                      type="number"
                                      value={variantAdjustmentQuantity}
                                      onChange={(e) =>
                                        setVariantAdjustmentQuantity(Number(e.target.value))
                                      }
                                      className="w-20 text-center border-input text-foreground bg-background"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setVariantAdjustmentQuantity((prev) => prev + 1)
                                      }
                                      className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Reason */}
                                <div>
                                  <Label htmlFor="variant-reason" className="text-foreground">
                                    Reason
                                  </Label>
                                  <Select
                                    value={variantAdjustmentReason}
                                    onValueChange={setVariantAdjustmentReason}
                                  >
                                    <SelectTrigger className="border-input text-foreground bg-background">
                                      <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background text-foreground border-border">
                                      <SelectItem value="restock">Restock</SelectItem>
                                      <SelectItem value="damage">Damage/Loss</SelectItem>
                                      <SelectItem value="return">Customer Return</SelectItem>
                                      <SelectItem value="adjustment">
                                        Inventory Count Adjustment
                                      </SelectItem>
                                      <SelectItem value="transfer">Store Transfer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Apply Button */}
                                <Button
                                  onClick={() => {
                                    if (selectedVariant?.size || selectedVariant?.color) {
                                      handleVariantStockAdjustment(
                                        item.id,
                                        selectedVariant,
                                        variantAdjustmentQuantity,
                                        variantAdjustmentReason,
                                      )
                                    }
                                  }}
                                  disabled={
                                    (!selectedVariant?.size && !selectedVariant?.color) ||
                                    !variantAdjustmentReason
                                  }
                                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                  Apply Adjustment
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {item.minStockLevel} / {item.maxStockLevel}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        <div>{item.location.warehouse}</div>
                        <div className="text-muted-foreground">
                          {item.location.aisle}-{item.location.shelf}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">
                          {formatPrice(item.totalValue)}
                        </div>
                        <div className="text-muted-foreground">@ {formatPrice(item.costPrice)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Replace the existing stock adjustment dialog with a simplified version */}
                        <Dialog
                          open={showStockAdjustment && selectedItemForAdjustment === item.id}
                          onOpenChange={(open) => {
                            setShowStockAdjustment(open)
                            if (!open) setSelectedItemForAdjustment(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItemForAdjustment(item.id)}
                              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-background text-foreground">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">
                                Adjust Stock - {item.product.title}
                                {scannedProduct?.id === item.id && (
                                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Scanned
                                  </Badge>
                                )}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div>
                                  <Label className="text-foreground">
                                    Current Stock: {item.currentStock}
                                  </Label>
                                </div>
                                {item.product.barcode && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Barcode: {item.product.barcode}
                                    </Label>
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="adjustment" className="text-foreground">
                                  Adjustment
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentQuantity((prev) => prev - 1)}
                                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    id="adjustment"
                                    type="number"
                                    value={adjustmentQuantity}
                                    onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                                    className="w-20 text-center border-input text-foreground bg-background"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentQuantity((prev) => prev + 1)}
                                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  New stock: {item.currentStock + adjustmentQuantity}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="reason" className="text-foreground">
                                  Reason
                                </Label>
                                <Select
                                  value={adjustmentReason}
                                  onValueChange={setAdjustmentReason}
                                >
                                  <SelectTrigger className="border-input text-foreground bg-background">
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background text-foreground border-border">
                                    <SelectItem value="restock">Restock</SelectItem>
                                    <SelectItem value="damage">Damage/Loss</SelectItem>
                                    <SelectItem value="return">Customer Return</SelectItem>
                                    <SelectItem value="adjustment">
                                      Inventory Count Adjustment
                                    </SelectItem>
                                    <SelectItem value="transfer">Store Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={() =>
                                  handleStockAdjustment(
                                    item.id,
                                    adjustmentQuantity,
                                    adjustmentReason,
                                  )
                                }
                                disabled={!adjustmentReason}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                Apply Adjustment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {enableStockHistory && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewStockHistory(item)}
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <History className="h-3 w-3" />
                          </Button>
                        )}

                        {enableStockTransfers && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Truck className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedData.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No inventory found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No products in inventory'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reorder Dialog */}
        <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
          <DialogContent className="max-w-3xl bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">Reorder Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The following items are at or below their reorder point:
              </p>
              <div className="rounded-md border bg-card text-card-foreground">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-foreground">Product</TableHead>
                      <TableHead className="text-foreground">SKU</TableHead>
                      <TableHead className="text-foreground">Current Stock</TableHead>
                      <TableHead className="text-foreground">Reorder Point</TableHead>
                      <TableHead className="text-foreground">Suggested Order</TableHead>
                      <TableHead className="text-foreground">Supplier</TableHead>
                      <TableHead className="text-foreground">Lead Time</TableHead>
                      <TableHead className="text-foreground">Cost Price</TableHead>
                      <TableHead className="text-foreground">Selling Price</TableHead>
                      <TableHead className="text-foreground">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData
                      .filter((item) => reorderItems.includes(item.id))
                      .map((item) => {
                        const suggestedOrder = Math.max(10, item.reorderPoint * 2)
                        const totalCost = item.costPrice * suggestedOrder
                        return (
                          <TableRow key={item.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{item.product.title}</TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {item.product.sku}
                              </code>
                            </TableCell>
                            <TableCell>{item.currentStock}</TableCell>
                            <TableCell>{item.reorderPoint}</TableCell>
                            <TableCell>
                              <span className="font-medium">{suggestedOrder} units</span>
                            </TableCell>
                            <TableCell>{item.supplier.name}</TableCell>
                            <TableCell>{item.supplier.leadTime} days</TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(item.costPrice)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(item.product.price)}
                            </TableCell>
                            <TableCell className="font-medium">{formatPrice(totalCost)}</TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {inventoryData.filter((item) => reorderItems.includes(item.id)).length} items need
                  reordering
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowReorderDialog(false)}
                    className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={exportReorderReport}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV Report
                  </Button>
                  <Button onClick={generatePurchaseOrder}>Generate Purchase Order</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
          <DialogContent className="max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-title" className="text-foreground">
                  Product Name
                </Label>
                <Input
                  id="product-title"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="Enter product name"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div>
                <Label htmlFor="product-sku" className="text-foreground">
                  SKU
                </Label>
                <Input
                  id="product-sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="Enter SKU"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div>
                <Label htmlFor="product-barcode" className="text-foreground">
                  Barcode
                </Label>
                <Input
                  id="product-barcode"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                  placeholder="Enter barcode"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-price" className="text-foreground">
                    Selling Price
                  </Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    placeholder="0.00"
                    className="border-input text-foreground bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="product-cost" className="text-foreground">
                    Cost Price
                  </Label>
                  <Input
                    id="product-cost"
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })
                    }
                    placeholder="0.00"
                    className="border-input text-foreground bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-stock" className="text-foreground">
                    Initial Stock
                  </Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={newProduct.inStock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, inStock: Number(e.target.value) })
                    }
                    placeholder="0"
                    className="border-input text-foreground bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="product-threshold" className="text-foreground">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="product-threshold"
                    type="number"
                    value={newProduct.lowStockThreshold}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, lowStockThreshold: Number(e.target.value) })
                    }
                    placeholder="5"
                    className="border-input text-foreground bg-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddProductDialog(false)}
                  className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stock History Dialog */}
        <Dialog open={showStockHistory} onOpenChange={setShowStockHistory}>
          <DialogContent className="max-w-2xl bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Stock History - {selectedItemHistory?.product.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedItemHistory?.stockMovements &&
              selectedItemHistory.stockMovements.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground">Type</TableHead>
                      <TableHead className="text-foreground">Quantity</TableHead>
                      <TableHead className="text-foreground">From</TableHead>
                      <TableHead className="text-foreground">To</TableHead>
                      <TableHead className="text-foreground">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItemHistory.stockMovements.map((movement, index) => (
                      <TableRow key={index} className="hover:bg-muted/30 border-border">
                        <TableCell className="text-foreground">
                          {new Date(movement.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-border text-foreground">
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {Math.abs(movement.quantity)}
                        </TableCell>
                        <TableCell className="text-foreground">{movement.previousStock}</TableCell>
                        <TableCell className="text-foreground">{movement.newStock}</TableCell>
                        <TableCell className="text-foreground">{movement.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No stock movements recorded</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowStockHistory(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Supplier Dialog */}
        <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
          <DialogContent className="max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier-name" className="text-foreground">
                  Supplier Name
                </Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Enter supplier name"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div>
                <Label htmlFor="supplier-contact" className="text-foreground">
                  Contact Person
                </Label>
                <Input
                  id="supplier-contact"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  placeholder="Enter contact person"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier-phone" className="text-foreground">
                    Phone
                  </Label>
                  <Input
                    id="supplier-phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="border-input text-foreground bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="supplier-email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    placeholder="Enter email"
                    className="border-input text-foreground bg-background"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="supplier-lead-time" className="text-foreground">
                  Lead Time (days)
                </Label>
                <Input
                  id="supplier-lead-time"
                  type="number"
                  value={newSupplier.leadTime}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, leadTime: Number(e.target.value) })
                  }
                  placeholder="Enter lead time in days"
                  className="border-input text-foreground bg-background"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSupplierDialog(false)}
                  className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSupplier}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {selectedSupplier ? 'Update Supplier' : 'Add Supplier'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default InventoryManagementComponent
