'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-white">📊</span>
          </div>
          <p className="text-gray-600 text-lg">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return user ? children : null
}

export default ProtectedRoute
