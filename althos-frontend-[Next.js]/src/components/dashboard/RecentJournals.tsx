'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getJournals } from '@/lib/api'
import { Journal } from '@/lib/types'
import { PenTool, ArrowRight, BookOpen, Plus, Calendar, Clock, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export function RecentJournals() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      getJournals(user.id, 3).then(data => {
        setJournals(data.data)
        setLoading(false)
      })
    }
  }, [user])

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const journalDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - journalDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return journalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getReadTime = (content: string) => {
    const words = content.split(' ').length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  return (
    <div className={`${montserrat.className} relative group`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20">
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
                  <PenTool className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#C74585]">Recent Journals</h3>
                <p className="text-sm text-[#A03768]/60 font-medium">Your latest thoughts</p>
              </div>
            </div>
            <Link 
              href="/dashboard/journal" 
              className="group/link flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 hover:from-[#E879B9]/30 hover:to-[#DB5F9A]/30 border-2 border-[#E879B9]/30 hover:border-[#DB5F9A]/50 text-[#C74585] hover:text-[#DB5F9A] text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#E879B9]/30 hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              View All
              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse p-6 rounded-2xl bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] border-2 border-[#F8A5C2]/30 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-[#F8A5C2]/40 to-[#E879B9]/30 rounded-xl animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gradient-to-r from-[#E879B9]/30 to-[#F8A5C2]/20 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/15 rounded w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/15 rounded w-2/3"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gradient-to-r from-[#E879B9]/25 to-[#F8A5C2]/20 rounded-full w-20"></div>
                        <div className="h-6 bg-gradient-to-r from-[#E879B9]/25 to-[#F8A5C2]/20 rounded-full w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9]/50 via-[#FFEBF3]/30 to-[#FFF0F6]/40 rounded-3xl blur-2xl"></div>
              <div className="relative z-10">
                {/* Empty state with animation */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative p-8 rounded-full bg-gradient-to-br from-[#F8A5C2]/20 via-[#FFEBF3]/30 to-[#E879B9]/10 border-2 border-[#E879B9]/30 shadow-xl">
                    <PenTool className="h-16 w-16 text-[#DB5F9A]" strokeWidth={1.5} />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-[#C74585] mb-3">Start Your Journey</h4>
                <p className="text-[#A03768]/70 text-lg mb-8 leading-relaxed max-w-md mx-auto">
                  No journal entries yet. Begin documenting your thoughts and feelings today.
                </p>
                <Link 
                  href="/dashboard/journal/new" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl group/button relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-2xl blur-lg opacity-60 group-hover/button:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold rounded-2xl shadow-2xl border-2 border-white/30 group-hover/button:-translate-y-1 transition-transform">
                    <Plus className="h-5 w-5" />
                    Write Your First Entry
                    <Sparkles className="h-5 w-5 group-hover/button:animate-spin" />
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((journal, index) => (
                <Link 
                  key={journal.id}
                  href={`/dashboard/journal/${journal.id}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="block group/item"
                >
                  <div className={cn(
                    "relative p-6 rounded-2xl transition-all duration-500 cursor-pointer",
                    "bg-gradient-to-r from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6]",
                    "border-2 border-[#F8A5C2]/40",
                    "hover:border-[#E879B9]/60 hover:shadow-2xl hover:shadow-[#E879B9]/30",
                    "hover:-translate-y-2 hover:scale-[1.02]"
                  )}>
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9]/5 via-[#F8A5C2]/5 to-[#E879B9]/5 opacity-0 group-hover/item:opacity-100 rounded-2xl transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex items-start gap-5">
                      {/* Animated icon */}
                      <div className={cn(
                        "flex-shrink-0 p-4 rounded-xl transition-all duration-500",
                        "bg-gradient-to-br from-white to-[#FFF5F9]",
                        "border-2 border-[#E879B9]/30",
                        "shadow-lg group-hover/item:shadow-xl",
                        "group-hover/item:scale-110 group-hover/item:rotate-6"
                      )}>
                        <Calendar className="h-6 w-6 text-[#DB5F9A]" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Title with gradient on hover */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className={cn(
                            "font-bold text-lg transition-all duration-300 truncate",
                            hoveredIndex === index 
                              ? "bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] bg-clip-text text-transparent"
                              : "text-[#C74585]"
                          )}>
                            {journal.title || 'Untitled Entry'}
                          </h4>
                          <ArrowRight className={cn(
                            "h-5 w-5 flex-shrink-0 ml-3 transition-all duration-300",
                            hoveredIndex === index 
                              ? "text-[#E879B9] translate-x-2"
                              : "text-[#A03768]/40"
                          )} />
                        </div>
                        
                        {/* Content preview */}
                        <p className="text-[#A03768]/70 text-sm line-clamp-2 leading-relaxed mb-4">
                          {journal.content.substring(0, 150)}...
                        </p>
                        
                        {/* Meta info with badges */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 border border-[#E879B9]/30">
                            <Clock className="h-3.5 w-3.5 text-[#DB5F9A]" />
                            <time className="text-xs font-semibold text-[#C74585]">
                              {getRelativeTime(journal.created_at)}
                            </time>
                          </div>
                          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/20 border border-[#E879B9]/30">
                            <span className="text-xs font-semibold text-[#C74585]">
                              {getReadTime(journal.content)}
                            </span>
                          </div>
                          {index === 0 && (
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] shadow-lg">
                              <TrendingUp className="h-3.5 w-3.5 text-white" />
                              <span className="text-xs font-bold text-white">Latest</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* New entry button */}
              <Link 
                href="/dashboard/journal/new" 
                className="flex items-center justify-center gap-3 w-full py-5 mt-6 rounded-2xl group/new relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F8A5C2]/20 via-[#E879B9]/15 to-[#F8A5C2]/20 group-hover/new:from-[#E879B9]/30 group-hover/new:to-[#F8A5C2]/30 transition-all duration-300 rounded-2xl" />
                <div className="relative flex items-center gap-3 font-bold text-[#C74585] group-hover/new:text-[#DB5F9A] transition-colors">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/10 group-hover/new:scale-110 transition-transform">
                    <Plus className="h-5 w-5" />
                  </div>
                  Write New Entry
                  <Sparkles className="h-5 w-5 group-hover/new:animate-spin" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
