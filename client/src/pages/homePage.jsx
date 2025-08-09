import React, { useState } from 'react'
import backgroundImg from '../assets/download.jpeg'

const HomePage = ({
  restaurantName = 'Easy Bite Cafe',
  address = 'Chandragiri 13 Purano Naikap, Kathmandu',
  offer = 'Get 20% off on your first order!',
}) => {
  const [tableNumber, setTableNumber] = useState('')

  const handleWelcomeClick = () => {
    if (!tableNumber) {
      alert('Please enter your table number before continuing.')
      return
    }
    console.log(`Navigating to menu for Table ${tableNumber}...`)
    // navigation logic here
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/90 rounded-3xl shadow-lg w-full max-w-md p-8 space-y-6 text-center backdrop-blur-sm">
        {/* Restaurant Name */}
        <h1 className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-500 inline-block pb-2">
          {restaurantName}
        </h1>

        {/* Address */}
        <p className="text-gray-700 text-lg">{address}</p>

        {/* Table Number Input */}
        <div className="flex justify-center mb-4">
          <input
            type="number"
            placeholder="Enter Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-center"
          />
        </div>

        {/* Welcome Button */}
        <button
          onClick={handleWelcomeClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold py-2 px-8 rounded-full shadow-md transition-all duration-300"
        >
          Go to Menu
        </button>

        {/* Special Offer */}
        {offer && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-yellow-800 shadow-inner animate-pulse">
            🎉 <strong>Special Offer:</strong> {offer}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
