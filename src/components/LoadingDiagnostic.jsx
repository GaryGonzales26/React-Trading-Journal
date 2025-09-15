'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const LoadingDiagnostic = () => {
  const { loading } = useAuth()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      // Only show loading after a short delay to avoid flash
      const timer = setTimeout(() => {
        setShowLoading(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [loading])

  // Don't show loading if tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowLoading(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-xl text-white">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading...</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Please wait while we load your data</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingDiagnostic
