'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { createJournal } from '@/lib/api'
import { ArrowLeft, Save, BookOpen, Sparkles, Heart, Zap, Tag, Bot, Edit3, Clock } from 'lucide-react'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function NewJournalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mood: {
      valence: [0],
      arousal: [0.5]
    }
  })
  const [loading, setLoading] = useState(false)
  const [includeAI, setIncludeAI] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [writingTime, setWritingTime] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setWordCount(formData.content.trim().split(/\s+/).filter(word => word.length > 0).length)
  }, [formData.content])

  useEffect(() => {
    if (formData.content.length > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setWritingTime(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [formData.content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }))
    setIsTyping(true)
    setSaveStatus('unsaved')
    
    setTimeout(() => setIsTyping(false), 1000)
  }

  const getMoodEmoji = (val: number) => {
    const emojis = { '-2': '😢', '-1': '😞', '0': '😐', '1': '😊', '2': '😄' }
    return emojis[val.toString() as keyof typeof emojis] || '😐'
  }

  const getEnergyEmoji = (val: number) => {
    if (val < 0.3) return '😴'
    if (val < 0.7) return '😌'
    return '⚡'
  }

  const formatWritingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.content.trim()) return

    setLoading(true)
    setSaveStatus('saving')
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      const response = await createJournal(user.id, {
        title: formData.title || undefined,
        content: formData.content,
        mood: {
          valence: formData.mood.valence[0],
          arousal: formData.mood.arousal[0]
        },
        tags: tags.length > 0 ? tags : undefined
      })

      setSaveStatus('saved')
      
      if (includeAI) {
        router.push(`/dashboard/journal/coach?entry=${response.data.id}&text=${encodeURIComponent(formData.content)}`)
      } else {
        router.push('/dashboard/journal')
      }
    } catch (error) {
      console.error('Failed to create journal:', error)
      setSaveStatus('unsaved')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${montserrat.className} max-w-6xl mx-auto space-y-8 relative`}>
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
            <h1 className="text-3xl font-bold text-[#BE5985] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              New Journal Entry
            </h1>
            <p className="text-[#BE5985]/70 mt-1">Express your thoughts and feelings in a safe space</p>
          </div>
        </div>
        
        {/* Writing Stats */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md">
          <div className="flex items-center gap-2 text-sm text-[#BE5985]">
            <Clock className="h-4 w-4 text-[#EC7FA9]" />
            <span>{formatWritingTime(writingTime)}</span>
          </div>
          <div className="w-px h-4 bg-[#FFB8E0]/40"></div>
          <div className="flex items-center gap-2 text-sm text-[#BE5985]">
            <BookOpen className="h-4 w-4 text-[#EC7FA9]" />
            <span>{wordCount} words</span>
          </div>
          {isTyping && (
            <>
              <div className="w-px h-4 bg-[#FFB8E0]/40"></div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-bounce"></div>
                <span className="text-xs text-[#BE5985]/70">typing...</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              {/* Floating element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
              
              <div className="space-y-6 relative z-10">
                {/* Title Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Give your entry a meaningful title..."
                    className="w-full px-0 py-4 text-2xl font-bold text-[#BE5985] placeholder-[#BE5985]/50 bg-transparent border-0 border-b-2 border-[#FFB8E0]/40 focus:border-[#EC7FA9] focus:outline-none transition-colors duration-300"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  {formData.title && (
                    <Sparkles className="absolute top-4 right-2 h-5 w-5 text-[#EC7FA9]/60 animate-pulse" />
                  )}
                </div>

                {/* Content Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    placeholder="What's on your mind today? Write freely about your thoughts, feelings, experiences, or anything you'd like to process and reflect upon..."
                    className="w-full px-6 py-6 min-h-[400px] text-base leading-relaxed text-[#BE5985] placeholder-[#BE5985]/50 bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/20 border border-[#FFB8E0]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] resize-none transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                    value={formData.content}
                    onChange={handleContentChange}
                  />
                  
                  {/* Word count overlay */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-sm font-medium text-[#BE5985]">
                    {wordCount} words
                  </div>
                </div>

                {/* Tags Input */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-[#EC7FA9]" />
                    <label className="text-sm font-semibold text-[#BE5985]">Tags (optional)</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., stress, family, work, gratitude, self-care"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  />
                  <p className="text-xs text-[#BE5985]/60 mt-2">Separate tags with commas to help organize your entries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-[#BE5985] mb-6 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-md shadow-[#EC7FA9]/30">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  How are you feeling?
                </h3>
                
                <div className="space-y-6">
                  {/* Mood Valence */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-[#BE5985] flex items-center gap-2">
                        <span className="text-xl">{getMoodEmoji(formData.mood.valence[0])}</span>
                        Mood
                      </label>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                        <span className="text-xs font-medium text-[#BE5985]">
                          {formData.mood.valence[0] === -2 ? 'Very Low' : 
                           formData.mood.valence[0] === -1 ? 'Low' :
                           formData.mood.valence[0] === 0 ? 'Neutral' :
                           formData.mood.valence[0] === 1 ? 'Good' : 'Very Good'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                      <Slider
                        value={formData.mood.valence}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          mood: { ...prev.mood, valence: value }
                        }))}
                        min={-2}
                        max={2}
                        step={1}
                      />
                      <div className="flex justify-between mt-2 text-xs font-medium text-[#BE5985]/70">
                        <span>😢</span>
                        <span>😐</span>
                        <span>😄</span>
                      </div>
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-[#BE5985] flex items-center gap-2">
                        <span className="text-xl">{getEnergyEmoji(formData.mood.arousal[0])}</span>
                        <Zap className="h-4 w-4 text-[#EC7FA9]" />
                        Energy
                      </label>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                        <span className="text-xs font-medium text-[#BE5985]">
                          {formData.mood.arousal[0] < 0.3 ? 'Low' : formData.mood.arousal[0] < 0.7 ? 'Medium' : 'High'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                      <Slider
                        value={formData.mood.arousal}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          mood: { ...prev.mood, arousal: value }
                        }))}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <div className="flex justify-between mt-2 text-xs font-medium text-[#BE5985]/70">
                        <span>😴</span>
                        <span>😌</span>
                        <span>⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Options */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-[#BE5985] mb-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-md shadow-[#EC7FA9]/30">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  AI Support
                </h3>
                
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40 cursor-pointer hover:border-[#EC7FA9]/50 transition-all duration-300 group/checkbox">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={includeAI}
                      onChange={(e) => setIncludeAI(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 ${
                      includeAI
                        ? 'border-[#EC7FA9] bg-[#EC7FA9] shadow-md shadow-[#EC7FA9]/30'
                        : 'border-[#FFB8E0] group-hover/checkbox:border-[#EC7FA9]'
                    }`}>
                      {includeAI && (
                        <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#BE5985] group-hover/checkbox:text-[#EC7FA9] transition-colors duration-300">Get AI Response</span>
                    <p className="text-sm text-[#BE5985]/70 leading-relaxed mt-1">
                      Receive empathetic feedback, validation, and personalized coping strategies based on your entry
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="w-full px-6 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 transition-all duration-300 backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving your thoughts...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative z-10">
                      {includeAI ? 'Save & Get AI Support' : 'Save Entry'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Save Status */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  saveStatus === 'saved' ? 'bg-green-500' :
                  saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className="text-[#BE5985]/70">
                  {saveStatus === 'saved' ? 'All changes saved' :
                   saveStatus === 'saving' ? 'Saving...' :
                   'Unsaved changes'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
