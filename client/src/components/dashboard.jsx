import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

function StatCard({ title, value, change, icon, color }) {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div
            className={`flex items-center mt-2 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span className="mr-1">{isPositive ? '↗️' : '↘️'}</span>
            <span>{Math.abs(change)}% from last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children, controls }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {controls}
      </div>
      {children}
    </div>
  )
}

function TimeRangeSelector({ selected, onChange, options }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            selected === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('weekly')
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    revenueChange: 0,
    ordersChange: 0,
    totalItems: 0,
  })
  const [earningsData, setEarningsData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  })
  const [topProductsData, setTopProductsData] = useState([])

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]

  const currentEarningsData = earningsData[timeRange] || []

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/dashboard/earning`, {
        credentials: 'include',
      })
      const data = await res.json()

      // Update state
      setDashboardData({
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        totalItems: data.totalItems,
        revenueChange: 0,
        ordersChange: 0,
      })
      setEarningsData({
        daily: data.daily,
        weekly: data.weekly,
        monthly: data.monthly,
      })
      setTopProductsData(data.topProducts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${dashboardData.totalRevenue.toLocaleString()}`}
            change={dashboardData.revenueChange}
            icon="💰"
            color="bg-green-100"
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders.toLocaleString()}
            change={dashboardData.ordersChange}
            icon="📋"
            color="bg-blue-100"
          />
          <StatCard
            title="Total Items Sold"
            value={dashboardData.totalItems.toLocaleString()}
            change={dashboardData.ordersChange}
            icon="📦"
            color="bg-blue-100"
          />
        </div>

        {/* Earnings Overview */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Div */}
          <ChartCard title=" Earnings Overview">
            <div className="flex flex-col gap-8">
              {/* Weekly Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData.daily}>
                    <defs>
                      <linearGradient
                        id="colorWeekly"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06B6D4"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06B6D4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#06B6D4"
                      fillOpacity={1}
                      fill="url(#colorWeekly)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>

          {/* Right Div */}
          <ChartCard
            title=" Weekly & Monthly Earnings"
            controls={
              <TimeRangeSelector
                selected={timeRange}
                onChange={setTimeRange}
                options={timeRangeOptions}
              />
            }
          >
            <div className="h-80 ">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentEarningsData}>
                  <defs>
                    <linearGradient
                      id="colorEarnings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#06B6D4"
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartCard
              title="Top Selling Products"
              controls={
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📈</span>
                  <span>Last 30 days</span>
                </div>
              }
            >
              <div className="mt-6 pt-6 border-t border-gray-200">
                {(topProductsData || []).map((product, index) => (
                  <div key={product.name} className="group mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Rs. {product.revenue.toLocaleString()} revenue
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {product.sales}
                        </p>
                        <p className="text-xs text-gray-500">units sold</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${
                            (product.sales /
                              Math.max(
                                ...topProductsData.map((p) => p.sales)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  )
}
