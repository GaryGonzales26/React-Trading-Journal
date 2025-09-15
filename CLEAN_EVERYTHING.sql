-- =============================================
-- COMPLETE SUPABASE CLEANUP - TABLES + USERS
-- =============================================
-- This script will clean EVERYTHING: tables, data, and users
-- ⚠️  WARNING: This will delete ALL data and users permanently!

-- 1. DISABLE RLS ON ALL TABLES
ALTER TABLE IF EXISTS trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL POLICIES
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

-- 3. DELETE ALL DATA FROM TABLES
DELETE FROM trades;
DELETE FROM user_profiles;

-- 4. DROP TABLES COMPLETELY
DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 5. DROP SEQUENCES
DROP SEQUENCE IF EXISTS trades_id_seq CASCADE;

-- 6. DELETE ALL USERS FROM AUTH
-- This will delete all users and their associated data
DELETE FROM auth.users;

-- 7. RESET AUTH SEQUENCES
-- Reset the user ID sequence
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART WITH 1;

-- 8. CLEAN UP AUTH SESSIONS
-- Delete all active sessions
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;

-- 9. VERIFY COMPLETE CLEANUP
SELECT '=== CLEANUP VERIFICATION ===' as status;

SELECT 'Tables remaining:' as info;
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'trades');

SELECT 'Policies remaining:' as info;
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'trades');

SELECT 'Users remaining:' as info;
SELECT COUNT(*) as user_count FROM auth.users;

SELECT 'Sessions remaining:' as info;
SELECT COUNT(*) as session_count FROM auth.sessions;

-- All counts should be 0 if successful
