// import React, { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Search, Plus, Minus, ShoppingCart, X, MapPin } from 'lucide-react'

// export default function QRMenuResponsive() {
//   const [menu, setMenu] = useState([])
//   const [query, setQuery] = useState('')
//   const [cart, setCart] = useState({})
//   const [isCartOpen, setIsCartOpen] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [toast, setToast] = useState(null)
//   const [selectedCategory, setSelectedCategory] = useState('All')
//   const [restaurantName, setRestaurantName] = useState('Restaurant')
//   const [tableId, setTableId] = useState('unknown')
//   const navigator = useNavigate()

//   // Fetch restaurant info and menu
//   useEffect(() => {
//     const tableNumber = localStorage.getItem('tableNumber')

//     setTableId(tableNumber || 'unknown')

//     if (!tableNumber) {
//       navigator('/')
//     }
//     const restData = JSON.parse(
//       localStorage.getItem('restaurantDetails') || '{}'
//     )

//     setRestaurantName(restData.restaurantName || 'Restaurant')

//     const fetchMenu = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/items/${restData.restaurantId}`
//         )
//         const data = await res.json()
//         const formattedMenu = data.map((d) => ({
//           id: d._id,
//           name: d.item,
//           price: d.price,
//           desc: d.type,
//           category: d.type || 'Uncategorized',
//         }))
//         setMenu(formattedMenu)
//       } catch (err) {
//         console.error('Error fetching menu:', err)
//       }
//     }
//     fetchMenu()
//   }, [])

//   // Unique categories for filtering
//   const uniqueCategories = useMemo(() => {
//     const cats = Array.from(
//       new Set(menu.map((item) => item.category).filter(Boolean))
//     )
//     return cats.length ? cats : ['All']
//   }, [menu])

//   // Filtered menu based on search and category
//   const filteredMenu = useMemo(
//     () =>
//       menu.filter((item) => {
//         const matchesCategory =
//           selectedCategory === 'All' || item.category === selectedCategory
//         const matchesQuery =
//           !query ||
//           item.name.toLowerCase().includes(query.toLowerCase()) ||
//           (item.desc || '').toLowerCase().includes(query.toLowerCase())
//         return matchesCategory && matchesQuery
//       }),
//     [menu, query, selectedCategory]
//   )

//   // Convert cart to array with item details
//   const cartItems = useMemo(() => {
//     return Object.entries(cart).map(([id, qty]) => {
//       const item = menu.find((m) => m.id === id) || {
//         id,
//         name: 'Unknown',
//         price: 0,
//       }
//       return { ...item, qty }
//     })
//   }, [cart, menu])

//   // Total price
//   const total = useMemo(
//     () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
//     [cartItems]
//   )

//   // Update cart quantity
//   const updateQuantity = (id, change) => {
//     setCart((prev) => {
//       const newQty = (prev[id] || 0) + change
//       if (newQty <= 0) {
//         const { [id]: _, ...rest } = prev
//         return rest
//       }
//       return { ...prev, [id]: newQty }
//     })
//   }

//   // Place order
//   const placeOrder = async () => {
//     if (!cartItems.length) return setToast('Add at least one item')
//     setSubmitting(true)
//     try {
//       const restData = JSON.parse(
//         localStorage.getItem('restaurantDetails') || '{}'
//       )
//       const res = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/order/${restData.restaurantId}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             tableno: tableId,
//             items: cartItems.map(({ name, price, qty }) => ({
//               item: name, // use `item` instead of `name`
//               price,
//               quantity: qty,
//             })),
//             subtotal: total,
//           }),
//         }
//       )

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || 'Failed to place order')

//       setCart({})
//       setIsCartOpen(false)
//       setToast('Order placed successfully')
//     } catch (err) {
//       console.error(err)
//       setToast(err.message || 'Error placing order')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Category filter component
//   const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
//     <div className="flex gap-2 flex-wrap my-4 px-4 sm:px-0">
//       {categories.map((cat) => (
//         <button
//           key={cat}
//           onClick={() => onSelect(cat)}
//           className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
//             selectedCategory === cat
//               ? 'bg-indigo-500 text-white'
//               : 'bg-white/80 text-gray-800 hover:bg-white'
//           }`}
//         >
//           {cat}
//         </button>
//       ))}
//       <button
//         onClick={() => onSelect('All')}
//         className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap bg-red-500 text-white hover:bg-red-600"
//       >
//         Reset
//       </button>
//     </div>
//   )

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-cyan-600 text-white rounded-lg p-3 sm:p-4 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <MapPin size={18} className="sm:w-5 sm:h-5" />
//               <div>
//                 <h1 className="text-base sm:text-lg font-semibold">
//                   {restaurantName}
//                 </h1>
//                 <p className="text-xs sm:text-sm opacity-80">
//                   Table: {tableId}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full"
//               aria-label="Open cart"
//             >
//               <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
//             </button>
//           </div>

//           {/* Search */}
//           <div className="my-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//             <div className="flex items-center bg-white rounded-lg shadow flex-grow px-3 py-2">
//               <Search size={16} className="sm:w-5 sm:h-5 opacity-60" />
//               <input
//                 type="search"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search menu..."
//                 className="flex-grow outline-none ml-2 text-sm sm:text-base"
//               />
//               {query && (
//                 <button
//                   onClick={() => setQuery('')}
//                   className="text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-100"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>

//           <CategoryFilter
//             categories={['All', ...uniqueCategories]}
//             selectedCategory={selectedCategory}
//             onSelect={setSelectedCategory}
//           />
//         </div>
//       </header>

//       {/* Menu */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow overflow-auto">
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {filteredMenu.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex-1">
//                 <h3 className="font-medium text-base sm:text-lg">
//                   {item.name}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
//                 <p className="text-sm sm:text-base mt-1 font-semibold">
//                   Rs. {item.price}
//                 </p>
//               </div>
//               <div className="flex items-center justify-between mt-4">
//                 <div className="flex items-center border rounded-md overflow-hidden">
//                   <button
//                     onClick={() => updateQuantity(item.id, -1)}
//                     className="px-3 sm:px-4 py-2 hover:bg-gray-100"
//                     aria-label="Decrease quantity"
//                   >
//                     <Minus size={16} className="sm:w-5 sm:h-5" />
//                   </button>
//                   <input
//                     type="number"
//                     min={0}
//                     value={cart[item.id] || 0}
//                     onChange={(e) =>
//                       updateQuantity(
//                         item.id,
//                         parseInt(e.target.value) - (cart[item.id] || 0)
//                       )
//                     }
//                     className="w-12 sm:w-14 text-center outline-none p-2 text-sm"
//                   />
//                   <button
//                     onClick={() => updateQuantity(item.id, 1)}
//                     className="px-3 sm:px-4 py-2 hover:bg-gray-100"
//                     aria-label="Increase quantity"
//                   >
//                     <Plus size={16} className="sm:w-5 sm:h-5" />
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => updateQuantity(item.id, 1)}
//                   className="bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-cyan-700"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* Cart Drawer */}
//       {isCartOpen && (
//         <div
//           className="fixed inset-0 z-50 flex"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div
//             className="flex-1 bg-black/40"
//             onClick={() => setIsCartOpen(false)}
//             aria-hidden="true"
//           />
//           <div className="w-full max-w-md bg-white p-4 sm:p-6 overflow-auto">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg sm:text-xl font-semibold">Your Order</h2>
//               <button
//                 onClick={() => setIsCartOpen(false)}
//                 aria-label="Close cart"
//                 className="p-2"
//               >
//                 <X size={20} className="sm:w-6 sm:h-6" />
//               </button>
//             </div>

//             <div className="mt-4 space-y-3">
//               {cartItems.length === 0 ? (
//                 <div className="text-center text-gray-500 py-12 text-sm sm:text-base">
//                   Cart is empty
//                 </div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center justify-between bg-gray-50 p-3 rounded"
//                   >
//                     <div>
//                       <div className="font-medium text-sm sm:text-base">
//                         {item.name}
//                       </div>
//                       <div className="text-xs sm:text-sm text-gray-600">
//                         Rs. {item.price} × {item.qty}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => updateQuantity(item.id, -1)}
//                         className="p-2 rounded hover:bg-gray-100"
//                         aria-label="Decrease quantity"
//                       >
//                         <Minus size={14} className="sm:w-4 sm:h-4" />
//                       </button>
//                       <div className="px-2 text-sm">{item.qty}</div>
//                       <button
//                         onClick={() => updateQuantity(item.id, 1)}
//                         className="p-2 rounded hover:bg-gray-100"
//                         aria-label="Increase quantity"
//                       >
//                         <Plus size={14} className="sm:w-4 sm:h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="mt-4 border-t pt-4">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm sm:text-base text-gray-600">
//                   Subtotal
//                 </div>
//                 <div className="font-semibold text-sm sm:text-base">
//                   Rs. {total}
//                 </div>
//               </div>
//               <div className="mt-4 space-y-3">
//                 <button
//                   onClick={placeOrder}
//                   disabled={submitting}
//                   className="w-full bg-cyan-600 text-white py-3 rounded-md font-semibold disabled:opacity-60 hover:bg-cyan-700"
//                 >
//                   {submitting ? 'Placing order...' : 'Place Order'}
//                 </button>
//                 <button
//                   onClick={() => setToast('Call waiter request sent')}
//                   className="w-full border py-3 rounded-md font-semibold hover:bg-gray-100"
//                 >
//                   Call Waiter
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Floating bottom button */}
//       {cartItems.length > 0 && (
//         <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
//           <button
//             onClick={() => setIsCartOpen(true)}
//             className="w-full bg-cyan-600 text-white py-3 rounded-md font-semibold shadow-lg hover:bg-cyan-700 transition"
//           >
//             View Cart ({cartItems.length} items) - Rs. {total}
//           </button>
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div className="fixed left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 z-50">
//           <div className="bg-black text-white px-4 py-2 rounded-full shadow text-xs sm:text-sm">
//             {toast}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../components/Toast'
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  MapPin,
  Star,
} from 'lucide-react'

export default function QRMenuResponsive() {
  const [menu, setMenu] = useState([])
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [restaurantName, setRestaurantName] = useState('Restaurant')
  const [tableId, setTableId] = useState('unknown')
  const navigator = useNavigate()

  // Fetch restaurant info and menu
  useEffect(() => {
    const tableNumber = localStorage.getItem('tableNumber')
    setTableId(tableNumber || 'unknown')
    if (!tableNumber) navigator('/')

    const restData = JSON.parse(
      localStorage.getItem('restaurantDetails') || '{}'
    )
    setRestaurantName(restData.restaurantName || 'Restaurant')

    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/items/${restData.restaurantId}`
        )
        const data = await res.json()
        const formattedMenu = data.map((d) => ({
          id: d._id,
          name: d.item,
          price: d.price,
          desc: d.type,
          category: d.type || 'Uncategorized',
        }))
        setMenu(formattedMenu)
      } catch (err) {
        console.error('Error fetching menu:', err)
      }
    }
    fetchMenu()
  }, [])

  // Unique categories
  const uniqueCategories = useMemo(() => {
    const cats = Array.from(
      new Set(menu.map((item) => item.category).filter(Boolean))
    )
    return cats.length ? cats : ['All']
  }, [menu])

  // Filtered menu
  const filteredMenu = useMemo(
    () =>
      menu.filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory
        const matchesQuery =
          !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.desc || '').toLowerCase().includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [menu, query, selectedCategory]
  )

  // Cart items
  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => {
        const item = menu.find((m) => m.id === id) || {
          id,
          name: 'Unknown',
          price: 0,
        }
        return { ...item, qty }
      }),
    [cart, menu]
  )

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  )

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      const newQty = (prev[id] || 0) + change
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newQty }
    })
  }

  const placeOrder = async () => {
    if (!cartItems.length)
      return setToast({ message: 'Add at least one item', type: 'info' })
    setSubmitting(true)
    try {
      const restData = JSON.parse(
        localStorage.getItem('restaurantDetails') || '{}'
      )
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/order/${restData.restaurantId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tableno: tableId,
            items: cartItems.map(({ name, price, qty }) => ({
              item: name,
              price,
              quantity: qty,
            })),
            subtotal: total,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to place order')

      setCart({})
      setIsCartOpen(false)
      setToast({ message: 'Order placed successfully', type: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ message: err.message || 'Error placing order', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
    <div className="flex gap-2 flex-wrap my-4 px-4 sm:px-0">
      {categories.map((cat, idx) => (
        <button
          key={cat + idx} // ensures unique key even if names repeat
          onClick={() => onSelect(cat)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            selectedCategory === cat
              ? 'bg-indigo-500 text-white'
              : 'bg-white/80 text-gray-800 hover:bg-white'
          }`}
        >
          {cat}
        </button>
      ))}
      <button
        onClick={() => onSelect('All')}
        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap bg-red-500 text-white hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  )

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#1d1e22', color: '#d4d4dc' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: '#393f4d' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin size={18} className="sm:w-5 sm:h-5 text-[#d4d4dc]" />
              <div>
                <h1 className="text-base sm:text-lg font-bold">
                  {restaurantName}
                </h1>
                <p className="text-xs sm:text-sm opacity-80">
                  Table: {tableId}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:p-3 rounded-full border border-[#d4d4dc]/30 hover:bg-[#1d1e22]"
            >
              <ShoppingCart
                size={18}
                className="sm:w-5 sm:h-5 text-[#d4d4dc]"
              />
            </button>
          </div>

          {/* Search */}
          <div className="my-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div
              className="flex items-center rounded-lg shadow flex-grow px-3 py-2"
              style={{
                backgroundColor: '#1d1e22',
                border: '1px solid #393f4d',
              }}
            >
              <Search
                size={16}
                className="sm:w-5 sm:h-5 opacity-60 text-[#d4d4dc]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="flex-grow outline-none ml-2 text-sm sm:text-base bg-transparent text-[#d4d4dc] placeholder-[#d4d4dc]/60"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs sm:text-sm px-2 py-1 rounded hover:bg-[#393f4d]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <CategoryFilter
            categories={['All', ...uniqueCategories]}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow overflow-auto">
        <div className="grid gap-4 grid-cols-2">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-4 flex flex-col shadow-md transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#393f4d' }}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-[#d4d4dc]">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm opacity-70 text-[#d4d4dc]">
                  {item.desc}
                </p>
                <p className="text-sm sm:text-base mt-1 font-bold text-[#d4d4dc]">
                  Rs. {item.price}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center rounded-md overflow-hidden bg-[#1d1e22]">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-3 py-2 hover:bg-[#393f4d]"
                  >
                    <Minus size={16} className="text-[#d4d4dc]" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={cart[item.id] || 0}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        parseInt(e.target.value) - (cart[item.id] || 0)
                      )
                    }
                    className="w-10 text-center outline-none bg-transparent text-[#d4d4dc] text-sm"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-2 hover:bg-[#393f4d]"
                  >
                    <Plus size={16} className="text-[#d4d4dc]" />
                  </button>
                </div>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-2 rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          />
          <div
            className="w-full max-w-md p-4 sm:p-6 overflow-auto"
            style={{ backgroundColor: '#1d1e22' }}
          >
            <div className="flex items-center justify-between border-b border-[#393f4d] pb-3">
              <h2 className="text-lg sm:text-xl font-bold">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center opacity-70 py-12 text-sm sm:text-base">
                  Cart is empty
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-md"
                    style={{ backgroundColor: '#393f4d' }}
                  >
                    <div>
                      <div className="font-medium text-sm sm:text-base">
                        {item.name}
                      </div>
                      <div className="text-xs sm:text-sm opacity-70">
                        Rs. {item.price} × {item.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-[#1d1e22] rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="px-2 text-sm">{item.qty}</div>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-[#1d1e22] rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-[#393f4d] pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base opacity-80">Subtotal</div>
                <div className="font-semibold text-sm sm:text-base">
                  Rs. {total}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="w-full py-3 rounded-md font-semibold disabled:opacity-60 transition"
                  style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
                <button
                  onClick={() =>
                    setToast({ message: 'Waiter request sent', type: 'info' })
                  }
                  className="w-full border border-[#393f4d] py-3 rounded-md font-semibold hover:bg-[#393f4d] transition"
                >
                  Call Waiter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 rounded-md font-semibold shadow-lg transition"
            style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
          >
            View Cart ({cartItems.length} items) - Rs. {total}
          </button>
        </div>
      )}

      {/* Toast
      <Toast message={toast} onClose={() => setToast('')} /> */}

      {/* Footer */}
      <footer
        className="mt-auto py-4 text-center text-xs sm:text-sm opacity-70"
        style={{ backgroundColor: '#393f4d' }}
      >
        <div className="flex items-center justify-center gap-1">
          <Star size={14} /> Powered by CAFE-HUB
        </div>
      </footer>
    </div>
  )
}
