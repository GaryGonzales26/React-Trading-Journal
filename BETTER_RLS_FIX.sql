    -- Better RLS Fix for User Profile Creation
    -- This creates a secure function that can create profiles during signup

    -- 1. Create a function to handle user profile creation
    -- This function runs with SECURITY DEFINER, so it bypasses RLS
    CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_full_name TEXT DEFAULT 'User'
    )
    RETURNS void AS $$
    BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, created_at)
    VALUES (user_id, user_email, user_full_name, NOW())
    ON CONFLICT (id) DO NOTHING; -- Don't error if profile already exists
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- 2. Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;

    -- 3. Update the existing policies to be more specific
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

    -- Create proper RLS policies
    CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

    -- Allow inserts only for authenticated users creating their own profile
    CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

    -- 4. Create a trigger that automatically creates profiles on user signup
    -- This is the most reliable approach
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
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

    -- Drop existing trigger if it exists
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- Create the trigger
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
