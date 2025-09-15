import { supabase, TABLES } from '@/lib/supabase'

export const tradingService = {
  // Get all trades for the current user
  async getTrades(userId) {
    if (!supabase) {
      return { data: [], error: null }
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.TRADES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error in getTrades:', error)
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching trades:', error)
      return { data: null, error }
    }
  },

  // Get paginated trades for the current user
  async getTradesPaginated(userId, page = 1, pageSize = 10) {
    if (!supabase) {
      return { data: [], total: 0, error: null }
    }

    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Get total count
      const { count, error: countError } = await supabase
        .from(TABLES.TRADES)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (countError) {
        console.error('Database error in getTradesPaginated count:', countError)
        throw countError
      }

      // Get paginated data
      const { data, error } = await supabase
        .from(TABLES.TRADES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Database error in getTradesPaginated:', error)
        throw error
      }
      
      return { 
        data, 
        total: count || 0, 
        page, 
        pageSize, 
        totalPages: Math.ceil((count || 0) / pageSize),
        error: null 
      }
    } catch (error) {
      console.error('Error fetching paginated trades:', error)
      return { data: null, total: 0, error }
    }
  },

  // Add a new trade
  async addTrade(userId, tradeData) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const insertData = {
        user_id: userId,
        ...tradeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from(TABLES.TRADES)
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Database error in addTrade:', error)
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Error adding trade:', error)
      return { data: null, error }
    }
  },

  // Update an existing trade
  async updateTrade(tradeId, userId, tradeData) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      console.log('Updating trade:', { tradeId, userId, tradeData })
      
      const { data, error } = await supabase
        .from(TABLES.TRADES)
        .update({
          ...tradeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Database error in updateTrade:', error)
        throw error
      }
      
      console.log('Trade updated successfully:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating trade:', error)
      return { data: null, error }
    }
  },

  // Delete a trade
  async deleteTrade(tradeId, userId) {
    if (!supabase) {
      return { error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const { error } = await supabase
        .from(TABLES.TRADES)
        .delete()
        .eq('id', tradeId)
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting trade:', error)
      return { error }
    }
  },

  // Clear all trades for a user
  async clearAllTrades(userId) {
    if (!supabase) {
      return { error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const { error } = await supabase
        .from(TABLES.TRADES)
        .delete()
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error clearing trades:', error)
      return { error }
    }
  },

  // Migrate trades from localStorage to database
  async migrateTradesFromLocalStorage(userId) {
    try {
      const localTrades = localStorage.getItem('tradingTrades')
      if (!localTrades) return { data: [], error: null }

      const trades = JSON.parse(localTrades)
      if (!Array.isArray(trades) || trades.length === 0) {
        return { data: [], error: null }
      }

      // Check if trades are already migrated
      const { data: existingTrades } = await this.getTrades(userId)
      if (existingTrades && existingTrades.length > 0) {
        // Clear localStorage after successful migration
        localStorage.removeItem('tradingTrades')
        return { data: existingTrades, error: null }
      }

      // Migrate trades to database
      const migratedTrades = []
      for (const trade of trades) {
        const { data, error } = await this.addTrade(userId, {
          futures: trade.futures,
          margin_mode: trade.marginMode,
          entry_price: trade.entryPrice,
          close_price: trade.closePrice,
          liquidation_price: trade.liquidationPrice,
          trade_direction: trade.tradeDirection,
          leverage: trade.leverage,
          quantity: trade.quantity,
          realized_pnl: trade.realizedPnl,
          open_time: trade.openTime,
          close_time: trade.closeTime,
          is_win: trade.isWin,
          timestamp: trade.timestamp
        })

        if (error) {
          console.error('Error migrating trade:', error)
          continue
        }

        migratedTrades.push(data)
      }

      // Clear localStorage after successful migration
      if (migratedTrades.length > 0) {
        localStorage.removeItem('tradingTrades')
      }

      return { data: migratedTrades, error: null }
    } catch (error) {
      console.error('Error migrating trades:', error)
      return { data: null, error }
    }
  }
}
