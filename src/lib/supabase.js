import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
// You'll get these from https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xamgwfmeegluuhagkzen.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWd3Zm1lZWdsdXVoYWdremVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjU1NjAsImV4cCI6MjA3MjQ0MTU2MH0.WrYkU0LXDdUcFAZ3Gr8WxfXpARFsezCzHVZ9g36UFV8'

// Only create the client if we have valid credentials
let supabase = null

if (supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'YOUR_SUPABASE_URL' && 
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    supabase = null
  }
}

export { supabase }

// Database table schemas (you'll create these in Supabase)
export const TABLES = {
  TRADES: 'trades',
  USER_PROFILES: 'user_profiles'
}
    