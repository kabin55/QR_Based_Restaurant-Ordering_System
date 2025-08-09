import React, { useState } from 'react'
import { Menu } from 'lucide-react'

const categories = [
  'Breakfast',
  'Lunch',
  'Fast Food',
  'Soft Drinks',
  'Hard Drinks',
]

export default function SandwichButton({ selectedCategory, onSelect }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative">
      {/* Sandwich Icon Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
      >
        <Menu size={20} />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelect(cat)
                setMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-cyan-100 ${
                selectedCategory === cat ? 'bg-cyan-200 font-semibold' : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
