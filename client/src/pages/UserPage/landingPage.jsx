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
      if (data.success) {
        toast.success(data.message || 'Restaurant ID validated successfully!')
        // Store restaurant details in component state instead of localStorage
        sessionStorage.setItem('restaurantDetails', JSON.stringify(data.detail))
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, #1d1e22 0%, #393f4d 50%, #1d1e22 100%)',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#393f4d',
            color: '#d4d4dc',
            border: '1px solid #d4d4dc',
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="rounded-3xl shadow-2xl p-10 max-w-lg w-full backdrop-blur-md border border-white/10"
        style={{
          background:
            'linear-gradient(145deg, rgba(57, 63, 77, 0.9), rgba(29, 30, 34, 0.9))',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl border-2"
            style={{
              background: 'linear-gradient(135deg, #393f4d, #d4d4dc)',
              borderColor: '#d4d4dc',
            }}
          >
            ☕
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-3">
          <span style={{ color: '#d4d4dc' }}>Welcome to </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(135deg, #d4d4dc, #393f4d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Cafe Hub
          </span>
        </h1>
        <p className="text-center mb-8 text-lg" style={{ color: '#d4d4dc' }}>
          Enter your unique restaurant ID to start managing your cafe
          seamlessly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="restaurantId"
              className="block text-sm font-medium mb-1"
              style={{ color: '#d4d4dc' }}
            >
              Restaurant ID
            </label>
            <motion.input
              type="text"
              id="restaurantId"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="Enter your restaurant ID e.g., CAFE001, RESTO123"
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
              className="mt-1 block w-full px-5 py-3 rounded-xl shadow-sm focus:outline-none transition duration-200 border-2"
              style={{
                backgroundColor: '#1d1e22',
                color: '#d4d4dc',
                borderColor: '#393f4d',
                '&:focus': {
                  borderColor: '#d4d4dc',
                  boxShadow: `0 0 0 4px rgba(212, 212, 220, 0.1)`,
                },
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#d4d4dc'
                e.target.style.boxShadow = '0 0 0 4px rgba(212, 212, 220, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#393f4d'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 border-2"
            style={{
              background: loading
                ? '#393f4d'
                : 'linear-gradient(135deg, #d4d4dc, #393f4d)',
              color: loading ? '#d4d4dc' : '#1d1e22',
              borderColor: '#d4d4dc',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Validating...' : 'Enter Dashboard'}
          </motion.button>

          <div className="flex justify-center gap-3 mt-8">
            {['Quick Order', 'Live Menu', 'Easy Pay'].map((feature, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full text-sm font-medium cursor-default border"
                style={{
                  backgroundColor: 'rgba(57, 63, 77, 0.3)',
                  borderColor: 'rgba(212, 212, 220, 0.2)',
                  color: '#d4d4dc',
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </form>
      </motion.div>
    </div>
  )
}
