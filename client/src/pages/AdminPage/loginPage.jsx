import React, { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Sending login:', { username, password, rememberMe })

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, rememberMe }),
          credentials: 'include',
        }
      )

      if (!response.ok) {
        console.error('Login failed:', response.statusText)
        alert('Login failed. Please check your credentials.')
        return
      }

      const data = await response.json()
      console.log('Login successful:', data)
      alert('Login successful: ' + data.message)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error:', error)
      alert('Login failed. Please check your credentials.')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-48 bg-indigo-600 rounded-t-full z-0"></div>

      {/* Login Box */}
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-80 p-8 pt-16 flex flex-col items-center">
        <div className="absolute -top-10 bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center shadow-md">
          <User className="text-white" size={28} />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Username input */}
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded bg-gray-50 px-3 py-2">
              <User className="text-gray-400 mr-2" size={18} />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded bg-gray-50 px-3 py-2">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-2 select-none">Remember me</span>
            </label>
            <button
              type="submit"
              className="hover:underline"
              onClick={() => alert('Forgot password clicked')}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
          >
            LOGING
          </button>

          {/* Register link */}
          <div className="text-center mt-2 text-xs text-gray-500">
            <button
              type="button"
              className="hover:underline"
              onClick={() => alert('Register clicked')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
