'use client'
import Link from 'next/link'
import { PenTool, Smile, TestTube2, Share2, Plus, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface ActionItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  shadowColor: string
  description: string
  badge?: string
}

const actions: ActionItem[] = [
  {
    name: 'Journal',
    href: '/dashboard/journal/new',
    icon: PenTool,
    gradient: 'from-blue-400 to-blue-600',
    shadowColor: 'shadow-blue-200',
    description: 'Write about your thoughts',
    badge: 'Popular'
  },
  {
    name: 'Mood',
    href: '/dashboard/mood',
    icon: Smile,
    gradient: 'from-green-400 to-green-600',
    shadowColor: 'shadow-green-200',
    description: 'Track your emotions'
  },
  {
    name: 'Tests',
    href: '/dashboard/tests',
    icon: TestTube2,
    gradient: 'from-orange-400 to-orange-600',
    shadowColor: 'shadow-orange-200',
    description: 'Take wellness assessments',
    badge: 'New'
  },
  {
    name: 'Share',
    href: '/dashboard/share',
    icon: Share2,
    gradient: 'from-purple-400 to-purple-600',
    shadowColor: 'shadow-purple-200',
    description: 'Connect with providers'
  }
]

export function QuickActions() {
  return (
    <div className={`${montserrat.className} p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500`}>
      {/* Floating background elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      <Sparkles className="absolute top-4 right-4 h-4 w-4 text-[#EC7FA9]/40 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#BE5985] flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Quick Actions
          </h3>
          <div className="px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
            <span className="text-xs font-medium text-[#BE5985]">Daily Tools</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {actions.map((action, index) => (
            <Link
              key={action.name}
              href={action.href}
              className="group/item relative p-5 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/30 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge */}
              {action.badge && (
                <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg animate-bounce">
                  {action.badge}
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg ${action.shadowColor}/50 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#BE5985] group-hover/item:text-[#EC7FA9] transition-colors duration-300 mb-1">
                    {action.name}
                  </h4>
                  <p className="text-xs text-[#BE5985]/70 leading-tight">
                    {action.description}
                  </p>
                </div>
                
                <ArrowUpRight className="h-3 w-3 text-[#BE5985]/50 group-hover/item:text-[#EC7FA9] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-300 self-end absolute bottom-3 right-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Action Button */}
        <Link
          href="/dashboard/wellness"
          className="group/main w-full p-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover/main:opacity-100 transition-opacity duration-300"></div>
          <TrendingUp className="h-4 w-4 relative z-10 group-hover/main:scale-110 transition-transform duration-300" />
          <span className="relative z-10">View Wellness Hub</span>
          <Sparkles className="h-4 w-4 relative z-10 group-hover/main:rotate-180 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}
