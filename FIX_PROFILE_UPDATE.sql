-- Fix Profile Update Issue
-- This ensures users can update their own profiles

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Update the RLS policy for profile updates to be more permissive
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create a more specific policy for updates
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also ensure the insert policy allows profile creation
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test the policies
SELECT * FROM user_profiles WHERE id = auth.uid();
