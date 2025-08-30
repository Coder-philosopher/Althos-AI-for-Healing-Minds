'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { TrendingUp, Calendar, Star, Target, Award, Zap } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import type { ReactElement } from 'react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface WeeklyScoreProps {
  className?: string
}

export function WeeklyScore({ className }: WeeklyScoreProps) {
  const { user } = useAuth()
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [previousScore] = useState(75) // Mock previous week score

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

  const getScoreMessage = (score: number): { message: string; color: string; icon: ReactElement; bgColor: string } => {
    if (score >= 85) {
      return {
        message: "Excellent week! You're in a great emotional space.",
        color: "text-green-700",
        bgColor: "from-green-50 to-emerald-100",
        icon: <Award className="h-5 w-5 text-green-600" />
      }
    } else if (score >= 70) {
      return {
        message: "Good progress this week! Keep nurturing your wellbeing.",
        color: "text-blue-700",
        bgColor: "from-blue-50 to-sky-100",
        icon: <TrendingUp className="h-5 w-5 text-blue-600" />
      }
    } else if (score >= 55) {
      return {
        message: "You're doing okay. Consider some self-care activities.",
        color: "text-orange-700",
        bgColor: "from-orange-50 to-amber-100",
        icon: <Target className="h-5 w-5 text-orange-600" />
      }
    } else {
      return {
        message: "Take it one day at a time. You're stronger than you know.",
        color: "text-purple-700",
        bgColor: "from-purple-50 to-violet-100",
        icon: <Star className="h-5 w-5 text-purple-600" />
      }
    }
  }

  const getScoreChange = () => {
    if (!score) return null
    const change = score - previousScore
    return {
      value: change,
      isPositive: change >= 0,
      text: change >= 0 ? `+${change}` : `${change}`
    }
  }

  if (loading) {
    return (
      <div className={`${montserrat.className} p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-[#FFB8E0]/30 rounded w-32"></div>
            <div className="h-10 w-10 bg-[#FFB8E0]/30 rounded-xl"></div>
          </div>
          <div className="h-3 bg-[#FFB8E0]/30 rounded w-full"></div>
          <div className="h-4 bg-[#FFB8E0]/30 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className={`${montserrat.className} p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 ${className}`}>
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-[#FFEDFA]/60 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-[#BE5985]/50" />
          </div>
          <h4 className="font-semibold text-[#BE5985] mb-2">Track Your Progress</h4>
          <p className="text-[#BE5985]/70 text-sm leading-relaxed">
            Check in with your mood to see your weekly score
          </p>
        </div>
      </div>
    )
  }

  const scoreInfo = getScoreMessage(score)
  const scoreChange = getScoreChange()

  return (
    <div className={`${montserrat.className} p-6 rounded-3xl bg-gradient-to-br ${scoreInfo.bgColor}/20 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 ${className}`}>
      {/* Floating background elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#BE5985] flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            This Week
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#BE5985] leading-none">{score}</div>
            {scoreChange && (
              <div className={`text-sm font-medium flex items-center gap-1 ${
                scoreChange.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{scoreChange.text}</span>
                <span className="text-xs text-[#BE5985]/60">vs last week</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#BE5985]">Wellness Score</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-[#EC7FA9]" />
              <span className="text-sm font-medium text-[#BE5985]">{score}/100</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-[#FFB8E0]/30 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${score}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="absolute -top-8 bg-[#BE5985] text-white text-xs font-medium px-2 py-1 rounded-full transition-all duration-1000 ease-out" style={{ left: `${Math.max(0, Math.min(85, score - 5))}%` }}>
              {score}%
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${scoreInfo.bgColor}/30 border border-white/50 mb-4`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/80 shadow-inner">
              {scoreInfo.icon}
            </div>
            <div>
              <p className={`text-sm font-semibold ${scoreInfo.color} mb-1`}>
                Week Summary
              </p>
              <p className="text-sm text-[#BE5985]/80 leading-relaxed">
                {scoreInfo.message}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 text-sm">
          View Detailed Insights
        </button>
      </div>
    </div>
  )
}
