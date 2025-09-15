-- =============================================
-- SUPABASE DATABASE CLEANUP SCRIPT
-- =============================================
-- Run this in your Supabase SQL Editor to clean and reset your database
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- 1. DROP EXISTING TABLES (if they exist)
-- This will remove all data and table structures

DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. DROP EXISTING POLICIES (if they exist)
-- This ensures no orphaned policies remain

-- Note: Policies are automatically dropped when tables are dropped,
-- but this is here for completeness

-- 3. VERIFY CLEANUP
-- Check that tables are completely removed

SELECT 
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'trades');

-- This should return no rows if cleanup was successful

-- 4. RESET SEQUENCES (if any exist)
-- Reset any auto-increment sequences

-- Note: Sequences are automatically dropped with tables

-- =============================================
-- AFTER RUNNING THIS SCRIPT:
-- =============================================
-- 1. Run DATABASE_SETUP.sql to create fresh tables
-- 2. Run DATABASE_TRIGGERS.sql to add triggers
-- 3. Run FIX_RLS_POLICIES.sql to ensure proper security
-- 4. Test your application

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check that no tables exist
SELECT 
  schemaname,
  tablename
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'trades');

-- Check that no policies exist
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'trades');

-- Both queries should return empty results
