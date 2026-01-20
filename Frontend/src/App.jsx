import React from 'react'
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"

const App = () => {
  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App