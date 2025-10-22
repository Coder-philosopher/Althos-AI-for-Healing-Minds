'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { getJournalById, updateJournal, deleteJournal, getJournalCoaching } from '@/lib/api'
import { AudioPlayer } from '@/components/AudioPlayer'
import { Journal } from '@/lib/types'
import { 
  ArrowLeft, Edit2, Trash2, Save, X, Calendar, Clock, Tag, 
  Heart, Zap, Bot, BookOpen, MoreVertical, Share2, Download,
  Sparkles, CheckCircle, Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

// Add this type
type AIResponse = {
  empathy: string
  reframe: string
  actions: Array<{
    title: string
    steps: string[]
    duration_mins: number
    category: string
  }>
  risk: 'none' | 'low' | 'med' | 'high'
}

export default function JournalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // AI Response state
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [showAIResponse, setShowAIResponse] = useState(false)
  
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    tags: '',
    mood: {
      valence: [0],
      arousal: [0.5]
    }
  })

  useEffect(() => {
    if (user && params.uuid) {
      loadJournal()
    }
  }, [user, params.uuid])

  const loadJournal = async () => {
    try {
      setLoading(true)
      const response = await getJournalById(user!.id, params.uuid as string)
      setJournal(response.data)
      setEditData({
        title: response.data.title || '',
        content: response.data.content || '',
        tags: response.data.tags?.join(', ') || '',
        mood: {
          valence: [response.data.mood_valence ?? 0],
          arousal: [response.data.mood_arousal ?? 0.5]
        }
      })
    } catch (error) {
      console.error('Failed to load journal:', error)
      router.push('/dashboard/journal')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAISupport = async () => {
    if (!user || !journal) return
    
    try {
      setLoadingAI(true)
      const response = await getJournalCoaching(user.id, journal.id)
      setAiResponse(response.data)
      setShowAIResponse(true)
    } catch (error) {
      console.error('Failed to get AI support:', error)
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSave = async () => {
    if (!user || !journal) return

    try {
      const tags = editData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await updateJournal(user.id, journal.id, {
        title: editData.title || undefined,
        content: editData.content,
        tags: tags.length > 0 ? tags : undefined,
        mood: {
          valence: editData.mood.valence[0],
          arousal: editData.mood.arousal[0]
        }
      })
      
      await loadJournal()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update journal:', error)
    }
  }

  const handleDelete = async () => {
    if (!user || !journal) return

    try {
      await deleteJournal(user.id, journal.id)
      router.push('/dashboard/journal')
    } catch (error) {
      console.error('Failed to delete journal:', error)
    }
  }

  const getMoodEmoji = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '😐'
    const emojis = { '-2': '😢', '-1': '😞', '0': '😐', '1': '😊', '2': '😄' }
    return emojis[val.toString() as keyof typeof emojis] || '😐'
  }

  const getEnergyEmoji = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '😌'
    if (val < 0.3) return '😴'
    if (val < 0.7) return '😌'
    return '⚡'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 border-red-300 text-red-700'
      case 'med': return 'bg-orange-100 border-orange-300 text-orange-700'
      case 'low': return 'bg-yellow-100 border-yellow-300 text-yellow-700'
      default: return 'bg-green-100 border-green-300 text-green-700'
    }
  }

  const wordCount = journal?.content.trim().split(/\s+/).filter(word => word.length > 0).length || 0

  if (loading) {
    return (
      <div className={`${montserrat.className} max-w-5xl mx-auto space-y-8`}>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-[#FFB8E0]/30 rounded-2xl w-1/3"></div>
          <div className="h-64 bg-[#FFB8E0]/30 rounded-3xl"></div>
          <div className="h-96 bg-[#FFB8E0]/30 rounded-3xl"></div>
        </div>
      </div>
    )
  }

  if (!journal) {
    return null
  }

  return (
    <div className={`${montserrat.className} max-w-5xl mx-auto space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[30%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/journal" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985]">Journal Entry</h1>
            <p className="text-[#BE5985]/70 mt-1">{formatDate(journal.created_at)}</p>
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Edit2 className="h-4 w-4" />
              <span className="font-semibold">Edit</span>
            </button>
            
            <button
            title='button'
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-white/80 backdrop-blur-md border border-red-200/40 text-red-500 hover:text-red-600 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Save className="h-4 w-4" />
              <span className="font-semibold">Save</span>
            </button>
            
            <button
            title='button'
              onClick={() => setIsEditing(false)}
              className="p-2 bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="p-8 rounded-3xl bg-white border border-[#FFB8E0]/40 shadow-2xl max-w-md mx-4">
            <h3 className="text-2xl font-bold text-[#BE5985] mb-4">Delete Entry?</h3>
            <p className="text-[#BE5985]/70 mb-6 leading-relaxed">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-red-600 transition-all duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-[#FFB8E0]/30 text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFB8E0]/50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg">
          <div className="flex items-center gap-2 text-[#BE5985]/70 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Created</span>
          </div>
          <div className="text-lg font-bold text-[#BE5985]">{formatDate(journal.created_at)}</div>
          <div className="text-sm text-[#BE5985]/60">{formatTime(journal.created_at)}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg">
          <div className="flex items-center gap-2 text-[#BE5985]/70 text-sm mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Word Count</span>
          </div>
          <div className="text-2xl font-bold text-[#BE5985]">{wordCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg">
          <div className="flex items-center gap-2 text-[#BE5985]/70 text-sm mb-1">
            <Heart className="h-4 w-4" />
            <span>Mood</span>
          </div>
          <div className="text-2xl font-bold text-[#BE5985]">
            {getMoodEmoji(journal.mood_valence)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg">
          <div className="flex items-center gap-2 text-[#BE5985]/70 text-sm mb-1">
            <Zap className="h-4 w-4" />
            <span>Energy</span>
          </div>
          <div className="text-2xl font-bold text-[#BE5985]">
            {getEnergyEmoji(journal.mood_arousal)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 relative z-10">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 space-y-6">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <div>
                <h2 className="text-3xl font-bold text-[#BE5985] mb-6">
                  {journal.title || 'Untitled Entry'}
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#BE5985] leading-relaxed whitespace-pre-wrap">
                    {journal.content}
                  </p>
                </div>
              </div>

              {journal.tags && journal.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-[#EC7FA9]" />
                    <span className="text-sm font-semibold text-[#BE5985]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-sm font-medium border border-[#FFB8E0]/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Edit Mode - same as before */}
              <div>
                <input
                  type="text"
                  placeholder="Entry title..."
                  className="w-full px-0 py-4 text-3xl font-bold text-[#BE5985] placeholder-[#BE5985]/50 bg-transparent border-0 border-b-2 border-[#FFB8E0]/40 focus:border-[#EC7FA9] focus:outline-none transition-colors duration-300"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <textarea
                  placeholder="Write your thoughts..."
                  className="w-full px-6 py-6 min-h-[400px] text-base leading-relaxed text-[#BE5985] placeholder-[#BE5985]/50 bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] resize-none transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                  value={editData.content}
                  onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-[#EC7FA9]" />
                  <label className="text-sm font-semibold text-[#BE5985]">Tags</label>
                </div>
                <input
                  type="text"
                  placeholder="e.g., stress, family, work"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                  value={editData.tags}
                  onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              {/* Mood Sliders */}
              <div className="grid md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/40">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#BE5985] flex items-center gap-2">
                      <span className="text-xl">{getMoodEmoji(editData.mood.valence[0])}</span>
                      Mood
                    </label>
                  </div>
                  <Slider
                    value={editData.mood.valence}
                    onValueChange={(value) => setEditData(prev => ({
                      ...prev,
                      mood: { ...prev.mood, valence: value }
                    }))}
                    min={-2}
                    max={2}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-[#BE5985]/70">
                    <span>😢</span>
                    <span>😐</span>
                    <span>😄</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#BE5985] flex items-center gap-2">
                      <span className="text-xl">{getEnergyEmoji(editData.mood.arousal[0])}</span>
                      Energy
                    </label>
                  </div>
                  <Slider
                    value={editData.mood.arousal}
                    onValueChange={(value) => setEditData(prev => ({
                      ...prev,
                      mood: { ...prev.mood, arousal: value }
                    }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-[#BE5985]/70">
                    <span>😴</span>
                    <span>😌</span>
                    <span>⚡</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Support Section */}
      {!isEditing && (
  <div className="space-y-6 relative z-10">
    {!showAIResponse ? (
      <button
        onClick={handleGetAISupport}
        disabled={loadingAI}
        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingAI ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Generating AI Support...
          </>
        ) : (
          <>
            <Bot className="h-5 w-5" />
            Get AI Support for This Entry
          </>
        )}
      </button>
    ) : aiResponse && (
      <div className="space-y-6">
        {/* Risk Alert */}
        {aiResponse.risk !== 'none' && (
          <div className={`p-4 rounded-2xl border-2 ${getRiskColor(aiResponse.risk)}`}>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-1">
                  {aiResponse.risk === 'high' && 'Important: Please Seek Professional Help'}
                  {aiResponse.risk === 'med' && 'We Care About Your Well-being'}
                  {aiResponse.risk === 'low' && 'You\'re Not Alone'}
                </div>
                <p className="text-sm">
                  {aiResponse.risk === 'high' && 'If you\'re having thoughts of self-harm, please reach out to a mental health professional or call a crisis helpline immediately.'}
                  {aiResponse.risk === 'med' && 'Consider speaking with a counselor or therapist who can provide professional support.'}
                  {aiResponse.risk === 'low' && 'Remember, it\'s okay to ask for help when you need it.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empathy Section */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg flex-shrink-0">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#BE5985] mb-3">We Hear You</h3>
              <p className="text-[#BE5985] leading-relaxed">{aiResponse.empathy}</p>
            </div>
          </div>
        </div>

        {/* Reframe Section */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#BE5985] mb-3">A Different Perspective</h3>
              <p className="text-[#BE5985] leading-relaxed">{aiResponse.reframe}</p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#BE5985]">Try These Activities</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {aiResponse.actions.map((action, index) => (
              <div key={index} className="p-5 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/40">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-[#BE5985] text-lg">{action.title}</h4>
                  <span className="px-3 py-1 bg-[#EC7FA9]/20 text-[#BE5985] rounded-full text-xs font-medium">
                    {action.duration_mins} min
                  </span>
                </div>
                <ol className="space-y-2">
                  {action.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-sm text-[#BE5985]/80">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EC7FA9]/30 text-[#BE5985] flex items-center justify-center text-xs font-bold">
                        {stepIndex + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Player - NEW */}
        <AudioPlayer journalId={journal.id} defaultLanguage="en" />

        {/* Close AI Response Button */}
        <button
          onClick={() => setShowAIResponse(false)}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFB8E0]/30 text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFB8E0]/50 transition-all duration-300"
        >
          <X className="h-4 w-4" />
          Hide AI Response
        </button>
      </div>
    )}
  </div>
)}

    </div>
  )
}
