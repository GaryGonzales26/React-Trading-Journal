-- =============================================
-- CHECK CURRENT DATABASE STATE
-- =============================================
-- Run this first to see what's currently in your database

-- 1. Check what tables exist
SELECT 'EXISTING TABLES:' as info;
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check what policies exist
SELECT 'EXISTING POLICIES:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check if RLS is enabled
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 4. Check for data in tables
SELECT 'DATA COUNTS:' as info;
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
UNION ALL
SELECT 'trades' as table_name, COUNT(*) as row_count FROM trades;

-- 5. Check auth.users (this should always exist)
SELECT 'AUTH USERS COUNT:' as info;
SELECT COUNT(*) as user_count FROM auth.users;
