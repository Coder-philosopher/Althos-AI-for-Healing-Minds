'use client'
import { User } from '@/lib/types'
import { Sunrise, Moon, Star, Sparkles } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface WelcomeCardProps {
  user: User | null
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const Icon = hour < 18 ? Sunrise : Moon

  const getTimeBasedElements = () => {
    if (hour < 12) {
      return {
        bgGradient: 'bg-gradient-to-br from-[#FFEDFA]/80 to-[#FFB8E0]/30',
        iconBg: 'bg-gradient-to-br from-orange-100 to-yellow-100',
        iconColor: 'text-orange-600',
        sparkles: true
      }
    } else if (hour < 18) {
      return {
        bgGradient: 'bg-gradient-to-br from-[#FFB8E0]/40 to-[#EC7FA9]/20',
        iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
        iconColor: 'text-blue-600',
        sparkles: false
      }
    } else {
      return {
        bgGradient: 'bg-gradient-to-br from-[#BE5985]/10 to-[#EC7FA9]/20',
        iconBg: 'bg-gradient-to-br from-purple-100 to-indigo-100',
        iconColor: 'text-purple-600',
        sparkles: true
      }
    }
  }

  const timeElements = getTimeBasedElements()

  return (
    <div className={`${montserrat.className} relative p-8 rounded-3xl ${timeElements.bgGradient} backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500`}>
      {/* Floating decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/30 to-[#BE5985]/10 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-700" />
      
      {timeElements.sparkles && (
        <>
          <Sparkles className="absolute top-6 right-6 h-4 w-4 text-[#EC7FA9]/40 animate-pulse" />
          <Star className="absolute bottom-8 right-12 h-3 w-3 text-[#BE5985]/30 animate-bounce" />
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-2xl ${timeElements.iconBg} shadow-lg shadow-[#FFB8E0]/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
            <Icon className={`h-7 w-7 ${timeElements.iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] leading-tight group-hover:text-[#EC7FA9] transition-colors duration-300">
              {greeting}, {user?.name || 'there'}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 bg-[#EC7FA9] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#BE5985]/70">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-[#BE5985]/80 text-lg leading-relaxed group-hover:text-[#BE5985] transition-colors duration-300">
          How are you feeling today? Take a moment to check in with yourself.
        </p>
        
        {/* Wellness streak indicator */}
        <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#FFB8E0]/30">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-[#EC7FA9] fill-current" />
            ))}
          </div>
          <span className="text-sm font-medium text-[#BE5985]">5-day wellness streak! 🎉</span>
        </div>
      </div>
    </div>
  )
}
