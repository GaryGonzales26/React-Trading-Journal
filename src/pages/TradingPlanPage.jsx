'use client'

import React from 'react';
import TradingPlan from '@/components/TradingPlan';

const TradingPlanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative w-full px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Trading Plan Tracker
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
              Master your trading strategy with comprehensive analytics, risk management, and performance tracking
            </p>
            <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center max-w-3xl mx-auto px-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base">
                <span className="text-lg sm:text-xl font-bold">📊</span>
                <span className="ml-2 font-semibold">Track Performance</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base">
                <span className="text-lg sm:text-xl font-bold">⚡</span>
                <span className="ml-2 font-semibold">Risk Management</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base">
                <span className="text-lg sm:text-xl font-bold">🎯</span>
                <span className="ml-2 font-semibold">Strategy Analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-16">
        <TradingPlan />
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Why Use Our Trading Tracker?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              Comprehensive tools designed for serious traders who want to improve their performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📈</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Performance Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                Track your win rate, analyze trade patterns, and identify your most profitable strategies
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Risk Management</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                Monitor leverage usage, track risk/reward ratios, and maintain proper position sizing
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📊</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Detailed Insights</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                Get comprehensive breakdowns of long vs short performance and leverage analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlanPage;
