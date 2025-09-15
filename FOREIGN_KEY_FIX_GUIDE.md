# Fix Foreign Key Constraint Issue

## Problem
The error `insert or update on table "user_profiles" violates foreign key constraint "user_profiles_id_fkey"` occurs because there's a timing issue between user creation in `auth.users` and profile creation in `user_profiles`.

## Root Cause
The foreign key constraint `REFERENCES auth.users(id)` is being checked before the user is fully committed to the `auth.users` table during the signup process.

## Solutions

### Option 1: Simple Fix (Recommended)
Run `SIMPLE_FIX_ALTERNATIVE.sql` in your Supabase SQL Editor. This:
- Removes the problematic foreign key constraint
- Creates a simple trigger for automatic profile creation
- Uses permissive RLS policies for inserts
- Relies on application logic for data integrity

### Option 2: Advanced Fix with Deferred Constraints
Run `FIX_FOREIGN_KEY_ISSUE.sql` if you want to keep foreign key constraints but make them deferrable.

## Step-by-Step Fix

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run the Simple Fix:**
   ```sql
   -- Copy and paste the contents of SIMPLE_FIX_ALTERNATIVE.sql
   ```

3. **Test Registration:**
   - Try registering a new user
   - Check if the profile is created in `user_profiles` table

## What Each Solution Does

### Simple Fix (`SIMPLE_FIX_ALTERNATIVE.sql`)
- ✅ Removes foreign key constraint that causes timing issues
- ✅ Creates automatic trigger for profile creation
- ✅ Uses permissive RLS for inserts
- ✅ Simple and reliable
- ⚠️ Relies on application logic for data integrity

### Advanced Fix (`FIX_FOREIGN_KEY_ISSUE.sql`)
- ✅ Keeps foreign key constraints with `DEFERRABLE INITIALLY DEFERRED`
- ✅ Creates robust functions with retry logic
- ✅ More complex but maintains referential integrity
- ⚠️ More complex setup

## Verification

After running either fix, verify it works:

1. **Check the trigger exists:**
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```

2. **Test registration:**
   - Register a new user
   - Check `user_profiles` table for the new profile

3. **Check function exists:**
   ```sql
   SELECT * FROM information_schema.routines 
   WHERE routine_name = 'create_user_profile_simple';
   ```

## Why This Happens

1. User signs up → `auth.users` record is created
2. Immediately after, we try to create `user_profiles` record
3. Foreign key constraint checks if user exists in `auth.users`
4. Due to transaction timing, the user might not be fully committed yet
5. Constraint fails with "Key is not present in table 'users'"

## Alternative: Manual Profile Creation

If you prefer to handle this entirely in the application:

1. Remove the automatic profile creation from signup
2. Create profiles only when users first log in
3. Use the existing `fetchUserProfile` function logic

This approach is simpler but means profiles aren't created until first login.
