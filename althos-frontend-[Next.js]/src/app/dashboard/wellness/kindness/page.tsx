'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Heart, ArrowLeft, Sparkles, Star, Sun, Gift, Smile, Trophy, Calendar, Bookmark, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface KindnessHighlight {
  id: string
  date: string
  type: 'achievement' | 'gratitude' | 'kindness' | 'growth' | 'connection'
  title: string
  content: string
  journalEntry: string
  aiAnalysis: string
  moodScore: number
  tags: string[]
}

export default function KindnessPage() {
  const { user } = useAuth()
  const [highlights, setHighlights] = useState<KindnessHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null)
  const [animatingCard, setAnimatingCard] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (user) {
      loadKindnessHighlights()
    }
  }, [user])

  const loadKindnessHighlights = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Mock data - in real implementation, this would come from AI analysis of journal entries
      const mockHighlights: KindnessHighlight[] = [
        {
          id: '1',
          date: '2025-10-06',
          type: 'achievement',
          title: 'Completed Challenging Project',
          content: 'You successfully finished your web development project despite facing multiple technical challenges.',
          journalEntry: 'Finally completed the backend API integration today. It was tough but I learned so much...',
          aiAnalysis: 'This entry shows remarkable persistence and growth mindset. Your ability to overcome technical challenges demonstrates resilience.',
          moodScore: 1.5,
          tags: ['persistence', 'learning', 'technical skills']
        },
        {
          id: '2',
          date: '2025-10-05',
          type: 'kindness',
          title: 'Helped a Struggling Friend',
          content: 'You took time to explain programming concepts to your friend who was having difficulty.',
          journalEntry: 'Spent 2 hours helping Rahul understand React concepts. Seeing him finally get it made my day...',
          aiAnalysis: 'Your empathy and willingness to help others shows deep compassion and leadership qualities.',
          moodScore: 1.8,
          tags: ['helping others', 'teaching', 'friendship']
        },
        {
          id: '3',
          date: '2025-10-04',
          type: 'gratitude',
          title: 'Family Support Recognition',
          content: 'You expressed genuine appreciation for your family\'s support during stressful times.',
          journalEntry: 'Really grateful for Mom\'s encouragement during my exam prep. Her support means everything...',
          aiAnalysis: 'Recognizing and expressing gratitude strengthens relationships and builds emotional resilience.',
          moodScore: 1.2,
          tags: ['gratitude', 'family', 'support']
        },
        {
          id: '4',
          date: '2025-10-03',
          type: 'growth',
          title: 'Learned from Setback',
          content: 'Instead of giving up after a failed interview, you analyzed what went wrong and planned improvements.',
          journalEntry: 'The Google interview didn\'t go well, but I identified areas to improve. Time to practice more algorithms...',
          aiAnalysis: 'Your ability to learn from setbacks and maintain a growth mindset is a valuable strength.',
          moodScore: 0.8,
          tags: ['resilience', 'learning', 'improvement']
        },
        {
          id: '5',
          date: '2025-10-02',
          type: 'connection',
          title: 'Made New Connections',
          content: 'You reached out and made meaningful connections with classmates in your new course.',
          journalEntry: 'Met some great people in the machine learning course today. We\'re planning to form a study group...',
          aiAnalysis: 'Building new relationships shows social courage and creates support networks for personal growth.',
          moodScore: 1.6,
          tags: ['networking', 'collaboration', 'social skills']
        }
      ]
      
      setHighlights(mockHighlights)
    } catch (error) {
      console.error('Failed to load kindness highlights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHighlightClick = (highlightId: string) => {
    setAnimatingCard(highlightId)
    setTimeout(() => {
      setSelectedHighlight(selectedHighlight === highlightId ? null : highlightId)
      setAnimatingCard(null)
    }, 200)
  }

  const getTypeIcon = (type: KindnessHighlight['type']) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-600" />
      case 'kindness': return <Heart className="h-5 w-5 text-red-500" />
      case 'gratitude': return <Star className="h-5 w-5 text-blue-600" />
      case 'growth': return <Sparkles className="h-5 w-5 text-purple-600" />
      case 'connection': return <Smile className="h-5 w-5 text-green-600" />
      default: return <Heart className="h-5 w-5 text-[#EC7FA9]" />
    }
  }

  const getTypeColor = (type: KindnessHighlight['type']) => {
    switch (type) {
      case 'achievement': return 'from-yellow-100 to-amber-50'
      case 'kindness': return 'from-red-100 to-pink-50'
      case 'gratitude': return 'from-blue-100 to-sky-50'
      case 'growth': return 'from-purple-100 to-violet-50'
      case 'connection': return 'from-green-100 to-emerald-50'
      default: return 'from-pink-100 to-rose-50'
    }
  }

  const getMoodEmoji = (score: number) => {
    if (score >= 1.5) return '🤗'
    if (score >= 1) return '😊'
    if (score >= 0.5) return '🙂'
    if (score >= 0) return '😌'
    return '😔'
  }

  const filteredHighlights = filterType === 'all' 
    ? highlights 
    : highlights.filter(h => h.type === filterType)

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/dashboard/wellness" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] hover:shadow-xl hover:shadow-[#EC7FA9]/25 transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Heart className="h-8 w-8 text-white" />
              </div>
              Kindness Ledger
            </h1>
            <p className="text-[#BE5985]/70 leading-relaxed">
              AI-curated moments of kindness, growth, and positivity from your journey
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { value: 'all', label: 'All Highlights', icon: Heart },
            { value: 'achievement', label: 'Achievements', icon: Trophy },
            { value: 'kindness', label: 'Acts of Kindness', icon: Heart },
            { value: 'gratitude', label: 'Gratitude', icon: Star },
            { value: 'growth', label: 'Personal Growth', icon: Sparkles },
            { value: 'connection', label: 'Connections', icon: Smile }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilterType(value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                filterType === value
                  ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg shadow-[#EC7FA9]/30'
                  : 'bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#BE5985] hover:bg-[#FFEDFA]/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#BE5985]/70 font-medium">Discovering your positive moments...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg text-center">
              <div className="text-2xl font-bold text-[#BE5985] mb-1">{highlights.length}</div>
              <div className="text-sm text-[#BE5985]/70">Total Highlights</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg text-center">
              <div className="text-2xl font-bold text-[#BE5985] mb-1">
                {highlights.filter(h => h.type === 'kindness').length}
              </div>
              <div className="text-sm text-[#BE5985]/70">Kind Acts</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg text-center">
              <div className="text-2xl font-bold text-[#BE5985] mb-1">
                {Math.round((highlights.reduce((sum, h) => sum + h.moodScore, 0) / highlights.length) * 10) / 10}
              </div>
              <div className="text-sm text-[#BE5985]/70">Avg Mood</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg text-center">
              <div className="text-2xl font-bold text-[#BE5985] mb-1">7</div>
              <div className="text-sm text-[#BE5985]/70">Days Active</div>
            </div>
          </div>

          {/* Kindness Highlights */}
          <div className="space-y-6">
            {filteredHighlights.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-[#BE5985] mb-2">No highlights yet</h3>
                <p className="text-[#BE5985]/70 mb-4">Keep journaling to discover more positive moments!</p>
                <Link 
                  href="/dashboard/journal/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                  Write Journal Entry
                </Link>
              </div>
            ) : (
              filteredHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 ${
                    selectedHighlight === highlight.id 
                      ? 'border-[#EC7FA9] shadow-xl shadow-[#EC7FA9]/25' 
                      : 'border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50'
                  } ${
                    animatingCard === highlight.id ? 'scale-95' : 'scale-100'
                  } bg-gradient-to-br ${getTypeColor(highlight.type)} backdrop-blur-sm relative overflow-hidden group`}
                  onClick={() => handleHighlightClick(highlight.id)}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm">
                          {getTypeIcon(highlight.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#BE5985] text-lg mb-1">
                            {highlight.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-[#BE5985]/70">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(highlight.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{getMoodEmoji(highlight.moodScore)}</span>
                              <span className="font-medium">
                                {highlight.moodScore > 0 ? '+' : ''}{highlight.moodScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {highlight.type === 'achievement' ? '🏆' :
                         highlight.type === 'kindness' ? '❤️' :
                         highlight.type === 'gratitude' ? '🙏' :
                         highlight.type === 'growth' ? '🌱' : '🤝'}
                      </div>
                    </div>

                    <p className="text-[#BE5985]/80 mb-4 leading-relaxed">
                      {highlight.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {highlight.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm text-xs font-medium text-[#BE5985] border border-white/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Content */}
                    {selectedHighlight === highlight.id && (
                      <div className="pt-4 border-t border-white/30 space-y-4 animate-slide-up">
                        <div>
                          <h4 className="font-semibold text-[#BE5985] mb-2 flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            Original Journal Entry
                          </h4>
                          <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
                            <p className="text-sm text-[#BE5985]/80 italic leading-relaxed">
                              "{highlight.journalEntry}"
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#BE5985] mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Insight
                          </h4>
                          <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
                            <p className="text-sm text-[#BE5985]/80 leading-relaxed">
                              {highlight.aiAnalysis}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/30 text-[#BE5985] hover:bg-white/50 rounded-xl transition-all duration-200 text-sm font-medium">
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/30 text-[#BE5985] hover:bg-white/50 rounded-xl transition-all duration-200 text-sm font-medium">
                            <Download className="h-4 w-4" />
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inspirational Message */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-yellow-50/90 to-orange-50/90 backdrop-blur-md border border-yellow-200/50 shadow-xl shadow-yellow-200/20 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-4">
              You're Building Something Beautiful
            </h3>
            <p className="text-orange-700 leading-relaxed max-w-2xl mx-auto">
              Every act of kindness, moment of gratitude, and step of growth contributes to your positive impact on the world. 
              Your kindness ledger is a testament to the light you bring to others and yourself.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-orange-600">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Spread kindness</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Practice gratitude</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Celebrate growth</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
