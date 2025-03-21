import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import MentorChat from './components/Chat'
import VideoMeeting from './components/VideoMeeting'
import EntrepreneurDashboard from './components/EntrepreneurDashboard'
// import MentorDashboard from './components/MentorDashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard userRole="professional" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entrepreneur-dashboard" 
            element={
              <ProtectedRoute>
                <EntrepreneurDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentor-chat/:mentorId" 
            element={
              <ProtectedRoute>
                <MentorChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meeting/:meetingId" 
            element={
              <ProtectedRoute>
                <VideoMeeting />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
