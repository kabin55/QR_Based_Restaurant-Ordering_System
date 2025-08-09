import React, { useEffect, useMemo, useState } from 'react'
import SandwichButton from '../components/sandwichButtons'
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  MapPin,
  CheckCircle,
} from 'lucide-react'

export default function QRMenuResponsive() {
  const [menu, setMenu] = useState([])
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const tableId = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('table') || params.get('t') || 'unknown'
    } catch {
      return 'unknown'
    }
  }, [])

  useEffect(() => {
    const sampleMenu = [
      {
        id: 'm1',
        name: 'Chicken Momo',
        price: 200,
        desc: 'Steamed dumplings with sauce',
      },
      {
        id: 'm2',
        name: 'Veg Thali',
        price: 250,
        desc: 'Rice, daal, seasonal veg and salad',
      },
      {
        id: 'm3',
        name: 'Fried Rice',
        price: 180,
        desc: 'Egg fried rice with veggies',
      },
      {
        id: 'm4',
        name: 'Buff Burger',
        price: 320,
        desc: 'Buffalo patty with house sauce',
      },
      {
        id: 'm5',
        name: 'Cold Drink',
        price: 60,
        desc: '500ml chilled beverage',
      },
    ]
    setMenu(sampleMenu)
  }, [])

  const filtered = useMemo(() => {
    if (!query) return menu
    const q = query.toLowerCase()
    return menu.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.desc || '').toLowerCase().includes(q)
    )
  }, [menu, query])

  const cartItems = Object.keys(cart).map((id) => {
    const item = menu.find((m) => m.id === id) || {
      id,
      name: 'Unknown',
      price: 0,
    }
    return { ...item, qty: cart[id] }
  })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) + change
      if (qty <= 0) {
        const newCart = { ...prev }
        delete newCart[id]
        return newCart
      }
      return { ...prev, [id]: qty }
    })
  }

  const placeOrder = () => {
    if (!cartItems.length) return setToast('Add at least one item')
    setSubmitting(true)
    setTimeout(() => {
      setCart({})
      setIsCartOpen(false)
      setSubmitting(false)
      setToast('Order placed successfully')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto">
        <div className="bg-cyan-600 text-white rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin size={20} />
            <div>
              <h1 className="text-lg font-semibold">Name of Restaurant</h1>
              <p className="text-xs opacity-80">Table: {tableId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SandwichButton />
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center bg-white rounded-lg shadow flex-grow px-3 py-2">
            <Search size={18} className="opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu..."
              className="flex-grow outline-none ml-2 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs px-2 py-1 rounded hover:bg-gray-100"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setQuery('')}
            className="bg-cyan-600 text-white px-3 py-2 rounded-lg shadow-sm text-sm"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-6xl mx-auto mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-3 flex flex-col shadow"
          >
            <div className="flex-1">
              <h3 className="font-medium text-lg">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
              <p className="text-sm mt-1 font-semibold">Rs. {item.price}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus size={16} />
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
                  className="w-14 text-center outline-none p-2 text-sm"
                />
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="bg-cyan-600 text-white px-2 py-1 rounded-md text-sm"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="w-full max-w-md bg-white p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X />
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  Cart is empty
                </div>
              ) : (
                cartItems.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-600">
                        Rs. {it.price} × {it.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(it.id, -1)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="px-2">{it.qty}</div>
                      <button
                        onClick={() => updateQuantity(it.id, 1)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="font-semibold">Rs. {total}</div>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="w-full bg-cyan-600 text-white py-3 rounded-md font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
                <button
                  onClick={() => setToast('Call waiter request sent')}
                  className="w-full border py-3 rounded-md font-semibold"
                >
                  Call Waiter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50">
          <div className="bg-black text-white px-4 py-2 rounded-full shadow">
            {toast}
          </div>
        </div>
      )}

      {/* Badge */}
      {/* <div className="fixed top-6 right-6 hidden md:block">
        <div className="bg-white/90 backdrop-blur rounded-full p-2 shadow flex items-center gap-2">
          <CheckCircle />
          <div className="text-sm">Fast orders • No app needed</div>
        </div>
      </div> */}
    </div>
  )
}
