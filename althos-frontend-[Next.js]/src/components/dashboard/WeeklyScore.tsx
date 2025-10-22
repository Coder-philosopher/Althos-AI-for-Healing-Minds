'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { TrendingUp, Calendar, Star, Target, Award, Zap, ArrowUp, ArrowDown, Sparkles, TrendingDown } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface WeeklyScoreProps {
  className?: string
}

// Animated circular progress component
function CircularProgress({ 
  value, 
  maxValue = 100,
  size = 180,
  strokeWidth = 12 
}: { 
  value: number
  maxValue?: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / maxValue) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-[#F8A5C2]/30"
        />
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E879B9" />
            <stop offset="50%" stopColor="#DB5F9A" />
            <stop offset="100%" stopColor="#F8A5C2" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#C74585] bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-sm font-semibold text-[#A03768]/60">out of {maxValue}</div>
      </div>
    </div>
  )
}

export function WeeklyScore({ className }: WeeklyScoreProps) {
  const { user } = useAuth()
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [previousScore] = useState(75)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchWeeklyScore = async () => {
      try {
        const mockScore = Math.floor(Math.random() * 40) + 60
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

  const getScoreMessage = (score: number) => {
    if (score >= 85) {
      return {
        message: "Excellent week! You're thriving emotionally.",
        title: "Outstanding Progress",
        color: "from-emerald-600 to-green-600",
        bgGradient: "from-emerald-50 via-green-50 to-teal-50",
        icon: Award,
        iconColor: "text-emerald-600",
        iconBg: "from-emerald-100 to-green-100"
      }
    } else if (score >= 70) {
      return {
        message: "Good progress! Keep nurturing your wellbeing.",
        title: "Great Week",
        color: "from-blue-600 to-indigo-600",
        bgGradient: "from-blue-50 via-sky-50 to-indigo-50",
        icon: TrendingUp,
        iconColor: "text-blue-600",
        iconBg: "from-blue-100 to-sky-100"
      }
    } else if (score >= 55) {
      return {
        message: "You're doing okay. Consider some self-care activities.",
        title: "Steady Progress",
        color: "from-amber-600 to-orange-600",
        bgGradient: "from-amber-50 via-yellow-50 to-orange-50",
        icon: Target,
        iconColor: "text-amber-600",
        iconBg: "from-amber-100 to-orange-100"
      }
    } else {
      return {
        message: "Take it one day at a time. You're stronger than you know.",
        title: "Keep Going",
        color: "from-purple-600 to-violet-600",
        bgGradient: "from-purple-50 via-violet-50 to-fuchsia-50",
        icon: Star,
        iconColor: "text-purple-600",
        iconBg: "from-purple-100 to-violet-100"
      }
    }
  }

  const getScoreChange = () => {
    if (!score) return null
    const change = score - previousScore
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      text: change >= 0 ? `+${change}` : `${change}`,
      percentage: Math.round((Math.abs(change) / previousScore) * 100)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div className={cn(montserrat.className, 'relative group', className)}>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-[#FFF8FB] to-[#FFF5F9] backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 rounded-xl w-40"></div>
              <div className="h-12 w-12 bg-gradient-to-br from-[#E879B9]/30 to-[#F8A5C2]/20 rounded-2xl"></div>
            </div>
            <div className="flex justify-center">
              <div className="h-44 w-44 rounded-full bg-gradient-to-br from-[#F8A5C2]/30 via-[#FFEBF3]/20 to-[#E879B9]/20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/15 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/15 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className={cn(montserrat.className, 'relative group', className)}>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-[#FFF8FB] to-[#FFF5F9] backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20">
          <div className="text-center py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative p-8 rounded-full bg-gradient-to-br from-[#F8A5C2]/20 via-[#FFEBF3]/30 to-[#E879B9]/10 border-2 border-[#E879B9]/30">
                <Calendar className="h-16 w-16 text-[#DB5F9A]" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="text-xl font-bold text-[#C74585] mb-3">Track Your Progress</h4>
            <p className="text-[#A03768]/70 leading-relaxed max-w-xs mx-auto">
              Check in with your mood to see your weekly wellness score
            </p>
          </div>
        </div>
      </div>
    )
  }

  const scoreInfo = getScoreMessage(score)
  const scoreChange = getScoreChange()
  const IconComponent = scoreInfo.icon

  return (
    <div className={cn(montserrat.className, 'relative group', className)}>
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scoreInfo.bgGradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700`} />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E879B9]/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#F8A5C2]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${scoreInfo.color} rounded-2xl blur-xl opacity-40 animate-pulse`} />
                <div className={`relative p-3 rounded-2xl bg-gradient-to-br ${scoreInfo.iconBg} shadow-xl border-2 border-white/50`}>
                  <IconComponent className={cn("h-6 w-6", scoreInfo.iconColor)} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#C74585]">This Week</h3>
                <p className="text-sm text-[#A03768]/60 font-medium">Your wellness score</p>
              </div>
            </div>

            {/* Score change badge */}
            {scoreChange && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-lg",
                scoreChange.isPositive 
                  ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300/50 text-emerald-700"
                  : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-300/50 text-rose-700"
              )}>
                {scoreChange.isPositive ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span className="text-sm font-bold">{scoreChange.text}</span>
                <span className="text-xs opacity-70">vs last week</span>
              </div>
            )}
          </div>

          {/* Circular Progress */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <CircularProgress value={score} />
              {/* Decorative sparkles */}
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-[#E879B9] animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-[#F8A5C2] animate-pulse animation-delay-1000" />
            </div>
          </div>

          {/* Score message card */}
          <div className={cn(
            "p-6 rounded-2xl mb-6 border-2 backdrop-blur-sm relative overflow-hidden group/card",
            `bg-gradient-to-br ${scoreInfo.bgGradient} border-white/50`
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl shadow-lg border-2 border-white/50 group-hover/card:scale-110 transition-transform duration-300",
                  `bg-gradient-to-br ${scoreInfo.iconBg}`
                )}>
                  <IconComponent className={cn("h-6 w-6", scoreInfo.iconColor)} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "text-lg font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
                    scoreInfo.color
                  )}>
                    {scoreInfo.title}
                  </h4>
                  <p className="text-[#A03768]/80 leading-relaxed font-medium">
                    {scoreInfo.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#F8A5C2]/20 to-[#FFEBF3]/30 border-2 border-[#E879B9]/30 text-center">
              <div className="text-2xl font-bold text-[#C74585]">{score}%</div>
              <div className="text-xs font-semibold text-[#A03768]/60 mt-1">Current</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/20 border-2 border-[#DB5F9A]/30 text-center">
              <div className="text-2xl font-bold text-[#DB5F9A]">{previousScore}%</div>
              <div className="text-xs font-semibold text-[#A03768]/60 mt-1">Last Week</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#F09FCA]/20 to-[#E879B9]/20 border-2 border-[#E879B9]/30 text-center">
              <div className="text-2xl font-bold text-[#E879B9]">
                {scoreChange ? scoreChange.percentage : 0}%
              </div>
              <div className="text-xs font-semibold text-[#A03768]/60 mt-1">Change</div>
            </div>
          </div>

          {/* Action button */}
          <button className="w-full group/button relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-2xl blur-lg opacity-60 group-hover/button:opacity-100 transition-opacity" />
            <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] border-2 border-white/30 shadow-2xl hover:shadow-[#E879B9]/50 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-white font-bold">
                <TrendingUp className="h-5 w-5 group-hover/button:scale-110 transition-transform" />
                View Detailed Insights
                <Sparkles className="h-5 w-5 group-hover/button:rotate-180 transition-transform duration-500" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
