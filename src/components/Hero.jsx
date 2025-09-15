import React from 'react'

const Hero = () => {
  return (
    <section id="hero" className="hero-community section-community-lg relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gaming-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading - Community Focused */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-gradient">
             Trading Community
            </span>
            <br />
            <span className="community-title">Community</span>
          </h1>

          {/* Value Proposition - Like Project One Percent */}
          <p className="text-2xl lg:text-3xl community-subtitle mb-12 leading-relaxed max-w-4xl mx-auto">
            Learn Trading. Earn Profits. Grow Together.
            <br className="hidden lg:block" />
            Join the ultimate Discord community where knowledge becomes wealth
          </p>

          {/* CTA Buttons - Community Focused */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="cta-community text-xl px-10 py-5 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-4">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join Discord</span>
            </button>

            <button 
              onClick={() => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' })}
              className="cta-community secondary text-xl px-10 py-5 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-4"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Explore Community</span>
            </button>
          </div>

          {/* Community Stats - Like Project One Percent */}
          <div className="community-grid-3 max-w-5xl mx-auto mb-16">
            <div className="stats-card">
              <div className="stats-number">2,500+</div>
              <div className="stats-label">Active Traders</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">$15M+</div>
              <div className="stats-label">Total Volume</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">24/7</div>
              <div className="stats-label">Community Support</div>
            </div>
          </div>

          {/* Community Features - Educational Focus */}
          <div className="community-grid-4 max-w-6xl mx-auto">
            <div className="feature-card text-center">
              <div className="feature-icon mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold community-title mb-2">Live Trading Signals</h3>
              <p className="community-text text-sm">Real-time alerts and market insights</p>
            </div>
            
            <div className="feature-card text-center">
              <div className="feature-icon mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold community-title mb-2">Expert Analysis</h3>
              <p className="community-text text-sm">Professional insights and strategies</p>
            </div>
            
            <div className="feature-card text-center">
              <div className="feature-icon mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold community-title mb-2">Risk Management</h3>
              <p className="community-text text-sm">Learn to protect your capital</p>
            </div>
            
            <div className="feature-card text-center">
              <div className="feature-icon mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold community-title mb-2">Community Support</h3>
              <p className="community-text text-sm">24/7 help from fellow traders</p>
            </div>
          </div>

          {/* Trust Indicators - Community Building */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Live Trading Signals</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Expert Analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium">Risk Management</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
