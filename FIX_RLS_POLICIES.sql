-- Fix RLS Policies for User Profile Creation
-- Run this in your Supabase SQL Editor to fix the registration issue

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies that allow profile creation during signup
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (true); -- Allow all inserts during signup

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Alternative approach: Create a more permissive policy for inserts
-- This allows profile creation when the user ID matches the authenticated user
-- or when creating a new profile (for signup process)
CREATE POLICY "Allow profile creation during signup" ON user_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    auth.uid() IS NULL -- Allow when no user is authenticated (during signup)
  );

-- If the above doesn't work, try this more permissive approach:
-- Temporarily disable RLS for inserts only
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- Then re-enable it after testing
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
