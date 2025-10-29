import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Toast } from './components/Toast.jsx'

import HomePage from './pages/UserPage/homePage'
import LoginForm from './pages/AdminPage/loginPage'
import ItemCRUD from './pages/AdminPage/itemCRUD'
import DetailForm from './pages/AdminPage/detailPage'
import MenuPage from './pages/UserPage/menuPage.jsx'
import AdminOrdersPage from './pages/AdminPage/orderPage'
import ProtectedRoute from './utils/protectedRoute'
import Dashboard from './components/dashboard'
import LandingPage from './pages/UserPage/landingPage'
import FormComponent from './components/formComponent'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:restaurantId" element={<HomePage />} />
        <Route path="/details" element={<DetailForm />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/new" element={<FormComponent />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DetailForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/item"
          element={
            <ProtectedRoute>
              <ItemCRUD />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
