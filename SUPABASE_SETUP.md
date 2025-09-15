# Supabase Setup Instructions

## 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up for a free account
3. Create a new project

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Update your configuration using one of these methods:

### Method A: Direct Configuration
Edit `src/lib/supabase.js` and replace:
```javascript
const supabaseUrl = 'YOUR_PROJECT_URL_HERE'
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'
```

### Method B: Environment Variables (Recommended)
1. Create a `.env` file in your project root
2. Add your credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Restart your development server: `npm run dev`

## 3. Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run these commands:

### Create User Profiles Table
```sql
-- Create user_profiles table
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

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Trades Table
```sql
-- Create trades table
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

-- Create policies
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add your domain to **Redirect URLs** if needed

## 5. Test Your Setup

1. Start your React app: `npm run dev`
2. Try registering a new account
3. Add some trades to test the database integration

## 6. Optional: Email Templates

You can customize email templates in **Authentication** → **Email Templates** for:
- Confirm signup
- Reset password
- Magic link

## 7. Production Deployment

When deploying to production:
1. Update your site URL in Supabase settings
2. Add your production domain to redirect URLs
3. Consider upgrading to a paid plan for higher limits

## Free Tier Limits

Supabase free tier includes:
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users
- 2GB file storage

This should be more than enough for a personal trading journal!
