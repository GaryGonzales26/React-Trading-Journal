-- =============================================
-- FORCE CLEAN SUPABASE DATABASE
-- =============================================
-- This script will forcefully clean your Supabase database
-- Run this in Supabase SQL Editor

-- 1. DISABLE RLS TEMPORARILY
ALTER TABLE IF EXISTS trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL POLICIES FIRST
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on trades table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'trades') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || r.policyname || ' ON trades';
    END LOOP;
    
    -- Drop all policies on user_profiles table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || r.policyname || ' ON user_profiles';
    END LOOP;
END $$;

-- 3. TRUNCATE TABLES (removes all data but keeps structure)
TRUNCATE TABLE IF EXISTS trades CASCADE;
TRUNCATE TABLE IF EXISTS user_profiles CASCADE;

-- 4. DROP TABLES COMPLETELY
DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 5. DROP ANY REMAINING SEQUENCES
DROP SEQUENCE IF EXISTS trades_id_seq CASCADE;

-- 6. VERIFY CLEANUP
SELECT 'Tables remaining:' as status;
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'trades');

SELECT 'Policies remaining:' as status;
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'trades');

-- 7. CHECK FOR ORPHANED DATA
SELECT 'Orphaned data in auth.users:' as status;
SELECT COUNT(*) as user_count FROM auth.users;

-- This should show 0 tables and 0 policies if successful
