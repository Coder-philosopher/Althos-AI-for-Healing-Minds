'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getJournals } from '@/lib/api'
import { Journal } from '@/lib/types'
import { PenTool, Plus, Search, Filter, Calendar,Bot, Clock, Tag, TrendingUp, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function JournalPage() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'mood' | 'title'>('date')
  const [filterMood, setFilterMood] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all')

  useEffect(() => {
    if (user) {
      getJournals(user.id, 50).then(data => {
        setJournals(data.data)
        setLoading(false)
      })
    }
  }, [user])

  const filteredJournals = journals
    .filter(journal => {
      const matchesSearch = journal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           journal.content.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (!matchesSearch) return false
      
      if (filterMood === 'all') return true
      if (filterMood === 'positive') return (journal.mood_valence || 0) > 0
      if (filterMood === 'neutral') return (journal.mood_valence || 0) === 0
      if (filterMood === 'negative') return (journal.mood_valence || 0) < 0
      
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'mood') return (b.mood_valence || 0) - (a.mood_valence || 0)
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
      return 0
    })

  const getJournalStats = () => {
    const total = journals.length
    const thisWeek = journals.filter(j => {
      const date = new Date(j.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length
    
    const avgMood = journals.reduce((sum, j) => sum + (j.mood_valence || 0), 0) / (journals.length || 1)
    
    return { total, thisWeek, avgMood }
  }

  const stats = getJournalStats()

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <PenTool className="h-8 w-8 text-white" />
            </div>
            Your Journal
          </h1>
          <p className="text-[#BE5985]/70 leading-relaxed">
            Express your thoughts and get personalized AI support for your wellness journey
          </p>
        </div>
        <Link 
          href="/dashboard/journal/new" 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10">New Entry</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200/50">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#BE5985]">{stats.total}</div>
              <div className="text-sm text-[#BE5985]/70">Total Entries</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200/50">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#BE5985]">{stats.thisWeek}</div>
              <div className="text-sm text-[#BE5985]/70">This Week</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#BE5985]">
                {stats.avgMood > 0 ? '😊' : stats.avgMood < 0 ? '😞' : '😐'}
              </div>
              <div className="text-sm text-[#BE5985]/70">Avg Mood</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 relative z-10">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#BE5985]/50 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your journal entries..."
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
            >
              <option value="date">Sort by Date</option>
              <option value="mood">Sort by Mood</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Filter */}
          <div className="md:col-span-3">
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
            >
              <option value="all">All Moods</option>
              <option value="positive">Positive 😊</option>
              <option value="neutral">Neutral 😐</option>
              <option value="negative">Low 😞</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal List */}
      <div className="space-y-6 relative z-10">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-[#FFB8E0]/40 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-[#FFB8E0]/40 rounded w-1/2"></div>
                    <div className="h-4 bg-[#FFB8E0]/30 rounded w-full"></div>
                    <div className="h-4 bg-[#FFB8E0]/30 rounded w-3/4"></div>
                    <div className="h-3 bg-[#FFB8E0]/30 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/10 rounded-3xl blur-xl"></div>
            <div className="relative z-10">
              <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <PenTool className="h-12 w-12 text-[#BE5985]/50" />
              </div>
              <h3 className="text-xl font-bold text-[#BE5985] mb-3">
                {searchTerm ? 'No matching entries found' : 'Start Your Wellness Journey'}
              </h3>
              <p className="text-[#BE5985]/70 mb-8 leading-relaxed max-w-md mx-auto">
                {searchTerm 
                  ? 'Try different search terms or create a new entry to document your thoughts'
                  : 'Writing can help you process thoughts and emotions. Start with anything on your mind.'
                }
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
          filteredJournals.map((journal, index) => (
            <JournalCard key={journal.id} journal={journal} index={index} />
          ))
        )}
      </div>
    </div>
  )
}

function JournalCard({ journal, index }: { journal: Journal; index: number }) {
  const moodEmoji = journal.mood_valence !== undefined && journal.mood_valence !== null
    ? journal.mood_valence <= -1 ? '😢' : journal.mood_valence < 1 ? '😐' : '😊'
    : null

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const journalDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - journalDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return journalDate.toLocaleDateString()
  }

  const wordCount = journal.content.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <div 
      className="group p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Floating background element */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[#BE5985] group-hover:text-[#EC7FA9] transition-colors duration-300 truncate">
                  {journal.title || 'Untitled Entry'}
                </h3>
                {moodEmoji && (
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{moodEmoji}</span>
                )}
              </div>
              <Star className="h-4 w-4 text-[#BE5985]/50 group-hover:text-[#EC7FA9] group-hover:fill-current transition-all duration-300 flex-shrink-0 ml-2" />
            </div>
            
            <p className="text-[#BE5985]/70 text-sm line-clamp-3 leading-relaxed mb-4">
              {journal.content}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[#BE5985]/60">
                  <Clock className="h-3 w-3" />
                  <time>{getRelativeTime(journal.created_at)}</time>
                </div>
                <div className="flex items-center gap-1 text-[#BE5985]/60">
                  <BookOpen className="h-3 w-3" />
                  <span>{wordCount} words</span>
                </div>
              </div>
              
              {journal.tags && journal.tags.length > 0 && (
                <div className="flex gap-1 max-w-xs overflow-hidden">
                  {journal.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-xs font-medium border border-[#FFB8E0]/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {journal.tags.length > 3 && (
                    <span className="px-2 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-xs font-medium border border-[#FFB8E0]/50">
                      +{journal.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Link 
          href={`/dashboard/journal/coach?entry=${journal.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5"
        >
          <Bot className="h-4 w-4" />
          Get AI Support
        </Link>
      </div>
    </div>
  )
}
