// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// const HomePage = () => {
//   const [tableNumber, setTableNumber] = useState('')
//   const [restaurantData, setRestaurantData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const storedData = localStorage.getItem('data')

//     setRestaurantData(JSON.parse(storedData))
//     setLoading(false)
//   }, [])

//   const handleWelcomeClick = () => {
//     if (!tableNumber || tableNumber < 0) {
//       alert('Please enter your table number before continuing.')
//       return
//     }
//     localStorage.setItem('tableNumber', tableNumber)
//     console.log(`Navigating to menu for Table ${tableNumber}...`)
//     navigate('/menu')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-700 text-lg">Loading restaurant info...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-600 text-lg">Error: {error}</p>
//       </div>
//     )
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center relative"
//       style={{
//         backgroundImage: restaurantData?.image
//           ? `url(${restaurantData.image})`
//           : undefined,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black opacity-60"></div>

//       {/* Main Card */}
//       <div className="relative z-10 bg-white/90 rounded-3xl shadow-lg w-full max-w-md p-8 space-y-6 text-center backdrop-blur-sm">
//         {/* Restaurant Name */}
//         <h1 className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-500 inline-block pb-2">
//           {restaurantData?.restaurantName || 'Restaurant Name'}
//         </h1>

//         {/* Address */}
//         <p className="text-gray-700 text-lg">{restaurantData?.address || ''}</p>

//         {/* Description */}
//         {restaurantData?.description && (
//           <p className="text-gray-600 italic">{restaurantData.description}</p>
//         )}

//         {/* Table Number Input */}
//         <div className="flex justify-center mb-4">
//           <input
//             type="number"
//             placeholder="Enter Table Number"
//             value={tableNumber}
//             onChange={(e) => setTableNumber(e.target.value)}
//             className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-center"
//           />
//         </div>

//         {/* Welcome Button */}
//         <button
//           onClick={handleWelcomeClick}
//           className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold py-2 px-8 rounded-full shadow-md transition-all duration-300"
//         >
//           Go to Menu
//         </button>
//       </div>
//     </div>
//   )
// }

// export default HomePage

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BACKEND_URL

const HomePage = () => {
  const [tableNumber, setTableNumber] = useState('')
  const [restaurantData, setRestaurantData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
        console.log('Validate Response:', data)

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
    if (!tableNumber || tableNumber < 0) {
      alert('Please enter your table number before continuing.')
      return
    }
    localStorage.setItem('tableNumber', tableNumber)
    console.log(`Navigating to menu for Table ${tableNumber}...`)
    navigate('/menu')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Loading restaurant info...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: restaurantData?.image
          ? `url(${restaurantData.image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 bg-white/90 rounded-3xl shadow-lg w-full max-w-md p-8 space-y-6 text-center backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-500 inline-block pb-2">
          {restaurantData?.restaurantName || 'Restaurant Name'}
        </h1>

        <p className="text-gray-700 text-lg">{restaurantData?.address || ''}</p>

        {restaurantData?.description && (
          <p className="text-gray-600 italic">{restaurantData.description}</p>
        )}

        <div className="flex justify-center mb-4">
          <input
            type="number"
            placeholder="Enter Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-center"
          />
        </div>

        <button
          onClick={handleWelcomeClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold py-2 px-8 rounded-full shadow-md transition-all duration-300"
        >
          Go to Menu
        </button>
      </div>
    </div>
  )
}

export default HomePage
