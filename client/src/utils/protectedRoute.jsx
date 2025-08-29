import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null) // null = loading, false = not auth, true = auth

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          {
            method: 'GET',
            credentials: 'include', // send cookies
          }
        )
        if (res.ok) {
          setAuth(true)
        } else {
          setAuth(false)
        }
      } catch {
        setAuth(false)
      }
    }
    checkAuth()
  }, [])

  if (auth === null) return <div>Loading...</div>
  if (auth === false) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      {children ? children : <Outlet />}
    </>
  )
}

export default ProtectedRoute
