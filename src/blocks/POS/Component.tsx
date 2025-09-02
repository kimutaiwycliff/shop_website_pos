'use client'

import React, { useState, useRef } from 'react'
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
} from 'lucide-react'
import Image from 'next/image'

interface POSItem {
  id: string
  product: {
    id: string
    title: string
    price: number
    sku: string
    barcode?: string
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
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Mock products data
  const [products] = useState([
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

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery),
  )

  const subtotal = cart.reduce((sum, item) => sum + (item.lineTotal - item.discount), 0)
  const taxRate = taxSettings?.defaultTaxRate || 16
  const taxAmount = taxSettings?.taxIncluded ? 0 : (subtotal * taxRate) / 100
  const total = subtotal + taxAmount
  const change = amountPaid - total

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1)
    } else {
      const newItem: POSItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        lineTotal: product.price,
      }
      setCart([...cart, newItem])
    }

    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const lineTotal = newQuantity * item.unitPrice
          return { ...item, quantity: newQuantity, lineTotal }
        }
        return item
      }),
    )
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

  const processSale = () => {
    if (cart.length === 0 || !paymentMethod) return

    // Simulate processing
    console.log('Processing sale:', {
      cart,
      customer,
      paymentMethod,
      total,
      amountPaid,
      change,
    })

    // Print receipt if enabled
    if (enableReceiptPrinting) {
      printReceipt()
    }

    // Clear cart and close dialog
    clearCart()
    setShowPaymentDialog(false)

    alert('Sale completed successfully!')
  }

  const printReceipt = () => {
    // In a real implementation, this would interface with a receipt printer
    console.log('Printing receipt...')
  }

  const handleBarcodeInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput) {
      const product = products.find((p) => p.barcode === barcodeInput)
      if (product) {
        addToCart(product)
      }
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

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
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
        <div className="flex-1 p-4 space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search products, SKU, or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
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
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                    <Badge
                      variant={product.inStock > 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {product.inStock}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b">
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
                <DialogContent>
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
                <Card key={item.id} className="p-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} each
                        </p>
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
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
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
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {formatPrice(item.lineTotal - item.discount)}
                        </div>
                        {item.discount > 0 && (
                          <div className="text-xs text-green-600">
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
            <div className="border-t p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {!taxSettings?.taxIncluded && (
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

              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Charge {formatPrice(total)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
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
                              <span className={change < 0 ? 'text-red-500' : 'text-green-600'}>
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
        <DialogContent>
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
    </div>
  )
}

export default POSComponent
