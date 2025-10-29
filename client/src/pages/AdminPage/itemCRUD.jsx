import React, { useEffect, useState, useRef } from 'react'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

function Header() {
  return (
    <header className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white py-8 px-6 shadow-xl">
      <h1 className="text-4xl font-extrabold text-center tracking-tight">
        Inventory Management
      </h1>
    </header>
  )
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
      />
    </div>
  )
}

function ItemCard({ item, onEdit, onDelete }) {
  return (
    <li className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
      <div className="flex items-center gap-5">
        {item.pic ? (
          <img
            src={item.pic}
            alt={item.item}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
            No Image
          </div>
        )}
        <div>
          <p className="font-semibold text-xl text-gray-800">{item.item}</p>
          <p className="text-gray-500 text-sm">Type: {item.type}</p>
          <p className="text-gray-500 text-sm">
            Price: Rs. {item.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(item)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200 font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      {message}
    </div>
  )
}

function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium">{itemName}</span>?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ItemCRUD() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ type: '', item: '', price: '', pic: '' })
  const [editingItemId, setEditingItemId] = useState(null)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ message: '', type: '' })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)

  const formRef = useRef(null)

  const restaurantId = JSON.parse(
    localStorage.getItem('restaurantDetails')
  )?.restaurantId

  // Fetch itemList
  const fetchItems = async () => {
    if (!restaurantId) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/items/${restaurantId}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch items')
      const data = await res.json()
      setItems(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      setToast({ message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (editingItemId && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingItemId])

  useEffect(() => {
    fetchItems()
  }, [restaurantId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Add or update a single item
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.type || !form.item || !form.price) {
      setToast({ message: 'Please fill type, item, and price', type: 'error' })
      return
    }

    const payload = {
      type: form.type,
      item: form.item,
      price: Number(form.price),
      pic: form.pic,
    }

    try {
      let res
      if (editingItemId) {
        // Update single item
        res = await fetch(
          `${API_URL}/admin/items/${restaurantId}/${editingItemId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
          }
        )
      } else {
        // Add item
        res = await fetch(`${API_URL}/admin/items/${restaurantId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        })
      }
      if (!res.ok) throw new Error('Failed to save item')
      setForm({ type: '', item: '', price: '', pic: '' })
      setEditingItemId(null)
      setToast({
        message: editingItemId
          ? 'Item updated successfully'
          : 'Item added successfully',
        type: 'success',
      })
      fetchItems()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }

  const handleEdit = (item) => {
    setForm({
      type: item.type,
      item: item.item,
      price: item.price,
      pic: item.pic || '',
    })
    setEditingItemId(item._id)
  }

  const handleCancel = () => {
    setForm({ type: '', item: '', price: '', pic: '' })
    setEditingItemId(null)
  }

  const handleDelete = (itemId) => {
    setDeleteItemId(itemId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteItemId) return
    try {
      const res = await fetch(
        `${API_URL}/admin/items/${restaurantId}/${deleteItemId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('Failed to delete item')
      setToast({ message: 'Item deleted successfully', type: 'success' })
      fetchItems()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteItemId(null)
    }
  }

  return (
    <div ref={formRef} className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {editingItemId ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Drink, Food"
                required
              />
              <InputField
                label="Item Name"
                name="item"
                value={form.item}
                onChange={handleChange}
                placeholder="Item name"
                required
              />
              <InputField
                label="Price (Rs.)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
              <InputField
                label="Picture URL"
                name="pic"
                value={form.pic}
                onChange={handleChange}
                placeholder="Image URL (optional)"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition duration-200 font-semibold"
              >
                {editingItemId ? 'Update Item' : 'Add Item'}
              </button>
              {editingItemId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Items List */}
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Items List</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-600"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-600 bg-gray-100 p-4 rounded-lg text-center">
            No items found.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
              />
            ))}
          </ul>
        )}
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={items.find((i) => i._id === deleteItemId)?.item || ''}
      />
    </div>
  )
}
