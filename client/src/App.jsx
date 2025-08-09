import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MenuPage from './pages/menuPage.jsx'
import HomePage from './pages/homePage.jsx'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}

export default App
