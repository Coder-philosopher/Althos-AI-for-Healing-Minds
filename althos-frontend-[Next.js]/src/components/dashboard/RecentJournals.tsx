'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getJournals } from '@/lib/api'
import { Journal } from '@/lib/types'
import { PenTool, ArrowRight, BookOpen, Plus, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export function RecentJournals() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

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
    return journalDate.toLocaleDateString()
  }

  return (
    <div className={`${montserrat.className} p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500`}>
      {/* Floating background elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            Recent Journals
          </h3>
          <Link 
            href="/dashboard/journal" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEDFA]/60 hover:bg-[#FFB8E0]/40 border border-[#FFB8E0]/40 text-[#BE5985] hover:text-[#EC7FA9] text-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-[#FFB8E0]/30"
          >
            <BookOpen className="h-4 w-4" />
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse p-6 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/30">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-[#FFB8E0]/40 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#FFB8E0]/40 rounded w-3/4"></div>
                    <div className="h-3 bg-[#FFB8E0]/30 rounded w-1/2"></div>
                    <div className="h-3 bg-[#FFB8E0]/30 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/10 rounded-2xl blur-xl"></div>
            <div className="relative z-10">
              <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <PenTool className="h-12 w-12 text-[#BE5985]/50" />
              </div>
              <h4 className="text-lg font-semibold text-[#BE5985] mb-3">Start Your Journey</h4>
              <p className="text-[#BE5985]/70 mb-6 leading-relaxed">
                No journal entries yet. Begin documenting your thoughts and feelings.
              </p>
              <Link 
                href="/dashboard/journal/new" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Write Your First Entry
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {journals.map((journal, index) => (
              <div 
                key={journal.id} 
                className="group p-6 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/30 hover:border-[#EC7FA9]/50 hover:shadow-lg hover:shadow-[#FFB8E0]/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-xl bg-white/80 shadow-inner group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Calendar className="h-5 w-5 text-[#EC7FA9]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-[#BE5985] group-hover:text-[#EC7FA9] transition-colors duration-300 truncate">
                        {journal.title || 'Untitled Entry'}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-[#BE5985]/50 group-hover:text-[#EC7FA9] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                    </div>
                    
                    <p className="text-[#BE5985]/70 text-sm line-clamp-2 leading-relaxed mb-3">
                      {journal.content.substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-[#BE5985]/60">
                        <Clock className="h-3 w-3" />
                        <time>{getRelativeTime(journal.created_at)}</time>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-[#FFB8E0]/40 text-[#BE5985] font-medium">
                        {journal.content.length > 500 ? 'Long read' : 'Quick read'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link 
              href="/dashboard/journal/new" 
              className="flex items-center justify-center gap-2 w-full py-4 mt-6 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Write New Entry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
