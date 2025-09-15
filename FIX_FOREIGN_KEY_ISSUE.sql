-- Fix Foreign Key Constraint Issue for User Profiles
-- This addresses the timing issue between user creation and profile creation

-- 1. First, let's check if the foreign key constraint is causing issues
-- We'll modify the approach to handle the timing better

-- Option 1: Remove the foreign key constraint temporarily and add it back with DEFERRABLE
-- This allows the constraint to be checked at the end of the transaction

-- Drop the existing foreign key constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Add it back with DEFERRABLE INITIALLY DEFERRED
-- This means the constraint check is deferred until the end of the transaction
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) 
DEFERRABLE INITIALLY DEFERRED;

-- 2. Update the trigger function to handle this better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Use a small delay to ensure the user is fully committed
  PERFORM pg_sleep(0.1);
  
  INSERT INTO public.user_profiles (id, email, full_name, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Alternative approach: Create a more robust profile creation function
CREATE OR REPLACE FUNCTION public.create_user_profile_safe(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT 'User'
)
RETURNS void AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if the user exists in auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = user_id) INTO user_exists;
  
  IF user_exists THEN
    INSERT INTO public.user_profiles (id, email, full_name, created_at)
    VALUES (user_id, user_email, user_full_name, NOW())
    ON CONFLICT (id) DO NOTHING;
  ELSE
    -- If user doesn't exist yet, wait a bit and try again
    PERFORM pg_sleep(0.5);
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = user_id) INTO user_exists;
    
    IF user_exists THEN
      INSERT INTO public.user_profiles (id, email, full_name, created_at)
      VALUES (user_id, user_email, user_full_name, NOW())
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION public.create_user_profile_safe TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user TO postgres;

-- 5. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
