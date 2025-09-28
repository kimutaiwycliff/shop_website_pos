'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface BarChartData {
  name: string
  value: number
  [key: string]: any
}

interface LineChartData {
  date: string
  revenue: number
  orders: number
  [key: string]: any
}

interface PieChartData {
  name: string
  value: number
  [key: string]: any
}

interface AnalyticsChartProps {
  type: 'bar' | 'line' | 'pie'
  data: BarChartData[] | LineChartData[] | PieChartData[]
  title: string
  dataKey?: string
  colors?: string[]
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  data,
  title,
  dataKey = 'value',
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data as BarChartData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} name={title} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data as LineChartData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={colors[0]}
                activeDot={{ r: 8 }}
                name="Revenue"
              />
              <Line type="monotone" dataKey="orders" stroke={colors[1]} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data as PieChartData[]}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              >
                {(data as PieChartData[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderChart()}
    </div>
  )
}

export default AnalyticsChart
