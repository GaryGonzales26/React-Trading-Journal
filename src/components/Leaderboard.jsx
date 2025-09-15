'use client'

import { useState } from 'react'

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('weekly')
  const [category, setCategory] = useState('profit')

  // Mock data for the leaderboard
  const leaderboardData = [
    {
      id: 1,
      username: "CryptoNinja",
      avatar: "🎮",
      rank: 1,
      profit: 15420,
      winRate: 87,
      trades: 156,
      totalVolume: 1250000,
      streak: 12,
      badge: "🏆"
    },
    {
      id: 2,
      username: "TradingPro",
      avatar: "⚡",
      rank: 2,
      profit: 12850,
      winRate: 82,
      trades: 203,
      totalVolume: 980000,
      streak: 8,
      badge: "🥈"
    },
    {
      id: 3,
      username: "BlockchainKing",
      avatar: "👑",
      rank: 3,
      profit: 11200,
      winRate: 79,
      trades: 178,
      totalVolume: 875000,
      streak: 15,
      badge: "🥉"
    },
    {
      id: 4,
      username: "DeFiMaster",
      avatar: "🚀",
      rank: 4,
      profit: 9850,
      winRate: 76,
      trades: 145,
      totalVolume: 720000,
      streak: 6,
      badge: "💎"
    },
    {
      id: 5,
      username: "AltcoinHunter",
      avatar: "🎯",
      rank: 5,
      profit: 8750,
      winRate: 74,
      trades: 189,
      totalVolume: 650000,
      streak: 9,
      badge: "🔥"
    },
    {
      id: 6,
      username: "SwingTrader",
      avatar: "📈",
      rank: 6,
      profit: 7650,
      winRate: 71,
      trades: 134,
      totalVolume: 580000,
      streak: 4,
      badge: "⭐"
    },
    {
      id: 7,
      username: "ScalperX",
      avatar: "⚡",
      rank: 7,
      profit: 6800,
      winRate: 68,
      trades: 267,
      totalVolume: 520000,
      streak: 7,
      badge: "⚡"
    },
    {
      id: 8,
      username: "HODLer",
      avatar: "💎",
      rank: 8,
      profit: 5900,
      winRate: 65,
      trades: 89,
      totalVolume: 450000,
      streak: 22,
      badge: "💎"
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-amber-600 to-amber-800'
    return 'from-gray-600 to-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Trading <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Leaderboard</span>
        </h2>
        <p className="text-gray-400 text-lg">Top performers in the Trading Community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-purple-500/30">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeframe === 'daily'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeframe === 'weekly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeframe === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-blue-500/30">
          <button
            onClick={() => setCategory('profit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              category === 'profit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Profit
          </button>
          <button
            onClick={() => setCategory('winRate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              category === 'winRate'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Win Rate
          </button>
          <button
            onClick={() => setCategory('volume')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              category === 'volume'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50 border-b border-purple-500/30">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trades</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {leaderboardData.map((trader) => (
                <tr key={trader.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(trader.rank)} flex items-center justify-center text-white font-bold text-sm`}>
                        {trader.rank}
                      </div>
                      <span className="ml-2 text-2xl">{trader.badge}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-2xl mr-3">
                        {trader.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{trader.username}</div>
                        <div className="text-xs text-gray-400">ID: #{trader.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-400">{formatCurrency(trader.profit)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white mr-2">{trader.winRate}%</div>
                      <div className="w-16 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trader.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{trader.trades}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-400">{formatCurrency(trader.totalVolume)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-orange-400 mr-2">{trader.streak}</div>
                      <div className="text-xs text-gray-400">days</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400 mb-1">$67,420</div>
          <div className="text-sm text-gray-400">Total Profit</div>
        </div>
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400 mb-1">78.5%</div>
          <div className="text-sm text-gray-400">Avg Win Rate</div>
        </div>
        <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-400 mb-1">1,361</div>
          <div className="text-sm text-gray-400">Total Trades</div>
        </div>
        <div className="bg-gradient-to-r from-pink-600/20 to-pink-800/20 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30">
          <div className="text-2xl font-bold text-pink-400 mb-1">$5.9M</div>
          <div className="text-sm text-gray-400">Total Volume</div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

