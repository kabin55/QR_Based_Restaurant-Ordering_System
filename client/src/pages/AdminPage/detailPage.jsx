import { useState, useEffect } from 'react'
import {
  Store,
  MapPin,
  FileText,
  Image as ImageIcon,
  Send,
  RotateCcw,
} from 'lucide-react'

export default function DetailForm() {
  const [restaurant, setRestaurant] = useState({
    restaurantId: '',
    restaurantName: '',
    address: '',
    description: '',
    image: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Load from localStorage only
  useEffect(() => {
    const storedData = localStorage.getItem('restaurantDetails')
    if (storedData) {
      setRestaurant(JSON.parse(storedData))
    }
  }, [])

  const validateField = (name, value) => {
    if ((name === 'restaurantName' || name === 'address') && !value.trim()) {
      return 'This field is required.'
    }
    return ''
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setRestaurant((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRestaurant((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate all fields before submission
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/details/${
          restaurant.restaurantId
        }`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantName: restaurant.restaurantName,
            address: restaurant.address,
            description: restaurant.description,
            image: restaurant.image,
          }),
          credentials: 'include',
        }
      )
      // console.log(`restaurantName: ${restaurant.restaurantName},
      //       address:${restaurant.address},
      //       description: ${restaurant.description},
      //       image: ${restaurant.image}`)
      if (!response.ok) {
        throw new Error('Failed to update data')
      }

      alert('Restaurant updated successfully!')
    } catch (error) {
      console.error(error)
      setSubmitError('Error while updating restaurant')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    const storedData = localStorage.getItem('restaurantDetails')
    if (storedData) {
      setRestaurant(JSON.parse(storedData))
    }
    setErrors({})
    setSubmitError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600" />
            Update Restaurant Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Restaurant ID (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Store className="h-4 w-4 text-indigo-600" />
                Restaurant ID
              </label>
              <input
                name="restaurantId"
                type="text"
                value={restaurant.restaurantId}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Store className="h-4 w-4 text-indigo-600" />
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                name="restaurantName"
                type="text"
                value={restaurant.restaurantName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                  errors.restaurantName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter restaurant name"
              />
              {errors.restaurantName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.restaurantName}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 text-indigo-600" />
                Address <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                type="text"
                value={restaurant.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="h-4 w-4 text-indigo-600" />
                Description
              </label>
              <textarea
                name="description"
                value={restaurant.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter description (optional)"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <ImageIcon className="h-4 w-4 text-indigo-600" />
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up md:animate-delay-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Preview
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Restaurant ID
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {restaurant.restaurantId || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Restaurant Name
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {restaurant.restaurantName || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Address</h3>
              <p className="text-lg font-semibold text-gray-800">
                {restaurant.address || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Description</h3>
              <p className="text-lg font-semibold text-gray-800">
                {restaurant.description || 'No description provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Image</h3>
              {restaurant.image ? (
                <img
                  src={restaurant.image}
                  alt="Restaurant preview"
                  className="w-full h-48 object-cover rounded-lg mt-2"
                  onError={(e) =>
                    (e.target.src =
                      'https://via.placeholder.com/300x200?text=No+Image')
                  }
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 mt-2">
                  No image provided
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
