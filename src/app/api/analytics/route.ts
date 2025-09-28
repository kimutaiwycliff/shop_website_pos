import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'

// Helper function to get date range filters
const getDateRangeFilter = (dateRange: string) => {
  const now = new Date()
  let startDate: Date | null = null

  switch (dateRange) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'yesterday':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      break
    case 'last_7_days':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      break
    case 'last_30_days':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
      break
    case 'last_90_days':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90)
      break
    case 'this_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'last_month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      break
    case 'this_year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
  }

  return {
    createdAt: {
      greater_than: startDate.toISOString(),
    },
  }
}

// Helper function to calculate growth percentage
const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Helper function to generate date ranges for chart data
const generateDateRanges = (dateRange: string) => {
  const now = new Date()
  const ranges = []

  switch (dateRange) {
    case 'today':
    case 'yesterday':
      // Hourly data for today/yesterday
      const startHour = dateRange === 'today' ? 0 : -24
      for (let i = startHour; i <= (dateRange === 'today' ? now.getHours() : 23); i++) {
        const date = new Date(now)
        date.setHours(i, 0, 0, 0)
        ranges.push({
          label: `${i}:00`,
          start: new Date(date),
          end: new Date(date.setHours(date.getHours() + 1)),
        })
      }
      break
    case 'last_7_days':
      // Daily data for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        ranges.push({
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          start: new Date(date.setHours(0, 0, 0, 0)),
          end: new Date(date.setHours(23, 59, 59, 999)),
        })
      }
      break
    case 'last_30_days':
    case 'last_90_days':
      // Weekly data for last 30/90 days
      const days = dateRange === 'last_30_days' ? 30 : 90
      for (let i = Math.ceil(days / 7) - 1; i >= 0; i--) {
        const endDate = new Date(now)
        endDate.setDate(endDate.getDate() - i * 7)
        const startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 6)
        ranges.push({
          label: `Week ${Math.ceil(days / 7) - i}`,
          start: new Date(startDate.setHours(0, 0, 0, 0)),
          end: new Date(endDate.setHours(23, 59, 59, 999)),
        })
      }
      break
    default:
      // Monthly data
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        ranges.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        })
      }
  }

  return ranges
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || 'last_30_days'

    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    // Get date filter
    const dateFilter = getDateRangeFilter(dateRange)

    // Calculate previous period for growth comparison
    const now = new Date()
    let previousStartDate: Date | null = null
    let previousEndDate: Date | null = null

    switch (dateRange) {
      case 'today':
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'yesterday':
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        break
      case 'last_7_days':
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case 'last_30_days':
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
        break
      case 'last_90_days':
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 180)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90)
        break
      case 'this_month':
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'last_month':
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        previousEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        break
      case 'this_year':
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
        previousEndDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
    }

    const previousDateFilter = {
      createdAt: {
        greater_than: previousStartDate?.toISOString(),
        less_than: previousEndDate?.toISOString(),
      },
    }

    // Fetch sales overview data
    const currentOrders = await payload.find({
      collection: 'orders',
      draft,
      where: dateFilter,
      pagination: false,
    })

    const previousOrders = await payload.find({
      collection: 'orders',
      draft,
      where: previousDateFilter,
      pagination: false,
    })

    // Calculate sales metrics
    const currentRevenue = currentOrders.docs.reduce((sum, order) => sum + (order.total || 0), 0)
    const previousRevenue = previousOrders.docs.reduce((sum, order) => sum + (order.total || 0), 0)
    const revenueGrowth = calculateGrowth(currentRevenue, previousRevenue)

    const currentOrderCount = currentOrders.docs.length
    const previousOrderCount = previousOrders.docs.length
    const ordersGrowth = calculateGrowth(currentOrderCount, previousOrderCount)

    const currentAOV = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0
    const previousAOV = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0
    const aovGrowth = calculateGrowth(currentAOV, previousAOV)

    // Calculate conversion rate (orders/customers)
    const currentCustomers = await payload.find({
      collection: 'customers',
      draft,
      where: dateFilter,
      pagination: false,
    })

    const previousCustomers = await payload.find({
      collection: 'customers',
      draft,
      where: previousDateFilter,
      pagination: false,
    })

    const currentConversionRate =
      currentCustomers.docs.length > 0
        ? (currentOrderCount / currentCustomers.docs.length) * 100
        : 0
    const previousConversionRate =
      previousCustomers.docs.length > 0
        ? (previousOrderCount / previousCustomers.docs.length) * 100
        : 0
    const conversionGrowth = calculateGrowth(currentConversionRate, previousConversionRate)

    // Fetch top products (simplified approach)
    const allOrders = await payload.find({
      collection: 'orders',
      draft,
      where: dateFilter,
      pagination: false,
      depth: 2, // To get product details
    })

    // Aggregate product sales
    const productSales: {
      [key: string]: { id: number; name: string; revenue: number; units: number }
    } = {}

    allOrders.docs.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          if (item.product) {
            const productId = typeof item.product === 'object' ? item.product.id : item.product
            const productName =
              typeof item.product === 'object' ? item.product.title : `Product ${item.product}`

            if (!productSales[productId]) {
              productSales[productId] = {
                id: typeof productId === 'number' ? productId : parseInt(productId),
                name: productName,
                revenue: 0,
                units: 0,
              }
            }

            productSales[productId].revenue += (item.price || 0) * (item.quantity || 0)
            productSales[productId].units += item.quantity || 0
          }
        })
      }
    })

    // Convert to array and sort by revenue
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((product) => ({
        ...product,
        growth: 0, // Simplified, would need more data for accurate growth
      }))

    // Fetch customer analytics
    const totalCustomersResult = await payload.find({
      collection: 'customers',
      draft,
      pagination: false,
    })

    const newCustomers = currentCustomers.docs.length
    const returningCustomers = 0 // Would need more complex calculation

    // Calculate customer retention (simplified)
    const totalCustomers = totalCustomersResult.docs.length
    const customerRetentionRate =
      totalCustomers > 0 ? Math.min((newCustomers / totalCustomers) * 100, 100) : 0

    // Calculate average lifetime value (simplified)
    const totalRevenueAllTime = currentOrders.docs.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    )
    const averageLifetimeValue = totalCustomers > 0 ? totalRevenueAllTime / totalCustomers : 0

    // Fetch inventory alerts
    const lowStockProducts = await payload.find({
      collection: 'products',
      draft,
      where: {
        and: [
          {
            inStock: {
              less_than: 10, // Low stock threshold
            },
          },
          {
            inStock: {
              greater_than: 0,
            },
          },
        ],
      },
      limit: 10,
      pagination: false,
    })

    const inventoryAlerts = lowStockProducts.docs.map((product: any) => ({
      product: product.title,
      currentStock: product.inStock,
      minStock: product.lowStockThreshold || 5,
      severity:
        product.inStock <= (product.lowStockThreshold || 5)
          ? 'high'
          : product.inStock <= (product.lowStockThreshold || 5) * 2
            ? 'medium'
            : 'low',
    }))

    // Fetch payment methods distribution
    const paymentMethodCounts: { [key: string]: { count: number; amount: number } } = {}

    currentOrders.docs.forEach((order) => {
      const method = order.payment?.method || 'unknown'
      if (!paymentMethodCounts[method]) {
        paymentMethodCounts[method] = { count: 0, amount: 0 }
      }
      paymentMethodCounts[method].count += 1
      paymentMethodCounts[method].amount += order.total || 0
    })

    const paymentMethods = Object.entries(paymentMethodCounts)
      .map(([method, data]) => ({
        method: method.charAt(0).toUpperCase() + method.slice(1).replace(/_/g, ' '),
        percentage: currentOrderCount > 0 ? (data.count / currentOrderCount) * 100 : 0,
        amount: data.amount,
      }))
      .sort((a, b) => b.amount - a.amount)

    // Fetch recent orders
    const recentOrders = await payload.find({
      collection: 'orders',
      draft,
      limit: 5,
      sort: '-createdAt',
      pagination: false,
      depth: 1, // To get customer details
    })

    const recentOrdersFormatted = recentOrders.docs.map((order: any) => ({
      id: order.orderNumber,
      customer: order.customer?.fullName || 'Unknown Customer',
      amount: order.total,
      status: order.status,
      time: new Date(order.createdAt).toLocaleDateString(),
    }))

    // Generate time-series data for charts
    const dateRanges = generateDateRanges(dateRange)
    const revenueChartData = []

    for (const range of dateRanges) {
      const ordersInRange = await payload.find({
        collection: 'orders',
        draft,
        where: {
          createdAt: {
            greater_than: range.start.toISOString(),
            less_than: range.end.toISOString(),
          },
        },
        pagination: false,
      })

      const revenue = ordersInRange.docs.reduce((sum, order) => sum + (order.total || 0), 0)
      const orders = ordersInRange.docs.length

      revenueChartData.push({
        date: range.label,
        revenue: parseFloat(revenue.toFixed(2)),
        orders,
      })
    }

    // Prepare response
    const analyticsData = {
      salesOverview: {
        totalRevenue: parseFloat(currentRevenue.toFixed(2)),
        totalOrders: currentOrderCount,
        averageOrderValue: parseFloat(currentAOV.toFixed(2)),
        conversionRate: parseFloat(currentConversionRate.toFixed(2)),
        revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
        ordersGrowth: parseFloat(ordersGrowth.toFixed(2)),
        aovGrowth: parseFloat(aovGrowth.toFixed(2)),
        conversionGrowth: parseFloat(conversionGrowth.toFixed(2)),
      },
      revenueChart: revenueChartData,
      topProducts,
      customerAnalytics: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customerRetentionRate: parseFloat(customerRetentionRate.toFixed(2)),
        averageLifetimeValue: parseFloat(averageLifetimeValue.toFixed(2)),
      },
      inventoryAlerts,
      paymentMethods,
      recentOrders: recentOrdersFormatted,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
