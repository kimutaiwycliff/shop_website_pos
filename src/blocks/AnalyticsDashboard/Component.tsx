'use client'

import React, { useState } from 'react'
import { AnalyticsDashboardBlock as AnalyticsDashboardBlockType } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  DollarSign,
  UserPlus,
  ShoppingCartIcon,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import AnalyticsChart from '@/components/AnalyticsChart'
import SalesOverviewChart from '@/components/SalesOverviewChart'
import { exportToCSV, exportToPDF, ExportData } from '@/utilities/exportUtils'

type Props = AnalyticsDashboardBlockType

const AnalyticsDashboardComponent: React.FC<Props> = ({
  title = 'Sales Analytics',
  dateRange = 'last_30_days',
  widgets = [],
  exportOptions,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>(dateRange || 'last_30_days')
  const { data, loading, error, refreshData } = useAnalyticsData(selectedDateRange)
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

  const handleRefresh = async () => {
    setRefreshing(true)
    refreshData()
    // Add a small delay to show the refresh animation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExportToPDF = () => {
    if (data) {
      const exportData: ExportData = {
        salesOverview: data.salesOverview,
        topProducts: data.topProducts,
        customerAnalytics: data.customerAnalytics,
        inventoryAlerts: data.inventoryAlerts,
        paymentMethods: data.paymentMethods,
        recentOrders: data.recentOrders,
      }
      exportToPDF(exportData, title || 'Analytics Report')
    }
  }

  const handleExportToCSV = () => {
    if (data) {
      const exportData: ExportData = {
        salesOverview: data.salesOverview,
        topProducts: data.topProducts,
        customerAnalytics: data.customerAnalytics,
        inventoryAlerts: data.inventoryAlerts,
        paymentMethods: data.paymentMethods,
        recentOrders: data.recentOrders,
      }
      exportToCSV(exportData, title || 'Analytics Report')
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading Analytics</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>Retry</Button>
          </div>
        </div>
      </section>
    )
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
              {data ? formatPrice(data.salesOverview.totalRevenue) : 'KES 0'}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Revenue</span>
              {data && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    data.salesOverview.revenueGrowth >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {data.salesOverview.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(data.salesOverview.revenueGrowth)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">{data ? data.salesOverview.totalOrders : 0}</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Orders</span>
              {data && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    data.salesOverview.ordersGrowth >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {data.salesOverview.ordersGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(data.salesOverview.ordersGrowth)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data ? formatPrice(data.salesOverview.averageOrderValue) : 'KES 0'}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">AOV</span>
              {data && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    data.salesOverview.aovGrowth >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {data.salesOverview.aovGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(data.salesOverview.aovGrowth)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {data ? formatPercentage(data.salesOverview.conversionRate, false) : '0%'}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Conversion</span>
              {data && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    data.salesOverview.conversionGrowth >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {data.salesOverview.conversionGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(data.salesOverview.conversionGrowth)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const RevenueChartWidget = () => {
    return (
      <SalesOverviewChart
        data={data?.revenueChart || []}
        title="Revenue Trend"
        currentValue={data?.salesOverview.totalRevenue || 0}
        previousValue={(data?.salesOverview?.totalRevenue || 0) * 0.9}
        growth={data?.salesOverview.revenueGrowth || 0}
        valueType="revenue"
      />
    )
  }

  const TopProductsWidget = () => {
    // Prepare data for pie chart
    const pieData =
      data?.topProducts.map((product) => ({
        name: product.name,
        value: product.revenue,
      })) || []

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {data?.topProducts.map((product, index) => (
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
                    <div
                      className={cn(
                        'text-xs flex items-center gap-1',
                        product.growth >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {product.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatPercentage(product.growth)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64">
              <AnalyticsChart
                type="pie"
                data={pieData}
                title="Product Revenue Distribution"
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <div className="text-2xl font-bold">
                {data ? data.customerAnalytics.totalCustomers : 0}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">New</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data ? data.customerAnalytics.newCustomers : 0}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCartIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Avg. Value</span>
              </div>
              <div className="text-2xl font-bold">
                {data ? formatPrice(data.customerAnalytics.averageLifetimeValue) : 'KES 0'}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Customer Retention</span>
              <span>
                {data
                  ? formatPercentage(data.customerAnalytics.customerRetentionRate, false)
                  : '0%'}
              </span>
            </div>
            <Progress
              value={data ? data.customerAnalytics.customerRetentionRate : 0}
              className="h-2"
            />
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg font-semibold">
              {data ? formatPrice(data.customerAnalytics.averageLifetimeValue) : 'KES 0'}
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
          {data?.inventoryAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium text-sm">{alert.product}</div>
                <div className="text-xs text-muted-foreground">
                  {alert.currentStock} in stock (min: {alert.minStock})
                </div>
              </div>
              <Badge
                variant={
                  alert.severity === 'high'
                    ? 'destructive'
                    : alert.severity === 'medium'
                      ? 'default'
                      : 'secondary'
                }
              >
                {alert.severity === 'high'
                  ? 'Critical'
                  : alert.severity === 'medium'
                    ? 'Low'
                    : 'Warning'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const PaymentMethodsWidget = () => {
    // Prepare data for bar chart
    const chartData =
      data?.paymentMethods.map((method) => ({
        name: method.method,
        value: method.amount,
      })) || []

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {data?.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{method.method}</span>
                    <span className="font-medium">{method.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <Progress value={method.percentage} className="flex-1 mr-2" />
                    <span>{formatPrice(method.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64">
              <AnalyticsChart
                type="bar"
                data={chartData}
                title="Payment Method Distribution"
                dataKey="value"
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          {data?.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium text-sm">{order.id}</div>
                <div className="text-xs text-muted-foreground">
                  {order.customer} • {order.time}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(order.amount)}</div>
                <Badge
                  variant="outline"
                  className="text-xs capitalize"
                  style={{
                    backgroundColor:
                      order.status === 'paid'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : order.status === 'pending'
                          ? 'rgba(251, 191, 36, 0.1)'
                          : order.status === 'shipped'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                    color:
                      order.status === 'paid'
                        ? '#16a34a'
                        : order.status === 'pending'
                          ? '#f59e0b'
                          : order.status === 'shipped'
                            ? '#3b82f6'
                            : '#ef4444',
                    borderColor:
                      order.status === 'paid'
                        ? '#16a34a'
                        : order.status === 'pending'
                          ? '#f59e0b'
                          : order.status === 'shipped'
                            ? '#3b82f6'
                            : '#ef4444',
                  }}
                >
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
      case 'revenue_chart':
        return <RevenueChartWidget />
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

  const enabledWidgets = widgets?.filter((widget) => widget.enabled)

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
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            </Button>

            {exportOptions?.enablePdfExport && (
              <Button variant="outline" size="sm" onClick={handleExportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}

            {exportOptions?.enableCsvExport && (
              <Button variant="outline" size="sm" onClick={handleExportToCSV}>
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
