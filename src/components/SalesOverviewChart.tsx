'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface SalesDataPoint {
  date: string
  revenue: number
  orders: number
}

interface SalesOverviewChartProps {
  data: SalesDataPoint[]
  title: string
  currentValue: number
  previousValue: number
  growth: number
  valueType: 'revenue' | 'orders' | 'aov' | 'conversion'
}

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({
  data,
  title,
  currentValue,
  previousValue,
  growth,
  valueType,
}) => {
  const formatValue = (value: number) => {
    if (valueType === 'revenue') {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
      }).format(value)
    }
    return value.toLocaleString()
  }

  const getValueForChart = (dataPoint: SalesDataPoint) => {
    switch (valueType) {
      case 'revenue':
        return dataPoint.revenue
      case 'orders':
        return dataPoint.orders
      case 'aov':
        return dataPoint.orders > 0 ? dataPoint.revenue / dataPoint.orders : 0
      case 'conversion':
        return 0 // Simplified for this example
      default:
        return dataPoint.revenue
    }
  }

  const chartData = data.map((point) => ({
    ...point,
    value: getValueForChart(point),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div
            className={cn(
              'flex items-center text-sm font-medium',
              growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {growth >= 0 ? '+' : ''}
            {growth.toFixed(1)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{formatValue(currentValue)}</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  valueType === 'revenue' ? `KES${value / 1000}k` : value.toString()
                }
                width={valueType === 'revenue' ? 60 : 40}
              />
              <Tooltip
                formatter={(value) => [formatValue(Number(value)), title]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="value" name={title} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === chartData.length - 1 ? '#3b82f6' : '#93c5fd'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Previous: {formatValue(previousValue)}</span>
          <span>
            Change: {growth >= 0 ? '+' : ''}
            {growth.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesOverviewChart
