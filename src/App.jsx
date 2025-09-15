import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import TradingPlanPage from './pages/TradingPlanPage'
import UserProfile from './components/UserProfile'
import AuthPage from './components/auth/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import SetupPage from './components/SetupPage'
import LoadingDiagnostic from './components/LoadingDiagnostic'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

function App() {
  // Show setup page if Supabase is not configured
  if (!supabase) {
    return <SetupPage />
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <LoadingDiagnostic />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <TradingPlanPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
