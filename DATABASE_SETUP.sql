-- Copy and paste these commands into your Supabase SQL Editor
-- Go to your Supabase dashboard → SQL Editor → New Query

-- 1. Create User Profiles Table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  bio TEXT,
  trading_style TEXT,
  experience_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create Trades Table
CREATE TABLE trades (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  futures TEXT NOT NULL,
  margin_mode TEXT NOT NULL DEFAULT 'cross',
  entry_price DECIMAL(20,8) NOT NULL,
  close_price DECIMAL(20,8) NOT NULL,
  liquidation_price DECIMAL(20,8),
  trade_direction TEXT NOT NULL DEFAULT 'long',
  leverage DECIMAL(10,2) NOT NULL DEFAULT 1,
  quantity DECIMAL(20,8) NOT NULL,
  realized_pnl DECIMAL(20,8) NOT NULL,
  open_time TIMESTAMP WITH TIME ZONE,
  close_time TIMESTAMP WITH TIME ZONE,
  is_win BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policies for trades
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Configure Authentication (Optional)
-- Go to Authentication → Settings in your Supabase dashboard
-- Set Site URL to: http://localhost:5173
-- Add to Redirect URLs: http://localhost:5173/**

