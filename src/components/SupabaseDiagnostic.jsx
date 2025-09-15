'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const SupabaseDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    supabaseClient: false,
    connection: false,
    tables: false,
    auth: false,
    error: null
  })

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const newDiagnostics = {
      supabaseClient: false,
      connection: false,
      tables: false,
      auth: false,
      error: null
    }

    try {
      // Check if Supabase client exists
      if (supabase) {
        newDiagnostics.supabaseClient = true
        console.log('✅ Supabase client exists')

        // Test connection
        try {
          const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
          if (!error) {
            newDiagnostics.connection = true
            console.log('✅ Database connection successful')
          } else {
            console.log('❌ Database connection failed:', error)
            newDiagnostics.error = error.message
          }
        } catch (err) {
          console.log('❌ Database connection error:', err)
          newDiagnostics.error = err.message
        }

        // Check if tables exist
        try {
          const { data: profiles } = await supabase.from('user_profiles').select('*').limit(1)
          const { data: trades } = await supabase.from('trades').select('*').limit(1)
          newDiagnostics.tables = true
          console.log('✅ Tables exist')
        } catch (err) {
          console.log('❌ Tables check failed:', err)
          newDiagnostics.error = err.message
        }

        // Test auth
        try {
          const { data: { session } } = await supabase.auth.getSession()
          newDiagnostics.auth = true
          console.log('✅ Auth service working')
        } catch (err) {
          console.log('❌ Auth service error:', err)
          newDiagnostics.error = err.message
        }
      } else {
        console.log('❌ Supabase client not available')
        newDiagnostics.error = 'Supabase client not initialized'
      }
    } catch (err) {
      console.log('❌ Diagnostic error:', err)
      newDiagnostics.error = err.message
    }

    setDiagnostics(newDiagnostics)
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Supabase Diagnostic</h3>
      <div className="space-y-1 text-xs">
        <div className={`flex items-center ${diagnostics.supabaseClient ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-2">{diagnostics.supabaseClient ? '✅' : '❌'}</span>
          Supabase Client
        </div>
        <div className={`flex items-center ${diagnostics.connection ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-2">{diagnostics.connection ? '✅' : '❌'}</span>
          Database Connection
        </div>
        <div className={`flex items-center ${diagnostics.tables ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-2">{diagnostics.tables ? '✅' : '❌'}</span>
          Tables Exist
        </div>
        <div className={`flex items-center ${diagnostics.auth ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-2">{diagnostics.auth ? '✅' : '❌'}</span>
          Auth Service
        </div>
        {diagnostics.error && (
          <div className="text-red-600 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
            Error: {diagnostics.error}
          </div>
        )}
      </div>
      <button 
        onClick={runDiagnostics}
        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  )
}

export default SupabaseDiagnostic
