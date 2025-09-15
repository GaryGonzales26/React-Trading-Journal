'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

const LandingPage = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Professional Trading Journal
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Master your trading strategy with comprehensive analytics, risk management, and performance tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link
                href="/auth"
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </Link>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Trading Journal?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to track, analyze, and improve your trading performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your performance with detailed charts, win rates, and comprehensive trading statistics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Risk Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your risk exposure, position sizing, and implement proper risk management strategies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Strategy Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyze your trading patterns, identify strengths and weaknesses to improve your strategy.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your trades in real-time with live P&L updates and instant notifications.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your trading data is encrypted and secure. We never share your personal information.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mobile Responsive</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your trading journal anywhere, anytime with our fully responsive design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of successful traders who use our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1M+</div>
              <div className="text-blue-100">Trades Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of traders who are already improving their performance with our platform.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Now - It&apos;s Free!
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
