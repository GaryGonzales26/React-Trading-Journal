'use client'

import { useAuth } from '@/contexts/AuthContext'
import UserProfile from '@/components/UserProfile'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to access your profile.</div>
  }

  return <UserProfile />
}
