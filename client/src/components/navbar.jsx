import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const restaurantData = JSON.parse(localStorage.getItem('restaurantDetails'))
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Item', path: '/item', icon: '📦' },
    { name: 'Orders', path: '/orders', icon: '📋' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  const handlelogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      await fetch(`${backendUrl}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      localStorage.removeItem('restaurantDetails')
      document.cookie = 'token=; Max-Age=0; path=/;'
      alert('Logged out successfully')
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed', err)
      alert('Logout failed')
    }
  }

  const handleOpenPopup = () => {
    const popup = window.open(
      '', // Can also put a URL if you have a separate page
      'ChangeUsernamePassword',
      'width=400,height=400,scrollbars=yes,resizable=no'
    )
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const restaurantData = JSON.parse(localStorage.getItem('restaurantDetails'))
    const restaurantId = restaurantData?.restaurantId
    // console.log(restaurantId)
    if (popup) {
      popup.document.write(`
<html>
  <head>
    <title>Change Username & Password</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; }
      .container { max-width: 400px; margin: auto; background: #189ec6ff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      h2 { text-align: center; font-size: 24px; margin-bottom: 20px; color: #1f2937; }
      label { display: block; margin-top: 10px; font-size: 14px; font-weight: 500; color: #374151; }
      input { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #d1d5db; border-radius: 4px; }
      button { padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer; margin-top: 20px; }
      .btn-cancel { background: #e5e7eb; color: #374151; margin-right: 10px; }
      .btn-update { background: #4f46e5; color: #fff; }
      .error { color: red; font-size: 12px; margin-top: 5px; }
      .flex { display: flex; justify-content: flex-end; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Change Username & Password</h2>
      <form id="changeForm">
        <label for="username">New Username</label>
        <input type="text" id="username" required />

        <label for="password">New Password</label>
        <input type="password" id="password" required />

        <p id="error" class="error" style="display:none;"></p>

        <div class="flex">
          <button type="button" class="btn-cancel" id="cancelBtn">Cancel</button>
          <button type="submit" class="btn-update" id="updateBtn">Update</button>
        </div>
      </form>
    </div>

    <script>
      const form = document.getElementById('changeForm');
      const cancelBtn = document.getElementById('cancelBtn');
      const errorEl = document.getElementById('error');

      cancelBtn.addEventListener('click', () => window.close());

      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
          const response = await fetch("${backendUrl}/admin/details/${restaurantId}", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
          });

          if (response.ok) {
            alert('Username & password updated successfully');
            window.close();
          } else {
            const data = await response.json();
            errorEl.style.display = 'block';
            errorEl.textContent = data.message || 'Failed to update credentials';
          }
        } catch (err) {
          console.error(err);
          errorEl.style.display = 'block';
          errorEl.textContent = 'Error updating credentials';
        }
      });
    </script>
  </body>
</html>
  `)

      popup.document.close()
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CH</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Cafe Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    isActiveLink(item.path)
                      ? 'bg-cyan-100 text-cyan-700 border-b-2 border-cyan-500'
                      : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handlelogout}
                className="px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-500/50"
              >
                logout
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <button
                  onClick={handleOpenPopup}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  isActiveLink(item.path)
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile user section */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">A</span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    Admin ${restaurantData?.restaurantName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    admin@example.com
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  Profile
                </button>
                <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
