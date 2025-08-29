import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

export default function LandingPage() {
  const [restaurantId, setRestaurantId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!restaurantId.trim()) {
      toast.error('Please enter a valid restaurant ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ restaurantId }),
      })
      const data = await response.json()
      console.log(data)

      if (data.success) {
        toast.success(data.message || 'Restaurant ID validated successfully!')

        // ✅ Store restaurant detail in localStorage
        localStorage.setItem('restaurantDetails', JSON.stringify(data.detail))

        navigate(`/${restaurantId}`)
      } else {
        toast.error(data.message || 'Invalid restaurant ID')
      }
    } catch (error) {
      toast.error('Failed to validate restaurant ID')
      console.error('Validation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            🍽️
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Welcome to Restaurant Admin
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your unique restaurant ID to access the dashboard
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="restaurantId"
              className="block text-sm font-medium text-gray-700"
            >
              Restaurant ID
            </label>
            <input
              type="text"
              id="restaurantId"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
              placeholder="Enter your restaurant ID"
              disabled={loading}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700'
            } transition duration-200`}
          >
            {loading ? 'Validating...' : 'Enter Dashboard'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
