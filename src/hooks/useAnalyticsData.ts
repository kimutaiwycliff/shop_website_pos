'use client'

import { useState, useEffect } from 'react'

export interface SalesOverview {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  revenueGrowth: number
  ordersGrowth: number
  aovGrowth: number
  conversionGrowth: number
}

export interface RevenueChartPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: number
  name: string
  revenue: number
  units: number
  growth: number
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  customerRetentionRate: number
  averageLifetimeValue: number
}

export interface InventoryAlert {
  product: string
  currentStock: number
  minStock: number
  severity: 'high' | 'medium' | 'low'
}

export interface PaymentMethod {
  method: string
  percentage: number
  amount: number
}

export interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  time: string
}

export interface AnalyticsData {
  salesOverview: SalesOverview
  revenueChart: RevenueChartPoint[]
  topProducts: TopProduct[]
  customerAnalytics: CustomerAnalytics
  inventoryAlerts: InventoryAlert[]
  paymentMethods: PaymentMethod[]
  recentOrders: RecentOrder[]
}

export const useAnalyticsData = (dateRange: string = 'last_30_days') => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics?dateRange=${dateRange}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const refreshData = () => {
    fetchData()
  }

  return { data, loading, error, refreshData }
}
