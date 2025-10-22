'use client'
import { User } from '@/lib/types'
import { Sunrise, Moon, Star, Sparkles, TrendingUp, Flame } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface WelcomeCardProps {
  user: User | null
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const [mounted, setMounted] = useState(false)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const Icon = hour < 18 ? Sunrise : Moon

  useEffect(() => {
    setMounted(true)
  }, [])

  const getTimeBasedElements = () => {
    if (hour < 12) {
      return {
        bgGradient: 'from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6]',
        cardBg: 'from-[#F8A5C2]/10 via-white to-[#FFEBF3]/20',
        iconBg: 'from-amber-50 to-orange-50',
        iconColor: 'text-amber-600',
        accentColor: 'from-amber-400 to-orange-500',
        sparkles: true
      }
    } else if (hour < 18) {
      return {
        bgGradient: 'from-[#FFEBF3] via-white to-[#FFF5F9]',
        cardBg: 'from-[#E879B9]/10 via-white to-[#F8A5C2]/10',
        iconBg: 'from-sky-50 to-blue-50',
        iconColor: 'text-sky-600',
        accentColor: 'from-sky-400 to-blue-500',
        sparkles: false
      }
    } else {
      return {
        bgGradient: 'from-[#F8A5C2]/20 via-[#FFEBF3] to-[#E879B9]/10',
        cardBg: 'from-[#DB5F9A]/10 via-white to-[#E879B9]/15',
        iconBg: 'from-purple-50 to-indigo-50',
        iconColor: 'text-purple-600',
        accentColor: 'from-purple-400 to-indigo-500',
        sparkles: true
      }
    }
  }

  const timeElements = getTimeBasedElements()

  if (!mounted) return null

  return (
    <div className={`${montserrat.className} relative group`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${timeElements.bgGradient} rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700`} />
      
      <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${timeElements.cardBg} backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30 group-hover:border-[#E879B9]/60`}>
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-[#F8A5C2]/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-br from-[#E879B9]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-[#DB5F9A]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Floating sparkles */}
        {timeElements.sparkles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Sparkles className="absolute top-8 right-8 h-5 w-5 text-[#E879B9]/60 animate-pulse animation-delay-1000" />
            <Star className="absolute top-16 right-20 h-4 w-4 text-[#F8A5C2]/50 animate-bounce animation-delay-2000" />
            <Sparkles className="absolute bottom-12 left-16 h-4 w-4 text-[#DB5F9A]/40 animate-pulse" />
          </div>
        )}

        <div className="relative z-10">
          {/* Header with icon and greeting */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Animated icon container */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${timeElements.accentColor} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 animate-pulse`} />
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${timeElements.iconBg} shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className={`h-8 w-8 ${timeElements.iconColor}`} />
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C74585] via-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent leading-tight group-hover:scale-105 transition-transform duration-300 inline-block">
                  {greeting}, {user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E879B9] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A]"></span>
                  </div>
                  <span className="text-sm font-medium text-[#A03768]/70">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick mood indicator */}
            <div className="hidden sm:block px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border-2 border-[#F8A5C2]/40 shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent">
                Day 15
              </span>
            </div>
          </div>
          
          {/* Motivational message */}
          <p className="text-[#A03768]/80 text-lg leading-relaxed mb-6 font-medium group-hover:text-[#A03768] transition-colors duration-300">
            How are you feeling today? Take a moment to check in with yourself and track your wellness journey.
          </p>
          
          {/* Enhanced wellness streak with progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Streak card */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-[#FFF5F9]/80 backdrop-blur-sm border-2 border-[#F8A5C2]/50 shadow-lg hover:shadow-xl hover:border-[#E879B9]/60 transition-all duration-300 group/card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#E879B9]/20 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/10">
                      <Flame className="h-5 w-5 text-[#DB5F9A]" />
                    </div>
                    <span className="text-sm font-semibold text-[#A03768]/70">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] bg-clip-text text-transparent">
                    5 days
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map((day) => (
                    <div key={day} className="relative group/star">
                      <Star className="h-5 w-5 text-[#E879B9] fill-current transition-transform group-hover/star:scale-125" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress card */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-[#FFEBF3]/80 backdrop-blur-sm border-2 border-[#F8A5C2]/50 shadow-lg hover:shadow-xl hover:border-[#E879B9]/60 transition-all duration-300 group/card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#F8A5C2]/20 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#F8A5C2]/20 to-[#E879B9]/10">
                      <TrendingUp className="h-5 w-5 text-[#DB5F9A]" />
                    </div>
                    <span className="text-sm font-semibold text-[#A03768]/70">Weekly Progress</span>
                  </div>
                  <span className="text-lg font-bold text-[#DB5F9A]">87%</span>
                </div>
                <div className="relative h-2.5 bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] rounded-full overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-full w-[87%] shadow-lg animate-progress" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 87%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </div>
  )
}
