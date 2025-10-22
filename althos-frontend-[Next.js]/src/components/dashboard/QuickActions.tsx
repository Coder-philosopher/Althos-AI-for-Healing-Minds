'use client'
import Link from 'next/link'
import { PenTool, Smile, TestTube2, Share2, Plus, TrendingUp, Sparkles, ArrowUpRight, Zap, Heart } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { useState } from 'react'
import { cn } from '@/lib/utils'
//fixed
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface ActionItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  gradient: string
  hoverGradient: string
  description: string
  badge?: string
  badgeColor?: string
}


const actions: ActionItem[] = [
  {
    name: 'Journal',
    href: '/dashboard/journal/new',
    icon: PenTool,
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    hoverGradient: 'from-blue-500 via-indigo-500 to-blue-600',
    description: 'Write about your thoughts',
    
  },
  {
    name: 'Mood',
    href: '/dashboard/mood',
    icon: Smile,
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    hoverGradient: 'from-emerald-500 via-teal-500 to-green-600',
    description: 'Track your emotions'
  },
  {
    name: 'Tests',
    href: '/dashboard/tests',
    icon: TestTube2,
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    hoverGradient: 'from-orange-500 via-yellow-500 to-amber-600',
    description: 'Take wellness assessments',
    
  },
  {
    name: 'Share',
    href: '/dashboard/share',
    icon: Share2,
    gradient: 'from-purple-400 via-violet-500 to-fuchsia-500',
    hoverGradient: 'from-purple-500 via-fuchsia-500 to-violet-600',
    description: 'Connect with providers'
  }
]

export function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`${montserrat.className} relative group`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#F8A5C2]/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#E879B9]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] rounded-2xl blur-xl opacity-40 animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] shadow-xl border-2 border-white/50">
                  <Zap className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#C74585]">Quick Actions</h3>
                <p className="text-sm text-[#A03768]/60 font-medium">Your daily wellness tools</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 border-2 border-[#E879B9]/30 shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent">
                4 Tools
              </span>
            </div>
          </div>
          
          {/* Action cards grid with 3D hover effect */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {actions.map((action, index) => {
              const IconComponent = action.icon
              const isHovered = hoveredIndex === index

              return (
                <Link
                  key={action.name}
                  href={action.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group/item relative block"
                >
                  {/* Card glow effect */}
                  <div className={cn(
                    "absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover/item:opacity-60 transition-opacity duration-500",
                    `bg-gradient-to-r ${action.gradient}`
                  )} />

                  <div className={cn(
                    "relative p-6 rounded-2xl transition-all duration-500",
                    "bg-gradient-to-br from-white via-[#FFF8FB] to-[#FFF5F9]",
                    "border-2 border-[#F8A5C2]/40",
                    "hover:border-[#E879B9]/60 hover:shadow-2xl",
                    "hover:-translate-y-2 hover:scale-105",
                    "overflow-hidden"
                  )}>
                    {/* Gradient overlay on hover */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500",
                      `bg-gradient-to-br ${action.gradient.replace('400', '50').replace('500', '100')}`
                    )} />

                    {/* Badge */}
                    {action.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className={cn(
                          "px-3 py-1.5 text-xs font-bold rounded-full text-white shadow-lg border-2 border-white/50",
                          `bg-gradient-to-r ${action.badgeColor}`,
                          "animate-bounce"
                        )}>
                          {action.badge}
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      {/* Animated icon */}
                      <div className="relative">
                        <div className={cn(
                          "absolute inset-0 rounded-2xl blur-xl transition-all duration-500",
                          `bg-gradient-to-br ${action.gradient}`,
                          isHovered ? "opacity-60 scale-110" : "opacity-0"
                        )} />
                        <div className={cn(
                          "relative p-4 rounded-2xl shadow-2xl border-2 border-white/50 transition-all duration-500",
                          `bg-gradient-to-br ${isHovered ? action.hoverGradient : action.gradient}`,
                          isHovered && "scale-110 rotate-12"
                        )}>
                          <IconComponent className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      {/* Text content */}
                      <div>
                        <h4 className={cn(
                          "font-bold text-lg mb-2 transition-all duration-300",
                          isHovered 
                            ? `bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`
                            : "text-[#C74585]"
                        )}>
                          {action.name}
                        </h4>
                        <p className="text-sm text-[#A03768]/70 leading-tight font-medium">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Arrow icon */}
                      <ArrowUpRight className={cn(
                        "h-5 w-5 transition-all duration-300 absolute bottom-4 right-4",
                        isHovered 
                          ? "text-[#E879B9] translate-x-1 -translate-y-1 opacity-100"
                          : "text-[#A03768]/30 opacity-0"
                      )} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Featured action with animated border */}
          <Link
            href="/dashboard/wellness"
            className="group/main block relative"
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-2xl blur opacity-40 group-hover/main:opacity-100 transition duration-500 animate-gradient-xy" />
            
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#C74585] border-2 border-white/30 shadow-2xl group-hover/main:shadow-[#E879B9]/60 transition-all duration-500 group-hover/main:-translate-y-1 overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/main:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm group-hover/main:scale-110 transition-transform">
                  <Heart className="h-5 w-5" fill="white" />
                </div>
                <span>View Wellness Hub</span>
                <Sparkles className="h-5 w-5 group-hover/main:rotate-180 transition-transform duration-500" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
