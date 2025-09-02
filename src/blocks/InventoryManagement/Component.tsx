'use client'

import React, { useState, useMemo } from 'react'
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
} from 'lucide-react'
import Image from 'next/image'

// Mock inventory data
const mockInventoryData = [
  {
    id: '1',
    product: {
      id: 'prod-1',
      title: 'Premium Cotton T-Shirt',
      sku: 'TSH-001',
      images: [{ image: { url: '/api/media/tshirt.jpg', alt: 'T-Shirt' } }],
      price: 2500,
    },
    currentStock: 15,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 15,
    location: { warehouse: 'Main Store', aisle: 'A1', shelf: '2' },
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'in_stock',
    supplier: { name: 'Cotton Co.', leadTime: 7 },
    costPrice: 1200,
    totalValue: 18000,
  },
  {
    id: '2',
    product: {
      id: 'prod-2',
      title: 'Denim Jeans',
      sku: 'JNS-001',
      images: [{ image: { url: '/api/media/jeans.jpg', alt: 'Jeans' } }],
      price: 4500,
    },
    currentStock: 3,
    minStockLevel: 5,
    maxStockLevel: 50,
    reorderPoint: 8,
    location: { warehouse: 'Main Store', aisle: 'B2', shelf: '1' },
    lastUpdated: '2024-01-14T15:45:00Z',
    status: 'low_stock',
    supplier: { name: 'Denim Works', leadTime: 14 },
    costPrice: 2200,
    totalValue: 6600,
  },
  {
    id: '3',
    product: {
      id: 'prod-3',
      title: 'Summer Dress',
      sku: 'DRS-001',
      images: [{ image: { url: '/api/media/dress.jpg', alt: 'Dress' } }],
      price: 3500,
    },
    currentStock: 0,
    minStockLevel: 8,
    maxStockLevel: 40,
    reorderPoint: 12,
    location: { warehouse: 'Main Store', aisle: 'C1', shelf: '3' },
    lastUpdated: '2024-01-13T09:20:00Z',
    status: 'out_of_stock',
    supplier: { name: 'Fashion House', leadTime: 10 },
    costPrice: 1800,
    totalValue: 0,
  },
]

type Props = InventoryManagementBlockType

const InventoryManagementComponent: React.FC<Props> = ({
  title = 'Inventory Management',
  enableBulkActions = true,
  enableStockAlerts = true,
}) => {
  // Default values for properties not in the block type
  const enableStockTransfers = true
  const enableStockHistory = true
  const [inventoryData, setInventoryData] = useState(mockInventoryData)
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
        item.product.sku.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in_stock' && item.status === 'in_stock') ||
        (statusFilter === 'low_stock' && item.status === 'low_stock') ||
        (statusFilter === 'out_of_stock' && item.status === 'out_of_stock')

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

  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0)
  const totalItems = inventoryData.reduce((sum, item) => sum + item.currentStock, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge variant="default">In Stock</Badge>
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
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleStockAdjustment = (itemId: string, quantity: number, reason: string) => {
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

    console.log('Stock adjustment:', { itemId, quantity, reason })
  }

  const handleBulkAdjustment = () => {
    console.log('Bulk adjustment for items:', selectedItems)
  }

  const generateReorderReport = () => {
    const itemsToReorder = inventoryData.filter((item) => item.currentStock <= item.reorderPoint)
    setReorderItems(itemsToReorder.map((item) => item.id))
    setShowReorderDialog(true)
  }

  const exportInventory = () => {
    console.log('Exporting inventory data...')
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{inventoryData.length} products</span>
              <span>{totalItems} total units</span>
              <span>{formatPrice(totalValue)} total value</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={generateReorderReport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Reorder Report
            </Button>
            <Button variant="outline" size="sm" onClick={exportInventory}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stock Alerts */}
        {enableStockAlerts && stockAlerts.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Stock Alerts ({stockAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stockAlerts.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div>
                      <div className="font-medium text-sm">{item.product.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.currentStock} units (min: {item.minStockLevel})
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
              {stockAlerts.length > 6 && (
                <div className="text-center mt-3">
                  <Button variant="outline" size="sm">
                    View All {stockAlerts.length} Alerts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="sku">SKU</SelectItem>
                    <SelectItem value="stock_asc">Stock (Low to High)</SelectItem>
                    <SelectItem value="stock_desc">Stock (High to Low)</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {enableBulkActions && selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleBulkAdjustment}>
                      Bulk Adjust
                    </Button>
                    <Button size="sm" variant="outline">
                      Bulk Transfer
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {enableBulkActions && (
                    <TableHead className="w-12">
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
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item) => (
                  <TableRow key={item.id}>
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
                        {item.product.images?.[0] && (
                          <div className="w-10 h-10 relative">
                            <Image
                              src={item.product.images[0].image.url}
                              alt={item.product.images[0].image.alt}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.product.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.currentStock}</span>
                        {item.currentStock <= item.reorderPoint && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
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
                      <div className="text-sm">
                        <div>{item.location.warehouse}</div>
                        <div className="text-muted-foreground">
                          {item.location.aisle}-{item.location.shelf}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{formatPrice(item.totalValue)}</div>
                        <div className="text-muted-foreground">@ {formatPrice(item.costPrice)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
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
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Stock - {item.product.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Stock: {item.currentStock}</Label>
                              </div>
                              <div>
                                <Label htmlFor="adjustment">Adjustment</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentQuantity((prev) => prev - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    id="adjustment"
                                    type="number"
                                    value={adjustmentQuantity}
                                    onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                                    className="w-20 text-center"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAdjustmentQuantity((prev) => prev + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  New stock: {item.currentStock + adjustmentQuantity}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="reason">Reason</Label>
                                <Select
                                  value={adjustmentReason}
                                  onValueChange={setAdjustmentReason}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                                onClick={() => {
                                  handleStockAdjustment(
                                    item.id,
                                    adjustmentQuantity,
                                    adjustmentReason,
                                  )
                                  setShowStockAdjustment(false)
                                  setSelectedItemForAdjustment(null)
                                  setAdjustmentQuantity(0)
                                  setAdjustmentReason('')
                                }}
                                disabled={!adjustmentReason}
                                className="w-full"
                              >
                                Apply Adjustment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {enableStockHistory && (
                          <Button size="sm" variant="outline">
                            <History className="h-3 w-3" />
                          </Button>
                        )}

                        {enableStockTransfers && (
                          <Button size="sm" variant="outline">
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
                <h3 className="text-lg font-medium mb-2">No inventory found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No products in inventory'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reorder Dialog */}
        <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reorder Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The following items are at or below their reorder point:
              </p>
              <div className="space-y-3">
                {inventoryData
                  .filter((item) => reorderItems.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Current: {item.currentStock} | Reorder Point: {item.reorderPoint}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Suggested: 10 units</div>
                        <div className="text-xs text-muted-foreground">
                          {item.supplier.name} ({item.supplier.leadTime} days)
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReorderDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => console.log('Generate purchase orders')}>
                  Generate Purchase Orders
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default InventoryManagementComponent
