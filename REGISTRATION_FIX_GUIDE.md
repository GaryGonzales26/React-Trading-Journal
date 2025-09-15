# Fix User Registration Database Insertion Issue

## Problem
When users register, they get a 200 response but their profile is not inserted into the database due to Row Level Security (RLS) policies.

## Root Cause
The RLS policy `auth.uid() = id` prevents profile creation during signup because the user isn't fully authenticated yet when we try to insert the profile.

## Solution

### Option 1: Database Trigger (Recommended)
Run the `BETTER_RLS_FIX.sql` file in your Supabase SQL Editor. This creates:
1. A database trigger that automatically creates user profiles when new users sign up
2. A secure function for profile creation
3. Proper RLS policies

### Option 2: Manual RLS Policy Fix
If you prefer to handle it manually, run `FIX_RLS_POLICIES.sql` to update the RLS policies.

## Steps to Fix

1. **Go to your Supabase Dashboard**
   - Navigate to SQL Editor
   - Create a new query

2. **Run the Database Setup** (if not already done)
   ```sql
   -- Copy and paste the contents of DATABASE_SETUP.sql
   ```

3. **Run the RLS Fix**
   ```sql
   -- Copy and paste the contents of BETTER_RLS_FIX.sql
   ```

4. **Test the Registration**
   - Try registering a new user
   - Check the `user_profiles` table to confirm the profile was created

## Verification

After running the fix, you can verify it works by:

1. **Check the trigger exists:**
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```

2. **Check the function exists:**
   ```sql
   SELECT * FROM information_schema.routines 
   WHERE routine_name = 'create_user_profile';
   ```

3. **Test registration:**
   - Register a new user
   - Check if a profile was created in `user_profiles` table

## Alternative: Disable RLS Temporarily

If you want to test without RLS restrictions:

```sql
-- Temporarily disable RLS for user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Test registration

-- Re-enable RLS after testing
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

## Notes

- The database trigger approach is the most reliable as it automatically creates profiles
- The RPC function approach provides a fallback if the trigger doesn't work
- RLS policies ensure users can only access their own data
- The `ON CONFLICT DO NOTHING` prevents duplicate profile creation
