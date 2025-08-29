'use client'
import { User } from '@/lib/types'
import { Sunrise, Moon } from 'lucide-react'

interface WelcomeCardProps {
  user: User | null
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const Icon = hour < 18 ? Sunrise : Moon

  return (
    <div className="card bg-gradient-to-r from-brand/10 to-info/10 border-brand/20">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-bold text-text-primary">
          {greeting}, {user?.name || 'there'}!
        </h1>
      </div>
      <p className="text-text-secondary">
        How are you feeling today? Take a moment to check in with yourself.
      </p>
    </div>
  )
}
