'use client'

import React, { useState } from 'react'

const SetupGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "1. Create Supabase Project",
      content: (
        <div className="space-y-2">
          <p>• Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></p>
          <p>• Click &quot;New Project&quot;</p>
          <p>• Enter project name: &quot;Trading Journal&quot;</p>
          <p>• Set a strong database password</p>
          <p>• Choose a region close to you</p>
          <p>• Click &quot;Create new project&quot;</p>
        </div>
      )
    },
    {
      title: "2. Get Your Credentials",
      content: (
        <div className="space-y-2">
          <p>• Go to Settings → API in your Supabase dashboard</p>
          <p>• Copy your <strong>Project URL</strong> (looks like: https://xxxxx.supabase.co)</p>
          <p>• Copy your <strong>anon public key</strong> (long string starting with eyJ...)</p>
        </div>
      )
    },
    {
      title: "3. Set Up Database Tables",
      content: (
        <div className="space-y-2">
          <p>• Go to SQL Editor in your Supabase dashboard</p>
          <p>• Click &quot;New Query&quot;</p>
          <p>• Copy and paste the contents of <code className="bg-gray-100 px-1 rounded">CLEAN_EVERYTHING.sql</code></p>
          <p>• Click &quot;Run&quot; to execute</p>
          <p>• Then copy and paste the contents of <code className="bg-gray-100 px-1 rounded">DATABASE_SETUP.sql</code></p>
          <p>• Click &quot;Run&quot; to execute</p>
        </div>
      )
    },
    {
      title: "4. Configure Vercel Environment Variables",
      content: (
        <div className="space-y-2">
          <p>• Go to your Vercel dashboard</p>
          <p>• Select your Trading Journal project</p>
          <p>• Go to Settings → Environment Variables</p>
          <p>• Add: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> = your project URL</p>
          <p>• Add: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> = your anon key</p>
          <p>• Click &quot;Save&quot; for each variable</p>
        </div>
      )
    },
    {
      title: "5. Redeploy Your App",
      content: (
        <div className="space-y-2">
          <p>• Go to Deployments in Vercel</p>
          <p>• Click &quot;Redeploy&quot; on your latest deployment</p>
          <p>• Wait for deployment to complete</p>
          <p>• Refresh this page and try logging in again</p>
        </div>
      )
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Database Setup Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {steps[currentStep].title}
            </h3>
            <div className="text-gray-600 dark:text-gray-300">
              {steps[currentStep].content}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              {currentStep === steps.length - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupGuide
