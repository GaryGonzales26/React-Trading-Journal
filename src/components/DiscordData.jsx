'use client'

import { useState } from 'react'

const DiscordData = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  // Mock Discord server data
  const serverStats = {
    totalMembers: 2547,
    onlineMembers: 892,
    activeChannels: 18,
    totalRoles: 12,
    boostLevel: 3,
    serverAge: "2 years, 3 months",
    totalMessages: 1547892,
    dailyMessages: 12456,
    weeklyGrowth: 12.5,
    monthlyGrowth: 8.3
  }

  const channelActivity = [
    { name: "general-trading", messages: 2341, members: 892, category: "Trading" },
    { name: "crypto-signals", messages: 1892, members: 567, category: "Signals" },
    { name: "technical-analysis", messages: 1456, members: 423, category: "Analysis" },
    { name: "degen-chat", messages: 1234, members: 789, category: "Community" },
    { name: "news-updates", messages: 987, members: 654, category: "News" },
    { name: "bot-commands", messages: 2345, members: 1234, category: "Bots" }
  ]

  const memberRoles = [
    { name: "Founder", count: 3, color: "from-yellow-400 to-yellow-600", icon: "👑" },
    { name: "Admin", count: 8, color: "from-red-500 to-red-700", icon: "🛡️" },
    { name: "Moderator", count: 15, color: "from-blue-500 to-blue-700", icon: "⚡" },
    { name: "Pro Trader", count: 45, color: "from-purple-500 to-purple-700", icon: "💎" },
    { name: "Verified Trader", count: 156, color: "from-green-500 to-green-700", icon: "✅" },
    { name: "Member", count: 2320, color: "from-gray-500 to-gray-700", icon: "👤" }
  ]

  const recentActivity = [
    { type: "member_joined", user: "CryptoNewbie", time: "2 minutes ago", avatar: "🆕" },
    { type: "message", user: "TradingPro", time: "5 minutes ago", avatar: "⚡", content: "Just hit a 15% profit on ETH!" },
    { type: "reaction", user: "BlockchainKing", time: "8 minutes ago", avatar: "👑", content: "Reacted to signal" },
    { type: "member_joined", user: "DeFiExplorer", time: "12 minutes ago", avatar: "🆕" },
    { type: "message", user: "AltcoinHunter", time: "15 minutes ago", avatar: "🎯", content: "Great analysis on the new token!" },
    { type: "boost", user: "Anonymous", time: "20 minutes ago", avatar: "🚀", content: "Boosted the server" }
  ]

  const getActivityIcon = (type) => {
    const icons = {
      member_joined: "🆕",
      message: "💬",
      reaction: "👍",
      boost: "🚀",
      role_update: "🎭"
    }
    return icons[type] || "📝"
  }

  const getActivityColor = (type) => {
    const colors = {
      member_joined: "text-green-400",
      message: "text-blue-400",
      reaction: "text-yellow-400",
      boost: "text-purple-400",
      role_update: "text-pink-400"
    }
    return colors[type] || "text-gray-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Discord <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Analytics</span>
        </h2>
        <p className="text-gray-400 text-lg">Real-time insights into our Discord community</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-purple-500/30">
          {['1h', '24h', '7d', '30d'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Server Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👥</div>
            <div className="text-xs text-purple-300 bg-purple-600/30 px-2 py-1 rounded-full">Live</div>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">{serverStats.onlineMembers}</div>
          <div className="text-sm text-gray-400">Online Members</div>
          <div className="text-xs text-green-400 mt-2">+{serverStats.weeklyGrowth}% this week</div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">💬</div>
            <div className="text-xs text-blue-300 bg-blue-600/30 px-2 py-1 rounded-full">Today</div>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">{serverStats.dailyMessages.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Messages Today</div>
          <div className="text-xs text-blue-400 mt-2">+{Math.round(serverStats.dailyMessages / 100)}% vs yesterday</div>
        </div>

        <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🚀</div>
            <div className="text-xs text-green-300 bg-green-600/30 px-2 py-1 rounded-full">Level {serverStats.boostLevel}</div>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">{serverStats.boostLevel}</div>
          <div className="text-sm text-gray-400">Boost Level</div>
          <div className="text-xs text-green-400 mt-2">+{serverStats.boostLevel * 2} perks unlocked</div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/20 to-pink-800/20 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
            <div className="text-xs text-pink-300 bg-pink-600/30 px-2 py-1 rounded-full">Total</div>
          </div>
          <div className="text-2xl font-bold text-pink-400 mb-1">{serverStats.totalMembers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Members</div>
          <div className="text-xs text-pink-400 mt-2">+{serverStats.monthlyGrowth}% this month</div>
        </div>
      </div>

      {/* Channel Activity and Member Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Activity */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            📊 Channel Activity
          </h3>
          <div className="space-y-3">
            {channelActivity.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-sm font-mono">
                    #{channel.name}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{channel.category}</div>
                    <div className="text-xs text-gray-400">{channel.members} members</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">{channel.messages.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">messages</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Roles */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            🎭 Member Roles
          </h3>
          <div className="space-y-3">
            {memberRoles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center text-lg`}>
                    {role.icon}
                  </div>
                  <div className="text-sm font-medium text-white">{role.name}</div>
                </div>
                <div className="text-sm text-gray-300">{role.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          🔥 Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
              <div className={`w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{activity.user}</span>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                {activity.content && (
                  <div className="text-sm text-gray-300 mt-1">{activity.content}</div>
                )}
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                {activity.avatar}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Server Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-800/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30 text-center">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-2xl font-bold text-indigo-400 mb-1">{serverStats.serverAge}</div>
          <div className="text-sm text-gray-400">Server Age</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 text-center">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-2xl font-bold text-orange-400 mb-1">{serverStats.totalMessages.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Messages</div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-600/20 to-teal-800/20 backdrop-blur-sm rounded-xl p-6 border border-teal-500/30 text-center">
          <div className="text-4xl mb-2">🔗</div>
          <div className="text-2xl font-bold text-teal-400 mb-1">{serverStats.activeChannels}</div>
          <div className="text-sm text-gray-400">Active Channels</div>
        </div>
      </div>

      {/* Join Discord CTA */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Join Our Discord Community</h3>
        <p className="text-gray-300 mb-6">Connect with 2,500+ traders, get real-time signals, and access exclusive resources</p>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3 mx-auto">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Join Discord Server</span>
        </button>
      </div>
    </div>
  )
}

export default DiscordData

