'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { TrendingUp, Calendar, Star } from 'lucide-react'
import type { ReactElement } from 'react'

interface WeeklyScoreProps {
  className?: string
}

export function WeeklyScore({ className }: WeeklyScoreProps) {
  const { user } = useAuth()
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - replace with actual API
    const fetchWeeklyScore = async () => {
      try {
        // Mock score calculation based on mood entries and journal activity
        const mockScore = Math.floor(Math.random() * 40) + 60 // 60-100 range
        setTimeout(() => {
          setScore(mockScore)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch weekly score:', error)
        setLoading(false)
      }
    }

    if (user) {
      fetchWeeklyScore()
    }
  }, [user])

  const getScoreMessage = (score: number): { message: string; color: string; icon: ReactElement } => {
    if (score >= 85) {
      return {
        message: "Excellent week! You're in a great emotional space.",
        color: "text-green-700",
        icon: <Star className="h-4 w-4 text-green-600" />
      }
    } else if (score >= 70) {
      return {
        message: "Good progress this week! Keep nurturing your wellbeing.",
        color: "text-blue-700",
        icon: <TrendingUp className="h-4 w-4 text-blue-600" />
      }
    } else if (score >= 55) {
      return {
        message: "You're doing okay. Consider some self-care activities.",
        color: "text-orange-700",
        icon: <Calendar className="h-4 w-4 text-orange-600" />
      }
    } else {
      return {
        message: "Take it one day at a time. You're stronger than you know.",
        color: "text-purple-700",
        icon: <TrendingUp className="h-4 w-4 text-purple-600" />
      }
    }
  }

  if (loading) {
    return (
      <div className={`card animate-pulse ${className}`}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-6">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary">
            Check in with your mood to see your weekly score
          </p>
        </div>
      </div>
    )
  }

  const scoreInfo = getScoreMessage(score)

  return (
    <div className={`card bg-gradient-to-br from-success/10 to-info/10 border-success/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand" />
          This Week
        </h3>
        <div className="text-2xl font-bold text-brand">
          {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Wellness Score</span>
          <span className="text-sm text-text-secondary">{score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-brand to-success h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex items-start gap-3">
        {scoreInfo.icon}
        <div>
          <p className={`text-sm font-medium ${scoreInfo.color} mb-1`}>
            Week Summary
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {scoreInfo.message}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button className="btn-secondary w-full mt-4 text-sm">
        View Detailed Insights
      </button>
    </div>
  )
}
