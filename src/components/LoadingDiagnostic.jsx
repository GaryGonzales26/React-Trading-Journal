'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

const LoadingDiagnostic = () => {
  const { loading } = useAuth()

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-white">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h3>
          <p className="text-gray-600">Please wait while we load your data</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingDiagnostic
