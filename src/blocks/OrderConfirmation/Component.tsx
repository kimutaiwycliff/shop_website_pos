'use client'

import React from 'react'
import { OrderConfirmationBlock as OrderConfirmationBlockType } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  MapPin,
  User,
  Calendar,
  Printer,
  Download,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Props = OrderConfirmationBlockType & {
  order?: {
    id: string
    orderNumber: string
    createdAt: string
    status: string
    customer: {
      firstName: string
      lastName: string
      email: string
      phone?: string
    }
    items: Array<{
      product: {
        id: string
        title: string
        price: number
        images?: Array<{
          image: {
            url: string
            alt: string
          }
        }>
      }
      quantity: number
      price: number
    }>
    shipping: {
      method: string
      cost: number
      address: {
        firstName: string
        lastName: string
        address: string
        apartment?: string
        city: string
        state: string
        zipCode: string
        country: string
      }
    }
    payment: {
      method: string
      transactionId?: string
    }
    subtotal: number
    tax: number
    total: number
  }
}

const OrderConfirmationComponent: React.FC<Props> = ({ title = 'Order Confirmation', order }) => {
  if (!order) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Processing</h2>
                <p className="text-muted-foreground mb-6">
                  Your order is being processed. You will receive an email confirmation shortly.
                </p>
                <Button asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      card: 'Credit Card',
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay',
      mpesa: 'M-Pesa',
      cash: 'Cash',
    }
    return methods[method] || method
  }

  const getOrderStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">
              Thank you for your order! Your order has been confirmed.
            </p>
          </div>

          {/* Order Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">Order Details</CardTitle>
                  <p className="text-muted-foreground">
                    Order #{order.orderNumber} • Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold flex items-center mb-3">
                    <User className="h-4 w-4 mr-2" />
                    Customer
                  </h3>
                  <p className="text-sm">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  {order.customer.phone && (
                    <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                  )}
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="font-semibold flex items-center mb-3">
                    <Truck className="h-4 w-4 mr-2" />
                    Shipping
                  </h3>
                  <p className="text-sm">{order.shipping.method}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping.address.firstName} {order.shipping.address.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping.address.address}
                    {order.shipping.address.apartment && `, ${order.shipping.address.apartment}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping.address.city}, {order.shipping.address.state}{' '}
                    {order.shipping.address.zipCode}
                  </p>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold flex items-center mb-3">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment
                  </h3>
                  <p className="text-sm">{getPaymentMethodLabel(order.payment.method)}</p>
                  {order.payment.transactionId && (
                    <p className="text-sm text-muted-foreground">
                      ID: {order.payment.transactionId}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 py-4 border-b last:border-0"
                      >
                        {item.product.images?.[0] && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={item.product.images[0].image.url}
                              alt={item.product.images[0].image.alt || item.product.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.product.title}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shipping.cost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Order Confirmation</p>
                          <p className="text-xs text-muted-foreground">
                            We have sent a confirmation email to {order.customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
                          <Package className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Order Processing</p>
                          <p className="text-xs text-muted-foreground">
                            We&apos;re preparing your order for shipment
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-1 rounded-full mr-3 mt-0.5">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Shipment</p>
                          <p className="text-xs text-muted-foreground">
                            Your order will be shipped soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account/orders">View All Orders</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderConfirmationComponent
