-- =============================================
-- SAFE USER CLEANUP - STEP BY STEP
-- =============================================
-- This script cleans users safely, one step at a time
-- Run each section separately to monitor progress

-- STEP 1: Check current users
SELECT '=== CURRENT USERS ===' as info;
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Check user count
SELECT '=== USER COUNT ===' as info;
SELECT COUNT(*) as total_users FROM auth.users;

-- STEP 3: Delete users one by one (safer approach)
-- Uncomment the line below to delete users
-- DELETE FROM auth.users;

-- STEP 4: Delete all users at once (faster but less safe)
-- Uncomment the line below to delete all users
-- TRUNCATE TABLE auth.users CASCADE;

-- STEP 5: Clean up sessions and tokens
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;

-- STEP 6: Verify cleanup
SELECT '=== CLEANUP VERIFICATION ===' as info;
SELECT COUNT(*) as remaining_users FROM auth.users;
SELECT COUNT(*) as remaining_sessions FROM auth.sessions;
