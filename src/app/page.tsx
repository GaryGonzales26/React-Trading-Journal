'use client'

import { useAuth } from '@/contexts/AuthContext'
import TradingPlanPage from '@/pages/TradingPlanPage'
import SetupPage from '@/components/SetupPage'
import LoadingDiagnostic from '@/components/LoadingDiagnostic'
import LandingPage from '@/components/LandingPage'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { user, loading } = useAuth()

  // Show setup page if Supabase is not configured
  if (!supabase) {
    return <SetupPage />
  }

  if (loading) {
    return <LoadingDiagnostic />
  }

  if (!user) {
    return <LandingPage />
  }

  return <TradingPlanPage />
}
