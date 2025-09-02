'use client'

import React, { useState } from 'react'
import { AnalyticsDashboardBlock as AnalyticsDashboardBlockType } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Download,
  RefreshCw,
  CreditCard,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/utilities/ui'

// Mock data - in a real app this would come from your analytics API
const mockAnalyticsData = {
  salesOverview: {
    totalRevenue: 125000,
    totalOrders: 248,
    averageOrderValue: 504,
    conversionRate: 3.2,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    aovGrowth: -2.1,
    conversionGrowth: 15.7
  },
  topProducts: [
    { id: '1', name: 'Premium Cotton T-Shirt', revenue: 25000, units: 125, growth: 18.5 },
    { id: '2', name: 'Denim Jeans', revenue: 18000, units: 45, growth: -5.2 },
    { id: '3', name: 'Summer Dress', revenue: 15000, units: 38, growth: 22.1 },
    { id: '4', name: 'Casual Sneakers', revenue: 12000, units: 24, growth: 8.9 },
    { id: '5', name: 'Leather Jacket', revenue: 10000, units: 12, growth: 35.6 }
  ],
  customerAnalytics: {
    totalCustomers: 1250,
    newCustomers: 89,
    returningCustomers: 159,
    customerRetentionRate: 67.5,
    averageLifetimeValue: 850
  },
  inventoryAlerts: [
    { product: 'Premium Cotton T-Shirt', currentStock: 3, minStock: 5, severity: 'high' },
    { product: 'Summer Dress', currentStock: 8, minStock: 10, severity: 'medium' },
    { product: 'Casual Sneakers', currentStock: 15, minStock: 20, severity: 'low' }
  ],
  paymentMethods: [
    { method: 'M-Pesa', percentage: 45, amount: 56250 },
    { method: 'Credit Card', percentage: 35, amount: 43750 },
    { method: 'Cash', percentage: 15, amount: 18750 },
    { method: 'Bank Transfer', percentage: 5, amount: 6250 }
  ],
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', amount: 2500, status: 'completed', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 1800, status: 'processing', time: '3 hours ago' },
    { id: 'ORD-003', customer: 'Mike Wilson', amount: 4200, status: 'shipped', time: '5 hours ago' },
    { id: 'ORD-004', customer: 'Sarah Brown', amount: 750, status: 'pending', time: '6 hours ago' }
  ]
}

type Props = AnalyticsDashboardBlockType

const AnalyticsDashboardComponent: React.FC<Props> = ({
  title = 'Sales Analytics',
  dateRange = 'last_30_days',
  widgets = [],
//   permissions,
  exportOptions,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>(dateRange || 'last_30_days')
  const [refreshing, setRefreshing] = useState(false)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  const formatPercentage = (value: number, showSign = true) => {
    const sign = showSign ? (value >= 0 ? '+' : '') : ''
    return `${sign}${value.toFixed(1)}%`
  }
  
  const getWidgetSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1'
      case 'medium':
        return 'col-span-2'
      case 'large':
        return 'col-span-3'
      case 'full':
        return 'col-span-4'
      default:
        return 'col-span-2'
    }
  }
  
  const refreshData = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }
  
  const exportToPDF = () => {
    console.log('Exporting to PDF...')
  }
  
  const exportToCSV = () => {
    console.log('Exporting to CSV...')
  }
  
  const SalesOverviewWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Sales Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatPrice(mockAnalyticsData.salesOverview.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <div className={cn(
                'flex items-center gap-1',
                mockAnalyticsData.salesOverview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {mockAnalyticsData.salesOverview.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(mockAnalyticsData.salesOverview.revenueGrowth)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {mockAnalyticsData.salesOverview.totalOrders}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Orders</span>
              <div className={cn(
                'flex items-center gap-1',
                mockAnalyticsData.salesOverview.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {mockAnalyticsData.salesOverview.ordersGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(mockAnalyticsData.salesOverview.ordersGrowth)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatPrice(mockAnalyticsData.salesOverview.averageOrderValue)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">AOV</span>
              <div className={cn(
                'flex items-center gap-1',
                mockAnalyticsData.salesOverview.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {mockAnalyticsData.salesOverview.aovGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(mockAnalyticsData.salesOverview.aovGrowth)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatPercentage(mockAnalyticsData.salesOverview.conversionRate, false)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Conversion</span>
              <div className={cn(
                'flex items-center gap-1',
                mockAnalyticsData.salesOverview.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {mockAnalyticsData.salesOverview.conversionGrowth >= 0 ? (
                   <TrendingUp className="h-3 w-3" />
                 ) : (
                   <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(mockAnalyticsData.salesOverview.conversionGrowth)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  const TopProductsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAnalyticsData.topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.units} units sold
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(product.revenue)}</div>
                <div className={cn(
                  'text-xs flex items-center gap-1',
                  product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {product.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3\" />
                  ) : (
                    <TrendingDown className="h-3 w-3\" />
                  )}
                  {formatPercentage(product.growth)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  
  const CustomerAnalyticsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {mockAnalyticsData.customerAnalytics.totalCustomers}
              </div>
              <div className="text-sm text-muted-foreground">Total Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalyticsData.customerAnalytics.newCustomers}
              </div>
              <div className="text-sm text-muted-foreground">New Customers</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Customer Retention</span>
              <span>{formatPercentage(mockAnalyticsData.customerAnalytics.customerRetentionRate, false)}</span>
            </div>
            <Progress value={mockAnalyticsData.customerAnalytics.customerRetentionRate} className="h-2" />
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">
              {formatPrice(mockAnalyticsData.customerAnalytics.averageLifetimeValue)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Lifetime Value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  const InventoryAlertsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Inventory Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAnalyticsData.inventoryAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium text-sm">{alert.product}</div>
                <div className="text-xs text-muted-foreground">
                  {alert.currentStock} in stock (min: {alert.minStock})
                </div>
              </div>
              <Badge variant={
                alert.severity === 'high' ? 'destructive' : 
                alert.severity === 'medium' ? 'default' : 'secondary'
              }>
                {alert.severity === 'high' ? 'Critical' : 
                 alert.severity === 'medium' ? 'Low' : 'Warning'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  
  const PaymentMethodsWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAnalyticsData.paymentMethods.map((method, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{method.method}</span>
                <span className="font-medium">{method.percentage}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <Progress value={method.percentage} className="flex-1 mr-2" />
                <span>{formatPrice(method.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  
  const RecentOrdersWidget = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAnalyticsData.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium text-sm">{order.id}</div>
                <div className="text-xs text-muted-foreground">
                  {order.customer} • {order.time}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(order.amount)}</div>
                <Badge variant="outline" className="text-xs">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  
  const getWidgetComponent = (type: string) => {
    switch (type) {
      case 'sales_overview':
        return <SalesOverviewWidget />
      case 'top_products':
        return <TopProductsWidget />
      case 'customer_analytics':
        return <CustomerAnalyticsWidget />
      case 'inventory_alerts':
        return <InventoryAlertsWidget />
      case 'payment_methods':
        return <PaymentMethodsWidget />
      case 'recent_orders':
        return <RecentOrdersWidget />
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Widget type &quot;{type}&quot; not implemented
              </div>
            </CardContent>
          </Card>
        )
    }
  }
  
  const enabledWidgets = widgets?.filter(widget => widget.enabled)
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          
          <div className="flex items-center gap-3">
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month\">Last Month</SelectItem>
                <SelectItem value="this_year\">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            </Button>
            
            {exportOptions?.enablePdfExport && (
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
            
            {exportOptions?.enableCsvExport && (
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            )}
          </div>
        </div>
        
        {/* Widgets Grid */}
        {enabledWidgets && enabledWidgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enabledWidgets?.map((widget, index) => (
              <div key={index} className={getWidgetSize(widget.size || 'medium')}>
                {getWidgetComponent(widget.type)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No widgets configured</h3>
            <p className="text-muted-foreground">Add widgets to your dashboard to view analytics</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AnalyticsDashboardComponent