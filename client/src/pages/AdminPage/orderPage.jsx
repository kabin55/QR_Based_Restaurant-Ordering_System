import React, { useState, useEffect, useMemo } from 'react'
import { Search, Printer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revenueFilter, setRevenueFilter] = useState('today')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders/all`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        )
        if (!res.ok) {
          const text = await res.text()
          throw new Error(
            `Failed to fetch orders: ${res.status} ${res.statusText}\nResponse: ${text}`
          )
        }
        const data = await res.json()
        if (!data.orders || !Array.isArray(data.orders)) {
          throw new Error('Invalid response format: Expected an orders array')
        }
        setOrders(data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError(
          'Failed to load orders. Please check the server and try again.'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleFilterChange = (filter) => {
    setRevenueFilter(filter)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const previousOrders = orders
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/orders/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: 'include',
        }
      )
      if (!res.ok) {
        const text = await res.text()
        throw new Error(
          `Failed to update status: ${res.status} ${res.statusText}\nResponse: ${text}`
        )
      }
      const data = await res.json()
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
      setOrders(previousOrders)
      setError('Failed to update order status. Please try again.')
    }
  }

  const printBill = (order) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill for Order ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .footer { margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Bill for Order ${order._id}</h1>
          <p><strong>Table No:</strong> ${order.tableno ?? 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString(
            'en-US',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }
          )}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.item}</td>
                  <td>${item.quantity}</td>
                  <td>Rs: ${item.price ? item.price.toFixed(2) : 'N/A'}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
          <p class="total">Total: Rs: ${(order.subtotal || 0).toFixed(2)}</p>
          <p class="footer">Thank you for your order!</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { pendingOrders, completedOrders, filteredOrders, totalRevenue } =
    useMemo(() => {
      const startOfDay = today.getTime()
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000

      const filtered =
        revenueFilter === 'today'
          ? orders.filter((order) => {
              const orderDate = new Date(order.createdAt).getTime()
              return orderDate >= startOfDay && orderDate < endOfDay
            })
          : orders

      const searchedOrders = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(search.toLowerCase()) ||
          (order.tableno
            ?.toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ??
            false) ||
          order.items.some((item) =>
            item.item.toLowerCase().includes(search.toLowerCase())
          ) ||
          order.status.toLowerCase().includes(search.toLowerCase())
      )

      const revenue = filtered.reduce(
        (sum, order) => sum + (order.subtotal || 0),
        0
      )

      const counts = orders.reduce(
        (acc, order) => {
          const orderDate = new Date(order.createdAt).getTime()
          if (orderDate >= startOfDay && orderDate < endOfDay) {
            if (order.status === 'pending') {
              acc.pendingOrders += 1
            } else if (order.status === 'completed') {
              acc.completedOrders += 1
            }
          }
          return acc
        },
        { pendingOrders: 0, completedOrders: 0 }
      )

      return {
        pendingOrders: counts.pendingOrders,
        completedOrders: counts.completedOrders,
        filteredOrders: searchedOrders,
        totalRevenue: revenue,
      }
    }, [orders, search, revenueFilter])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by order ID, table no, item, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search orders by ID, table number, item, or status"
              />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-600">
              Pending Orders (Today)
            </h2>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-600">
              Completed Orders (Today)
            </h2>
            <p className="text-2xl font-bold">{completedOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-green-600">
              Total Revenue
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-green-600">
                Rs: {totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('today')}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md transform hover:scale-105 ${
              revenueFilter === 'today'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-pressed={revenueFilter === 'today'}
            aria-label="Show total revenue and orders for today"
          >
            Today
          </button>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md transform hover:scale-105 ${
              revenueFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-pressed={revenueFilter === 'all'}
            aria-label="Show total revenue and orders for all time"
          >
            All
          </button>
        </div>

        {/* Orders Table */}
        <section className="bg-white rounded-lg shadow">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <caption className="sr-only">Customer orders</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Order ID
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Table No
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Items
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Total
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Date
                  </th>
                  <th
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      Loading orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-medium">
                        {order._id}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 font-medium">
                        {order.tableno ?? 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-medium">{item.item}</span>
                            <span className="text-gray-500 ml-2">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                        Rs: {(order.subtotal || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, 'pending')
                            }
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              order.status === 'pending'
                                ? 'bg-yellow-300 text-yellow-900'
                                : 'bg-gray-200 text-gray-700 hover:bg-yellow-200'
                            }`}
                            aria-pressed={order.status === 'pending'}
                            aria-label={`Set order ${order._id} status to pending`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, 'completed')
                            }
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              order.status === 'completed'
                                ? 'bg-green-300 text-green-900'
                                : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                            }`}
                            aria-pressed={order.status === 'completed'}
                            aria-label={`Set order ${order._id} status to completed`}
                          >
                            Completed
                          </button>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {new Date(order.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <button
                          onClick={() => printBill(order)}
                          className="px-3 py-1 text-xs rounded-full font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300"
                          aria-label={`Print bill for order ${order._id}`}
                        >
                          <Printer className="inline-block h-4 w-4 mr-1" />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4 p-4">
            {isLoading ? (
              <div className="text-center p-4">Loading orders...</div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 p-4 rounded-md"
                >
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Table No:</strong> {order.tableno ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Items:</strong>{' '}
                    {order.items
                      .map((item) => `${item.item} ×${item.quantity}`)
                      .join(', ')}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs:{' '}
                    {(order.subtotal || 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateOrderStatus(order._id, 'pending')}
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.status === 'pending'
                          ? 'bg-yellow-300 text-yellow-900'
                          : 'bg-gray-200 text-gray-700 hover:bg-yellow-200'
                      }`}
                      aria-pressed={order.status === 'pending'}
                      aria-label={`Set order ${order._id} status to pending`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-300 text-green-900'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                      }`}
                      aria-pressed={order.status === 'completed'}
                      aria-label={`Set order ${order._id} status to completed`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => printBill(order)}
                      className="px-3 py-1 text-xs rounded-full font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300"
                      aria-label={`Print bill for order ${order._id}`}
                    >
                      <Printer className="inline-block h-4 w-4 mr-1" />
                      Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
