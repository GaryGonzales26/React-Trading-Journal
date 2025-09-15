'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { tradingService } from '@/services/tradingService';

// Lightweight date helpers to avoid external deps
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const toDateKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const formatMonthYear = (date) => date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
const formatMMDD = (key) => {
  const [y, m, d] = key.split('-');
  return `${m}/${d}`;
};
const formatPretty = (key) => {
  const [y, m, d] = key.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
const getMonthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getMonthEnd = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const eachDayOfInterval = ({ start, end }) => {
  const days = [];
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (d <= end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
};
const isSameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const addMonths = (date, delta) => new Date(date.getFullYear(), date.getMonth() + delta, 1);

const TradingPlan = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrade, setEditingTrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTrades, setTotalTrades] = useState(0);
  const [formData, setFormData] = useState({
    futures: '',
    marginMode: 'cross',
    entryPrice: '',
    closePrice: '',
    liquidationPrice: '',
    tradeDirection: 'long',
    leverage: '',
    quantity: '',
    realizedPnl: '',
    openTime: '',
    closeTime: ''
  });

  // Remove the timeout - let database queries complete naturally

  const loadTrades = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load paginated trades from database
      const result = await tradingService.getTradesPaginated(user.id, currentPage, 10);
      
      if (result.error) {
        console.error('Error loading trades from database:', result.error);
        
        // Fallback to localStorage if database fails
        const localTrades = localStorage.getItem('tradingTrades');
        if (localTrades) {
          const parsedTrades = JSON.parse(localTrades);
          // Simple pagination for localStorage
          const startIndex = (currentPage - 1) * 10;
          const endIndex = startIndex + 10;
          const paginatedTrades = parsedTrades.slice(startIndex, endIndex);
          setTrades(paginatedTrades);
          setTotalTrades(parsedTrades.length);
          setTotalPages(Math.ceil(parsedTrades.length / 10));
        } else {
          setTrades([]);
          setTotalTrades(0);
          setTotalPages(1);
        }
      } else {
        // Transform database format to component format
        const transformedTrades = result.data.map(trade => ({
          id: trade.id,
          futures: trade.futures,
          marginMode: trade.margin_mode,
          entryPrice: trade.entry_price,
          closePrice: trade.close_price,
          liquidationPrice: trade.liquidation_price,
          tradeDirection: trade.trade_direction,
          leverage: trade.leverage,
          quantity: trade.quantity,
          realizedPnl: trade.realized_pnl,
          openTime: trade.open_time,
          closeTime: trade.close_time,
          isWin: trade.is_win,
          timestamp: new Date(trade.created_at).getTime()
        }));
        
        setTrades(transformedTrades);
        setTotalTrades(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error loading trades:', error);
      setTrades([]);
      setTotalTrades(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [user, currentPage]);

  // Load trades from database on component mount
  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user, loadTrades]);

  // Load trades when page changes
  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [currentPage, user, loadTrades]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!formData.futures || !formData.entryPrice || !formData.closePrice || !formData.leverage || !formData.quantity || !formData.realizedPnl) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date();
    const openTime = formData.openTime || now.toISOString().slice(0, 19).replace('T', ' ');
    const closeTime = formData.closeTime || now.toISOString().slice(0, 19).replace('T', ' ');

    const tradeData = {
      futures: formData.futures.toUpperCase(),
      margin_mode: formData.marginMode,
      entry_price: parseFloat(formData.entryPrice),
      close_price: parseFloat(formData.closePrice),
      liquidation_price: formData.liquidationPrice ? parseFloat(formData.liquidationPrice) : null,
      trade_direction: formData.tradeDirection,
      leverage: parseFloat(formData.leverage) || 1,
      quantity: parseFloat(formData.quantity),
      realized_pnl: parseFloat(formData.realizedPnl),
      open_time: openTime,
      close_time: closeTime,
      is_win: parseFloat(formData.realizedPnl) >= 0
    };

    console.log('Trade data to submit:', tradeData);

    try {
      if (editingTrade) {
        console.log('Updating existing trade:', editingTrade.id);
        // Update existing trade
        const { data, error } = await tradingService.updateTrade(editingTrade.id, user.id, tradeData);
        
        if (error) {
          console.error('Error updating trade:', error);
          alert('Error updating trade: ' + error.message);
          return;
        }

        console.log('Trade updated successfully:', data);
        // Reload trades to get updated data from database
        await loadTrades();
        setEditingTrade(null);
      } else {
        // Add new trade
        const { data, error } = await tradingService.addTrade(user.id, tradeData);
        
        if (error) {
          console.error('Error adding trade to database:', error);
          
          // Fallback to localStorage if database fails
          const newTrade = {
            id: Date.now().toString(), // Generate a simple ID
            futures: tradeData.futures,
            marginMode: tradeData.margin_mode,
            entryPrice: tradeData.entry_price,
            closePrice: tradeData.close_price,
            liquidationPrice: tradeData.liquidation_price,
            tradeDirection: tradeData.trade_direction,
            leverage: tradeData.leverage,
            quantity: tradeData.quantity,
            realizedPnl: tradeData.realized_pnl,
            openTime: tradeData.open_time,
            closeTime: tradeData.close_time,
            isWin: tradeData.is_win,
            timestamp: Date.now()
          };
          
          // Save to localStorage
          const existingTrades = JSON.parse(localStorage.getItem('tradingTrades') || '[]');
          existingTrades.unshift(newTrade);
          localStorage.setItem('tradingTrades', JSON.stringify(existingTrades));
          
          setTrades(prev => [newTrade, ...prev]);
          
          alert('Trade saved locally (database unavailable). Data will sync when connection is restored.');
        } else {
          // Reload trades to get updated data from database
          setCurrentPage(1); // Go to first page to see the new trade
          await loadTrades();
        }
      }
      
      // Reset form
      setFormData({
        futures: '',
        marginMode: 'cross',
        entryPrice: '',
        closePrice: '',
        liquidationPrice: '',
        tradeDirection: 'long',
        leverage: '',
        quantity: '',
        realizedPnl: '',
        openTime: '',
        closeTime: ''
      });
    } catch (error) {
      console.error('Error saving trade:', error);
      alert('Error saving trade. Please try again.');
    }
  };

  const editTrade = (trade) => {
    setEditingTrade(trade);
    setFormData({
      futures: trade.futures,
      marginMode: trade.marginMode,
      entryPrice: trade.entryPrice.toString(),
      closePrice: trade.closePrice.toString(),
      liquidationPrice: trade.liquidationPrice ? trade.liquidationPrice.toString() : '',
      tradeDirection: trade.tradeDirection,
      leverage: trade.leverage.toString(),
      quantity: trade.quantity.toString(),
      realizedPnl: trade.realizedPnl.toString(),
      openTime: trade.openTime,
      closeTime: trade.closeTime
    });
    
    // Scroll to form
    document.getElementById('trade-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingTrade(null);
    setFormData({
      futures: '',
      marginMode: 'cross',
      entryPrice: '',
      closePrice: '',
      liquidationPrice: '',
      tradeDirection: 'long',
      leverage: '',
      quantity: '',
      realizedPnl: '',
      openTime: '',
      closeTime: ''
    });
  };

  const deleteTrade = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        const { error } = await tradingService.deleteTrade(id, user.id);
        
        if (error) {
          alert('Error deleting trade: ' + error.message);
          return;
        }

        // Reload trades to get updated data from database
        await loadTrades();
      } catch (error) {
        console.error('Error deleting trade:', error);
        alert('Error deleting trade. Please try again.');
      }
    }
  };

  const clearAllTrades = async () => {
    if (window.confirm('Are you sure you want to clear all trades? This cannot be undone.')) {
      try {
        const { error } = await tradingService.clearAllTrades(user.id);
        
        if (error) {
          alert('Error clearing trades: ' + error.message);
          return;
        }

        setTrades([]);
      } catch (error) {
        console.error('Error clearing trades:', error);
        alert('Error clearing trades. Please try again.');
      }
    }
  };

  // Calculate statistics for current page
  const currentPageTradesCount = trades.length;
  const currentPageWinningTrades = trades.filter(trade => trade.isWin).length;
  const currentPageLosingTrades = trades.filter(trade => !trade.isWin).length;
  
  // Note: Win rate calculation should ideally be based on all trades, not just current page
  // For now, we'll calculate based on current page, but this could be improved with a separate API call
  const winRate = currentPageTradesCount > 0 ? ((currentPageWinningTrades / currentPageTradesCount) * 100).toFixed(2) : 0;
  
  const totalRealizedPnl = trades.reduce((sum, trade) => sum + (trade.realizedPnl || 0), 0);
  const totalVolume = trades.reduce((sum, trade) => sum + ((trade.entryPrice || 0) * (trade.quantity || 0)), 0);
  const avgLeverage = trades.length > 0 ? (trades.reduce((sum, trade) => sum + (trade.leverage || 0), 0) / trades.length).toFixed(1) : 0;

  // Derived time-series data for charts and calendar
  const startingEquity = 100; // Default baseline equity
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dailyMap = trades.reduce((map, trade) => {
    const dateKey = (() => {
      if (trade.closeTime) {
        try {
          const parsed = new Date(trade.closeTime.replace(' ', 'T'));
          if (!isNaN(parsed)) return toDateKey(parsed);
        } catch (_) {
          // Fallback to timestamp if parsing fails
        }
      }
      return toDateKey(new Date(trade.timestamp || Date.now()));
    })();
    const current = map.get(dateKey) || 0;
    map.set(dateKey, current + (trade.realizedPnl || 0));
    return map;
  }, new Map());

  // Build sorted array of dates covering the span of available data (fallback to current month when empty)
  let dateKeys = Array.from(dailyMap.keys()).sort();
  if (dateKeys.length === 0) {
    const days = eachDayOfInterval({ start: getMonthStart(currentMonth), end: getMonthEnd(currentMonth) });
    dateKeys = days.map(d => toDateKey(d));
  }

  const series = [];
  let cumulative = 0;
  dateKeys.forEach(key => {
    const daily = dailyMap.get(key) || 0;
    cumulative += daily;
    series.push({
      date: key,
      dailyPnl: Number(daily.toFixed(4)),
      cumulativePnl: Number(cumulative.toFixed(4)),
      equity: Number((startingEquity + cumulative).toFixed(4))
    });
  });

  // Calendar heatmap data for the selected month
  const today = new Date();
  const start = getMonthStart(currentMonth);
  const end = getMonthEnd(currentMonth);
  const calendarDays = eachDayOfInterval({ start, end }).map(d => {
    const key = toDateKey(d);
    const value = dailyMap.get(key) || 0;
    return { date: d, key, value };
  });

  const getHeatColor = (value) => {
    if (value === 0) return 'bg-gray-200';
    if (value > 0) {
      if (value > 50) return 'bg-green-700';
      if (value > 20) return 'bg-green-600';
      if (value > 10) return 'bg-green-500';
      if (value > 5) return 'bg-green-400';
      return 'bg-green-300';
    }
    const abs = Math.abs(value);
    if (abs > 50) return 'bg-red-700';
    if (abs > 20) return 'bg-red-600';
    if (abs > 10) return 'bg-red-500';
    if (abs > 5) return 'bg-red-400';
    return 'bg-red-300';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-white">📊</span>
          </div>
          <p className="text-gray-600 text-lg">Loading your trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm lg:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Total Trades</h3>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold">{totalTrades}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl opacity-80">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm lg:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Win Rate</h3>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold">{winRate}%</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl opacity-80">🎯</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm lg:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Total Volume</h3>
              <p className="text-lg sm:text-xl lg:text-4xl font-bold">${totalVolume.toFixed(2)}</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl opacity-80">💰</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm lg:text-lg font-semibold mb-1 sm:mb-2 opacity-90">Realized PNL</h3>
              <p className={`text-lg sm:text-xl lg:text-4xl font-bold ${totalRealizedPnl >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
              </p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl opacity-80">📈</div>
          </div>
        </div>
      </div>

      {/* Enhanced Add/Edit Trade Form */}
      <div id="trade-form" className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {editingTrade ? 'Edit Trade' : 'Add New Trade'}
          </h3>
          <p className="text-gray-600">
            {editingTrade ? 'Update your trade details' : 'Track your trading performance with detailed analytics'}
          </p>
          {editingTrade && (
            <div className="mt-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Editing: {editingTrade.futures} Perpetual
              </span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <label htmlFor="futures" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Futures Contract
              </label>
              <input
                type="text"
                id="futures"
                name="futures"
                value={formData.futures}
                onChange={handleInputChange}
                placeholder="e.g., BTCUSDT, ETHUSDT"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="marginMode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Margin Mode
              </label>
              <select
                id="marginMode"
                name="marginMode"
                value={formData.marginMode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                required
              >
                <option value="cross">Cross</option>
                <option value="isolated">Isolated</option>
              </select>
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="tradeDirection" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Direction
              </label>
              <select
                id="tradeDirection"
                name="tradeDirection"
                value={formData.tradeDirection}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="leverage" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Leverage
              </label>
              <input
                type="number"
                id="leverage"
                name="leverage"
                value={formData.leverage}
                onChange={handleInputChange}
                placeholder="1x"
                step="0.1"
                min="0.1"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <label htmlFor="entryPrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Entry Price
              </label>
              <input
                type="number"
                id="entryPrice"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.00001"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="closePrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Close Price
              </label>
              <input
                type="number"
                id="closePrice"
                name="closePrice"
                value={formData.closePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.00001"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.00001"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="realizedPnl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Realized PNL (USDT)
              </label>
              <input
                type="number"
                id="realizedPnl"
                name="realizedPnl"
                value={formData.realizedPnl}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Use negative values for losses
              </p>
            </div>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <label htmlFor="liquidationPrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Liquidation Price (Optional)
              </label>
              <input
                type="number"
                id="liquidationPrice"
                name="liquidationPrice"
                value={formData.liquidationPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.00001"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="openTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Open Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="openTime"
                name="openTime"
                value={formData.openTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label htmlFor="closeTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Close Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="closeTime"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
              />
            </div>
          </div> */}
          
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              {editingTrade ? '💾 Update Trade' : '✨ Add Trade'}
            </button>
            {editingTrade && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Professional Futures Trading Table */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h3 className="text-2xl font-bold text-white">Closed Positions</h3>
          {trades.length > 0 && (
            <button
              onClick={clearAllTrades}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
        
        {trades.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-xl">No trades yet. Add your first trade above!</p>
            <p className="text-gray-500 text-sm mt-2">Start tracking your trading performance</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Futures
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Open Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Close Time
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Margin Mode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Avg Entry Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Avg Close Price
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Liquidation Price
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Closing Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Realized PNL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-800 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {trade.futures} Perpetual
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.openTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.closeTime}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.marginMode === 'cross' ? 'Cross' : 'Isolated'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.entryPrice.toFixed(5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.closePrice.toFixed(5)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.liquidationPrice ? trade.liquidationPrice.toFixed(5) : '--'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        trade.tradeDirection === 'long' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.tradeDirection === 'long' ? 'Long' : 'Short'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.quantity.toFixed(2)} {trade.futures.replace('USDT', '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${
                          trade.realizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.realizedPnl >= 0 ? '+' : ''}{trade.realizedPnl.toFixed(4)} USDT
                        </span>
                        <span className="text-xs text-gray-500">
                          ≈ {trade.realizedPnl >= 0 ? '+' : ''}${trade.realizedPnl.toFixed(2)} USD
                        </span>
                      </div>
                    </td> 
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editTrade(trade)}
                          className="text-blue-400 hover:text-blue-300 font-semibold hover:bg-blue-900/20 px-3 py-1 rounded-lg transition-all duration-200"
                        >
                          ✏️ 
                        </button>
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          className="text-red-400 hover:text-red-300 font-semibold hover:bg-red-900/20 px-3 py-1 rounded-lg transition-all duration-200"
                        >
                          🗑️ 
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalTrades > 10 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalTrades)} of {totalTrades} trades
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Charts and Calendar */}
      {series.length > 0 && (
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Cumulative PNL */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cumulative PNL</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => formatMMDD(d)} />
                  <YAxis />
                  <Tooltip labelFormatter={(d) => formatPretty(d)} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulativePnl" name="Cumulative PNL (USDT)" stroke="#fb923c" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Equity Trend */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Equity Trend</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => formatMMDD(d)} />
                  <YAxis />
                  <Tooltip labelFormatter={(d) => formatPretty(d)} />
                  <Legend />
                  <Line type="monotone" dataKey="equity" name="Equity (USDT)" stroke="#60a5fa" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily PNL Calendar Heatmap (spans both columns on large) */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900">Daily PNL Calendar</h4>
              <div className="flex items-center space-x-2">
                <button
                  aria-label="Previous month"
                  onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  ◀
                </button>
                <span className="text-sm text-gray-700 font-semibold min-w-[140px] text-center">{formatMonthYear(currentMonth)}</span>
                <button
                  aria-label="Next month"
                  onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-3 text-xs">
              <span className="text-gray-500">Legend:</span>
              <div className="flex items-center space-x-1"><span className="w-4 h-4 bg-green-700 rounded"/> <span>High gain</span></div>
              <div className="flex items-center space-x-1"><span className="w-4 h-4 bg-green-300 rounded"/> <span>Low gain</span></div>
              <div className="flex items-center space-x-1"><span className="w-4 h-4 bg-gray-200 rounded"/> <span>Zero</span></div>
              <div className="flex items-center space-x-1"><span className="w-4 h-4 bg-red-300 rounded"/> <span>Low loss</span></div>
              <div className="flex items-center space-x-1"><span className="w-4 h-4 bg-red-700 rounded"/> <span>High loss</span></div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-center text-xs text-gray-500">{d}</div>
              ))}
              {/* Leading blanks for first week */}
              {(() => {
                const blanks = Array.from({ length: start.getDay() });
                return blanks.map((_, i) => <div key={`blank-${i}`} />);
              })()}
              {calendarDays.map(day => (
                <div key={day.key} className="flex flex-col items-center">
                  <div
                    title={`${formatPretty(day.key)}: ${day.value >= 0 ? '+' : ''}${day.value.toFixed(2)} USDT`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold text-white ${getHeatColor(day.value)} ${toDateKey(today) === day.key ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    {isSameMonth(day.date, currentMonth) ? day.date.getDate() : ''}
                  </div>
                  <div className="text-[10px] mt-1 text-gray-500">{day.value === 0 ? '0' : (day.value > 0 ? '+' : '') + day.value.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Detailed Statistics */}
      {trades.length > 0 && (
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-200 dark:border-blue-700">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Win/Loss Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Winning Trades:</span>
                <span className="font-bold text-green-600">{currentPageWinningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Losing Trades:</span>
                <span className="font-bold text-red-600">{currentPageLosingTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Win Rate:</span>
                <span className="font-bold text-blue-600">{winRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">💰</span>
              Financial Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Volume:</span>
                <span className="font-bold">${totalVolume.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Realized PNL:</span>
                <span className={`font-bold ${
                  totalRealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Leverage:</span>
                <span className="font-bold text-purple-600">{avgLeverage}x</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              Trade Direction
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Long Trades:</span>
                <span className="font-bold text-blue-600">{trades.filter(trade => trade.tradeDirection === 'long').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Short Trades:</span>
                <span className="font-bold text-orange-600">{trades.filter(trade => trade.tradeDirection === 'short').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Long Win Rate:</span>
                <span className="font-bold text-blue-600">
                  {(() => {
                    const longTrades = trades.filter(trade => trade.tradeDirection === 'long');
                    const longWins = longTrades.filter(trade => trade.isWin).length;
                    return longTrades.length > 0 ? ((longWins / longTrades.length) * 100).toFixed(1) : 0;
                  })()}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              Leverage Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Leverage:</span>
                <span className="font-bold text-purple-600">{avgLeverage}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Leverage:</span>
                <span className="font-bold text-purple-600">
                  {Math.max(...trades.map(trade => trade.leverage || 0))}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Leverage:</span>
                <span className="font-bold text-purple-600">
                  {trades.filter(trade => (trade.leverage || 0) > 5).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-indigo-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Margin Mode Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cross Margin:</span>
                <span className="font-bold text-indigo-600">
                  {trades.filter(trade => trade.marginMode === 'cross').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Isolated Margin:</span>
                <span className="font-bold text-indigo-600">
                  {trades.filter(trade => trade.marginMode === 'isolated').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cross Win Rate:</span>
                <span className="font-bold text-indigo-600">
                  {(() => {
                    const crossTrades = trades.filter(trade => trade.marginMode === 'cross');
                    const crossWins = crossTrades.filter(trade => trade.isWin).length;
                    return crossTrades.length > 0 ? ((crossWins / crossTrades.length) * 100).toFixed(1) : 0;
                  })()}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingPlan;
