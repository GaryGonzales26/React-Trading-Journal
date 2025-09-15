'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  updateProfile: () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase not available - setting loading to false')
      setLoading(false)
      return
    }

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout - setting loading to false')
      setLoading(false)
    }, 5000) // Reduced to 5 second timeout

    // Handle visibility change to stop loading when tab is not focused
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setLoading(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
      clearTimeout(loadingTimeout)
    }).catch((error) => {
      console.error('Error getting initial session:', error)
      setLoading(false)
      clearTimeout(loadingTimeout)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only show loading for sign in/out events, not when tab regains focus
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(true)
      }
      
      setUser(session?.user ?? null)
      if (session?.user) {
        // Wait a moment for the session to be fully established
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
      clearTimeout(loadingTimeout)
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(loadingTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    if (!supabase) {
      return
    }
    
    try {
      // Add timeout to prevent hanging
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      )

      const { data, error } = await Promise.race([profilePromise, timeoutPromise])

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching profile:', error)
        // Don't return here, try to create profile if it doesn't exist
      }

      if (!data || error?.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: userData } = await supabase.auth.getUser()
        
        if (userData?.user) {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: userId,
                email: userData.user.email,
                full_name: userData.user.user_metadata?.full_name || 'User',
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile on login:', createError)
            // Set a basic profile if creation fails
            setProfile({
              id: userId,
              full_name: userData.user.user_metadata?.full_name || 'User',
              email: userData.user.email,
              created_at: new Date().toISOString()
            })
          } else {
            setProfile(newProfile)
          }
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Set a basic profile on error to prevent infinite loading
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        setProfile({
          id: userId,
          full_name: userData.user.user_metadata?.full_name || 'User',
          email: userData.user.email,
          created_at: new Date().toISOString()
        })
      }
    }
  }

  const signUp = async (email, password, userData) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please use a different email or sign in.')
        }
        throw error
      }

      // If user was created successfully, create their profile using the safer database function
      if (data.user) {
        try {
          // Use the simpler function that doesn't rely on foreign key constraints
          const { error: profileError } = await supabase.rpc('create_user_profile_simple', {
            user_id: data.user.id,
            user_email: data.user.email,
            user_full_name: userData.full_name || 'User'
          })

          if (profileError) {
            console.error('Error creating user profile:', profileError)
            // Don't throw error here as the user was created successfully
            // The profile will be created on first login or by the trigger
          }
        } catch (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't throw error here as the user was created successfully
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured. Please set up your database credentials.' } }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
