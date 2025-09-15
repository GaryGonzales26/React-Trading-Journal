'use client'

import { useState } from 'react'

const NewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock news data
  const newsData = [
    {
      id: 1,
      title: "Bitcoin Surges Past $50K - Community Celebrates Major Milestone",
      excerpt: "The SPR Trading community witnessed an incredible rally as Bitcoin broke through the $50,000 resistance level. Our top traders shared their insights on the breakout pattern.",
      category: "market",
      author: "CryptoNinja",
      avatar: "🎮",
      date: "2 hours ago",
      readTime: "3 min read",
      image: "📈",
      tags: ["Bitcoin", "Breakout", "Technical Analysis"],
      reactions: 156,
      comments: 23
    },
    {
      id: 2,
      title: "New Trading Bot Integration - Automated Strategies Now Available",
      excerpt: "We've integrated advanced trading bots that follow our community's proven strategies. Members can now automate their trading with customizable risk parameters.",
      category: "community",
      author: "TradingPro",
      avatar: "⚡",
      date: "6 hours ago",
      readTime: "5 min read",
      image: "🤖",
      tags: ["Trading Bot", "Automation", "Strategy"],
      reactions: 89,
      comments: 15
    },
    {
      id: 3,
      title: "Weekly Trading Competition Results - $10K Prize Pool Distributed",
      excerpt: "Congratulations to our weekly winners! The competition saw record participation with over 500 active traders competing for the $10,000 prize pool.",
      category: "competition",
      author: "BlockchainKing",
      avatar: "👑",
      date: "1 day ago",
      readTime: "4 min read",
      image: "🏆",
      tags: ["Competition", "Prize Pool", "Winners"],
      reactions: 234,
      comments: 67
    },
    {
      id: 4,
      title: "DeFi Token Analysis - Top Picks from Our Expert Panel",
      excerpt: "Our expert panel analyzed 50+ DeFi tokens and identified the top 10 with the highest potential. Detailed analysis includes risk assessment and entry points.",
      category: "analysis",
      author: "DeFiMaster",
      avatar: "🚀",
      date: "2 days ago",
      readTime: "7 min read",
      image: "🔍",
      tags: ["DeFi", "Token Analysis", "Expert Panel"],
      reactions: 178,
      comments: 34
    },
    {
      id: 5,
      title: "Risk Management Workshop - Learn from the Pros",
      excerpt: "Join our monthly risk management workshop where professional traders share their strategies for protecting capital and maximizing returns in volatile markets.",
      category: "education",
      author: "AltcoinHunter",
      avatar: "🎯",
      date: "3 days ago",
      readTime: "6 min read",
      image: "📚",
      tags: ["Risk Management", "Workshop", "Education"],
      reactions: 145,
      comments: 28
    },
    {
      id: 6,
      title: "Community Spotlight - Member Success Stories",
      excerpt: "This week we feature three community members who turned $1,000 into $50,000+ using our trading strategies. Learn their journey and key lessons.",
      category: "community",
      author: "SwingTrader",
      avatar: "📈",
      date: "4 days ago",
      readTime: "8 min read",
      image: "🌟",
      tags: ["Success Stories", "Community", "Inspiration"],
      reactions: 267,
      comments: 89
    }
  ]

  const categories = [
    { id: 'all', name: 'All News', count: newsData.length },
    { id: 'market', name: 'Market Updates', count: newsData.filter(n => n.category === 'market').length },
    { id: 'community', name: 'Community', count: newsData.filter(n => n.category === 'community').length },
    { id: 'competition', name: 'Competitions', count: newsData.filter(n => n.category === 'competition').length },
    { id: 'analysis', name: 'Analysis', count: newsData.filter(n => n.category === 'analysis').length },
    { id: 'education', name: 'Education', count: newsData.filter(n => n.category === 'education').length }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData.filter(news => news.category === selectedCategory)

  const getCategoryColor = (category) => {
    const colors = {
      market: 'from-green-500 to-green-600',
      community: 'from-blue-500 to-blue-600',
      competition: 'from-yellow-500 to-yellow-600',
      analysis: 'from-purple-500 to-purple-600',
      education: 'from-pink-500 to-pink-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      market: '📊',
      community: '👥',
      competition: '🏆',
      analysis: '🔍',
      education: '📚'
    }
    return icons[category] || '📰'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Community <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">News</span>
        </h2>
        <p className="text-gray-400 text-lg">Stay updated with the latest from the Trading Community</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500'
            }`}
          >
            <span>{getCategoryIcon(category.id)}</span>
            <span>{category.name}</span>
            <span className="bg-gray-700/50 px-2 py-1 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <article key={news.id} className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:transform hover:-translate-y-2">
            {/* News Image */}
            <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-6xl border-b border-gray-700/50">
              {news.image}
            </div>

            {/* News Content */}
            <div className="p-6">
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(news.category)} text-white`}>
                  {getCategoryIcon(news.category)} {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                </span>
                <span className="text-xs text-gray-400">{news.readTime}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                {news.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-300 mb-4 line-clamp-3">
                {news.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {news.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author and Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                    {news.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{news.author}</div>
                    <div className="text-xs text-gray-400">{news.date}</div>
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <span>👍</span>
                    <span>{news.reactions}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{news.comments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Load More News
        </button>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
        <p className="text-gray-300 mb-6">Get the latest trading insights and community updates delivered to your inbox</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsSection

