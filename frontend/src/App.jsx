import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard userRole="professional" />} />
      </Routes>
    </Router>
  )
}

export default App
