'use client'

import React, { useState } from 'react'
import { CheckoutBlock as CheckoutBlockType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Lock,
  User,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/CartContext'

interface CheckoutFormData {
  // Customer Info
  email: string
  firstName: string
  lastName: string
  phone: string

  // Shipping Address
  shippingAddress: {
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }

  // Billing Address
  billingAddress: {
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }

  // Other
  shippingMethod: string
  paymentMethod: string
  orderNotes?: string
  newsletter: boolean
  sameAsBilling: boolean
}

type Props = CheckoutBlockType

const CheckoutComponent: React.FC<Props> = ({
  title = 'Checkout',
  enableGuestCheckout = true,
  requirePhoneNumber = true,
  //   enableAddressAutocomplete = true,
  defaultCountry = 'KE',
  paymentMethods = [],
  shippingMethods = [],
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  enableOrderNotes = true,
  enableNewsletter = true,
  taxSettings,
}) => {
  const { cartItems, getCartTotal } = useCart()
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    shippingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: defaultCountry || 'KE',
    },
    billingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: defaultCountry || 'KE',
    },
    shippingMethod: '',
    paymentMethod: '',
    orderNotes: '',
    newsletter: false,
    sameAsBilling: true,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [isLoggedIn] = useState(false)

  // Remove the mock cart items and use the cart context instead
  const subtotal = getCartTotal()
  const taxRate = taxSettings?.taxRate || 16
  const taxAmount = (subtotal * taxRate) / 100
  const shippingCost = formData.shippingMethod
    ? shippingMethods?.find((m) => m.name === formData.shippingMethod)?.cost || 0
    : 0
  const total = subtotal + taxAmount + shippingCost

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(prev[section as keyof CheckoutFormData] as any),
        [field]: value,
      },
    }))
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (requirePhoneNumber && !formData.phone) newErrors.phone = 'Phone number is required'
    }

    if (step === 2) {
      if (!formData.shippingAddress.address1) newErrors.shippingAddress1 = 'Address is required'
      if (!formData.shippingAddress.city) newErrors.shippingCity = 'City is required'
      if (!formData.shippingAddress.zipCode) newErrors.shippingZip = 'Postal code is required'

      if (!formData.sameAsBilling) {
        if (!formData.billingAddress.address1)
          newErrors.billingAddress1 = 'Billing address is required'
        if (!formData.billingAddress.city) newErrors.billingCity = 'Billing city is required'
        if (!formData.billingAddress.zipCode)
          newErrors.billingZip = 'Billing postal code is required'
      }
    }

    if (step === 3) {
      if (!formData.shippingMethod) newErrors.shippingMethod = 'Please select a shipping method'
    }

    if (step === 4) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    // Simulate order processing
    setTimeout(() => {
      setLoading(false)
      // Redirect to success page
      window.location.href = '/order-confirmation'
    }, 2000)
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="h-5 w-5" />
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />
      case 'bank_transfer':
        return <Banknote className="h-5 w-5" />
      case 'cod':
        return <Truck className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const steps = [
    { number: 1, title: 'Contact Info', icon: User },
    { number: 2, title: 'Shipping', icon: MapPin },
    { number: 3, title: 'Delivery', icon: Truck },
    { number: 4, title: 'Payment', icon: CreditCard },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{title}</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-full border-2',
                          isCompleted && 'bg-green-500 border-green-500 text-white',
                          isActive && 'bg-primary border-primary text-white',
                          !isActive &&
                            !isCompleted &&
                            'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500',
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'ml-3 text-sm font-medium',
                          isActive && 'text-primary',
                          isCompleted && 'text-green-600 dark:text-green-400',
                          !isActive && !isCompleted && 'text-gray-400 dark:text-gray-500',
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'flex-1 h-0.5 mx-4',
                          isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700',
                        )}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

                        {enableGuestCheckout && !isLoggedIn && (
                          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              Already have an account?
                              <Link href="/login" className="font-medium underline ml-1">
                                Sign in
                              </Link>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => updateFormData('firstName', e.target.value)}
                            className={errors.firstName ? 'border-red-500' : ''}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => updateFormData('lastName', e.target.value)}
                            className={errors.lastName ? 'border-red-500' : ''}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number {requirePhoneNumber && '*'}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254 700 000 000"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Shipping Address */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Shipping Address</h2>

                      <div>
                        <Label htmlFor="shippingAddress1">Street Address *</Label>
                        <Input
                          id="shippingAddress1"
                          value={formData.shippingAddress.address1}
                          onChange={(e) =>
                            updateNestedFormData('shippingAddress', 'address1', e.target.value)
                          }
                          className={errors.shippingAddress1 ? 'border-red-500' : ''}
                        />
                        {errors.shippingAddress1 && (
                          <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                            {errors.shippingAddress1}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="shippingAddress2">Apartment, Suite, etc.</Label>
                        <Input
                          id="shippingAddress2"
                          value={formData.shippingAddress.address2}
                          onChange={(e) =>
                            updateNestedFormData('shippingAddress', 'address2', e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="shippingCity">City *</Label>
                          <Input
                            id="shippingCity"
                            value={formData.shippingAddress.city}
                            onChange={(e) =>
                              updateNestedFormData('shippingAddress', 'city', e.target.value)
                            }
                            className={errors.shippingCity ? 'border-red-500' : ''}
                          />
                          {errors.shippingCity && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                              {errors.shippingCity}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="shippingState">State/County</Label>
                          <Input
                            id="shippingState"
                            value={formData.shippingAddress.state}
                            onChange={(e) =>
                              updateNestedFormData('shippingAddress', 'state', e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="shippingZip">Postal Code *</Label>
                          <Input
                            id="shippingZip"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) =>
                              updateNestedFormData('shippingAddress', 'zipCode', e.target.value)
                            }
                            className={errors.shippingZip ? 'border-red-500' : ''}
                          />
                          {errors.shippingZip && (
                            <p className="text-sm text-red-500 mt-1">{errors.shippingZip}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsBilling"
                          checked={formData.sameAsBilling}
                          onCheckedChange={(checked) => updateFormData('sameAsBilling', checked)}
                        />
                        <Label htmlFor="sameAsBilling">Billing address same as shipping</Label>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Shipping Method */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Delivery Method</h2>

                      <RadioGroup
                        value={formData.shippingMethod}
                        onValueChange={(value) => updateFormData('shippingMethod', value)}
                      >
                        {shippingMethods?.map((method) => (
                          <div
                            key={method.name}
                            className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <RadioGroupItem value={method.name} id={method.name} />
                            <div className="flex-1">
                              <Label htmlFor={method.name} className="font-medium">
                                {method.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              {method.estimatedDays && (
                                <p className="text-sm text-muted-foreground">
                                  Estimated delivery: {method.estimatedDays} days
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-medium">
                                {method.cost === 0 ? 'Free' : formatPrice(method.cost)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      {errors.shippingMethod && (
                        <p className="text-sm text-red-500">{errors.shippingMethod}</p>
                      )}
                    </div>
                  )}

                  {/* Step 4: Payment */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Payment Method</h2>

                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => updateFormData('paymentMethod', value)}
                      >
                        {paymentMethods
                          ?.filter((pm) => pm.enabled)
                          ?.map((method) => (
                            <div
                              key={method.method}
                              className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                            >
                              <RadioGroupItem value={method.method} id={method.method} />
                              <div className="flex items-center space-x-3 flex-1">
                                {getPaymentMethodIcon(method.method)}
                                <div>
                                  <Label htmlFor={method.method} className="font-medium capitalize">
                                    {method.method.replace('_', ' ')}
                                  </Label>
                                  {method.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {method.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {method.processingFee && method.processingFee > 0 && (
                                <Badge variant="outline">+{method.processingFee}% fee</Badge>
                              )}
                            </div>
                          ))}
                      </RadioGroup>

                      {errors.paymentMethod && (
                        <p className="text-sm text-red-500">{errors.paymentMethod}</p>
                      )}

                      {enableOrderNotes && (
                        <div>
                          <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                          <Textarea
                            id="orderNotes"
                            rows={3}
                            placeholder="Special instructions for your order..."
                            value={formData.orderNotes}
                            onChange={(e) => updateFormData('orderNotes', e.target.value)}
                          />
                        </div>
                      )}

                      {enableNewsletter && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="newsletter"
                            checked={formData.newsletter}
                            onCheckedChange={(checked) => updateFormData('newsletter', checked)}
                          />
                          <Label htmlFor="newsletter" className="text-sm">
                            Subscribe to our newsletter for updates and exclusive offers
                          </Label>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        By placing your order, you agree to our
                        <Link href={termsUrl || '/terms'} className="underline">
                          Terms & Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href={privacyUrl || '/privacy'} className="underline">
                          Privacy Policy
                        </Link>
                        .
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t">
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                      Previous
                    </Button>

                    {currentStep < 4 ? (
                      <Button onClick={nextStep}>Continue</Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Processing...' : `Place Order • ${formatPrice(total)}`}
                        <Lock className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={`${item.product.id}-${item.quantity}`} className="flex items-center gap-3">
                        {item.product.images?.[0] && typeof item.product.images[0].image === 'object' && (
                          <div className="w-12 h-12 relative">
                            <Image
                              src={item.product.images[0].image.url || ''}
                              alt={item.product.images[0].image.alt || item.product.title || ''}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.product.title}</h4>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                            {item.product.brand && typeof item.product.brand === 'object' && (
                              <span className="ml-2">{item.product.brand.name}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice((item.product.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>
                        {taxSettings?.taxLabel || 'VAT'} ({taxRate}%)
                      </span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutComponent
