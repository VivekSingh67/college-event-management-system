import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import RegisterPage from './pages/Register'

const App = () => {
  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App