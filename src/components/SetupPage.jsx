import React from 'react'

const SetupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">⚙️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Setup Required</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your trading journal is ready, but you need to configure the database to enable user accounts and online data storage.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">🚀 Quick Setup (5 minutes)</h2>
                     <ol className="list-decimal list-inside space-y-2 text-blue-800">
             <li>Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">supabase.com</a></li>
             <li>Create a new project</li>
             <li>Get your Project URL and API key from Settings → API</li>
             <li>Update credentials in <code className="bg-blue-100 px-2 py-1 rounded">src/lib/supabase.js</code> or create a <code className="bg-blue-100 px-2 py-1 rounded">.env</code> file</li>
             <li>Run the SQL commands to create database tables</li>
           </ol>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">✅ What&apos;s Already Done</h3>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>User authentication system</li>
              <li>User profile management</li>
              <li>Protected routes and security</li>
              <li>Database integration code</li>
              <li>Data migration from localStorage</li>
              <li>Modern UI with user management</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">📚 Setup Guides</h3>
            <div className="space-y-2 text-purple-800">
              <p>📖 <strong>Quick Start:</strong> Check <code className="bg-purple-100 px-2 py-1 rounded">QUICK_START.md</code></p>
              <p>📖 <strong>Detailed Guide:</strong> Check <code className="bg-purple-100 px-2 py-1 rounded">SUPABASE_SETUP.md</code></p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Current Status</h3>
            <p className="text-yellow-800">
              Your app is running in <strong>local mode</strong> - all data is stored in your browser&apos;s localStorage. 
              Once you set up Supabase, your data will automatically migrate to the cloud and you&apos;ll have user accounts!
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">🚀</span>
            Start Supabase Setup
          </a>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
