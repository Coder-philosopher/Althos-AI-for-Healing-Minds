'use client'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { WelcomeCard } from '@/components/dashboard/WelcomeCard'
import { QuickMoodEntry } from '@/components/dashboard/QuickMoodEntry'
import { RecentJournals } from '@/components/dashboard/RecentJournals'
import { WeeklyScore } from '@/components/dashboard/WeeklyScore'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { UpcomingReminders } from '@/components/dashboard/UpcomingReminders'

export default function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('dashboardVisited')

    if (!hasVisited) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('dashboardVisited', 'true')
        window.location.reload()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeCard user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickMoodEntry />
          <RecentJournals />
        </div>
        
        <div className="space-y-6">
          <WeeklyScore />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
