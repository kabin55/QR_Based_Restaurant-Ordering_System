import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BACKEND_URL

const HomePage = () => {
  const [tableNumber, setTableNumber] = useState('')
  const [restaurantData, setRestaurantData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { restaurantId } = useParams()

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`${API_URL}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ restaurantId }),
        })

        const data = await response.json()
        // console.log('Validate Response:', data)

        if (data.success) {
          localStorage.setItem('restaurantDetails', JSON.stringify(data.detail))
          setRestaurantData(data.detail)
        } else {
          setError('Invalid restaurant ID')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch restaurant data')
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchRestaurant()
    }
  }, [restaurantId])

  const handleWelcomeClick = () => {
    if (!tableNumber || tableNumber < 1) {
      setMessage(' Please enter a valid table number before continuing.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    localStorage.setItem('tableNumber', tableNumber)
    setMessage(' Redirecting to menu...')
    setTimeout(() => {
      navigate('/menu')
    }, 1000)
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1d1e22' }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 mx-auto"
            style={{ borderColor: '#d4d4dc', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-lg" style={{ color: '#d4d4dc' }}>
            Loading restaurant info...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1d1e22' }}
      >
        <div
          className="rounded-xl p-6 border-2"
          style={{
            backgroundColor: '#393f4d',
            borderColor: '#ef4444',
            color: '#d4d4dc',
          }}
        >
          <p className="text-lg"> Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-4"
      style={{
        backgroundImage: restaurantData?.image
          ? `linear-gradient(rgba(29, 30, 34, 0.8), rgba(57, 63, 77, 0.8)), url(${restaurantData.image})`
          : `linear-gradient(135deg, #1d1e22 0%, #393f4d 50%, #1d1e22 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {message && (
        <div
          className="fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
          style={{
            backgroundColor: message.includes('') ? '#22c55e' : '#ef4444',
            color: 'white',
          }}
        >
          {message}
        </div>
      )}

      <div
        className="relative z-10 rounded-3xl shadow-2xl w-full max-w-lg p-10 space-y-8 text-center backdrop-blur-md border border-white/10"
        style={{
          background:
            'linear-gradient(145deg, rgba(57, 63, 77, 0.95), rgba(29, 30, 34, 0.95))',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Restaurant Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl border-3 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #393f4d, #d4d4dc)',
              borderColor: '#d4d4dc',
            }}
          >
            ☕
          </div>
        </div>

        {/* Restaurant Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(135deg, #d4d4dc, #393f4d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {restaurantData?.restaurantName || 'Restaurant Name'}
          </span>
        </h1>

        {/* Address */}
        <p className="text-lg font-medium" style={{ color: '#d4d4dc' }}>
          📍 {restaurantData?.address || ''}
        </p>

        {/* Description */}
        {restaurantData?.description && (
          <p
            className="text-base italic leading-relaxed px-4"
            style={{ color: '#d4d4dc', opacity: 0.9 }}
          >
            "{restaurantData.description}"
          </p>
        )}

        {/* Special Offer */}
        {restaurantData?.offer && (
          <div
            className="rounded-2xl p-4 border-2 shadow-lg animate-pulse"
            style={{
              background:
                'linear-gradient(135deg, rgba(212, 212, 220, 0.1), rgba(57, 63, 77, 0.2))',
              borderColor: '#d4d4dc',
              color: '#d4d4dc',
            }}
          >
            <div className="text-lg font-bold">🎉 {restaurantData.offer}</div>
          </div>
        )}

        {/* Table Number Input */}
        <div className="space-y-3">
          <label
            htmlFor="tableNumber"
            className="block text-sm font-medium"
            style={{ color: '#d4d4dc' }}
          >
            Table Number
          </label>
          <input
            type="number"
            id="tableNumber"
            placeholder="Enter your table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            min="1"
            className="w-full px-5 py-3 rounded-xl text-center font-semibold text-lg border-2 focus:outline-none transition duration-200"
            style={{
              backgroundColor: '#1d1e22',
              color: '#d4d4dc',
              borderColor: '#393f4d',
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

        {/* Menu Button */}
        <button
          onClick={handleWelcomeClick}
          className="w-full py-4 px-8 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 border-2 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #d4d4dc, #393f4d)',
            color: '#1d1e22',
            borderColor: '#d4d4dc',
          }}
        >
          View Menu & Order
        </button>

        {/* Quick Actions */}
        <div className="flex justify-center gap-3 pt-4">
          {[
            { icon: '📋', label: 'Menu' },
            { icon: '🔔', label: 'Call Staff' },
            { icon: '💳', label: 'Pay Bill' },
          ].map((action, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer border transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(57, 63, 77, 0.4)',
                borderColor: 'rgba(212, 212, 220, 0.3)',
                color: '#d4d4dc',
              }}
            >
              {action.icon} {action.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
