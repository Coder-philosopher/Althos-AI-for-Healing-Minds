'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { recordDailyMood, getMoodAtlas } from '@/lib/api'
import { Slider } from '@/components/ui/slider'
import { Smile, Calendar, TrendingUp, Map, Sparkles, Star, Heart, Zap, Target, Trophy, Clock, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function MoodPage() {
  const { user } = useAuth()
  const [todayMood, setTodayMood] = useState({
    valence: [0],
    arousal: [0.5]
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentMoods, setRecentMoods] = useState([])
  const [weekStreak, setWeekStreak] = useState(5)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastSubmissionTime, setLastSubmissionTime] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Check if already submitted today
      const today = new Date().toISOString().split('T')[0]
      const lastSubmission = sessionStorage.getItem(`mood_${user.id}_${today}`)
      if (lastSubmission) {
        setSubmitted(true)
        setLastSubmissionTime(lastSubmission)
      }

      // Load recent moods
      loadRecentMoods()
    }
  }, [user])

  const loadRecentMoods = async () => {
    if (!user) return
    
    try {
      const toDate = new Date().toISOString().split('T')[0]
      const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const response = await getMoodAtlas(user.id, fromDate, toDate)
      // Process mood data for display
    } catch (error) {
      console.error('Failed to load moods:', error)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    setIsAnimating(true)
    
    try {
      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toLocaleTimeString()
      
      await recordDailyMood(user.id, {
        date: today,
        valence: todayMood.valence[0],
        arousal: todayMood.arousal[0]
      })
      
      setSubmitted(true)
      setLastSubmissionTime(now)
      sessionStorage.setItem(`mood_${user.id}_${today}`, now)
      
      // Celebration animation
      setTimeout(() => setIsAnimating(false), 2000)
    } catch (error) {
      console.error('Failed to record mood:', error)
      setIsAnimating(false)
    } finally {
      setLoading(false)
    }
  }

  const getMoodDescription = () => {
    const v = todayMood.valence[0]
    const a = todayMood.arousal[0]
    
    if (v >= 1 && a >= 0.7) return { text: 'Excited & Happy', color: 'text-green-600', emoji: '🤗', bgGradient: 'from-green-50 to-emerald-100' }
    if (v >= 1 && a < 0.4) return { text: 'Content & Peaceful', color: 'text-blue-600', emoji: '😌', bgGradient: 'from-blue-50 to-sky-100' }
    if (v <= -1 && a >= 0.7) return { text: 'Stressed & Anxious', color: 'text-red-600', emoji: '😰', bgGradient: 'from-red-50 to-pink-100' }
    if (v <= -1 && a < 0.4) return { text: 'Sad & Low', color: 'text-purple-600', emoji: '😔', bgGradient: 'from-purple-50 to-violet-100' }
    if (a >= 0.7) return { text: 'Energetic', color: 'text-orange-600', emoji: '⚡', bgGradient: 'from-orange-50 to-amber-100' }
    if (a < 0.3) return { text: 'Calm & Relaxed', color: 'text-green-600', emoji: '😊', bgGradient: 'from-green-50 to-teal-100' }
    return { text: 'Balanced', color: 'text-blue-600', emoji: '😐', bgGradient: 'from-blue-50 to-indigo-100' }
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: 'Good morning', icon: Sun, color: 'text-yellow-600' }
    if (hour < 18) return { greeting: 'Good afternoon', icon: Sun, color: 'text-orange-600' }
    return { greeting: 'Good evening', icon: Moon, color: 'text-purple-600' }
  }

  const mood = getMoodDescription()
  const timeInfo = getTimeBasedGreeting()
  const TimeIcon = timeInfo.icon

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Smile className="h-8 w-8 text-white" />
              </div>
              Mood Tracking
            </h1>
            <p className="text-[#BE5985]/70 leading-relaxed flex items-center gap-2">
              <TimeIcon className={`h-4 w-4 ${timeInfo.color}`} />
              {timeInfo.greeting}! Track your emotional state and discover patterns over time
            </p>
          </div>
          
          {/* Streak Counter */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md">
            <Trophy className="h-5 w-5 text-[#EC7FA9]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#BE5985]">{weekStreak}</div>
              <div className="text-xs text-[#BE5985]/70">day streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Today's Mood Entry */}
        <div className="xl:col-span-2">
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            {/* Floating background element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Today's Mood Check
                </h3>
                {lastSubmissionTime && (
                  <div className="px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
                    <span className="text-xs font-medium text-[#BE5985]">Last: {lastSubmissionTime}</span>
                  </div>
                )}
              </div>

              {submitted ? (
                <div className="text-center py-12 relative">
                  {isAnimating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-[#EC7FA9]/20 border-t-[#EC7FA9] rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className={`transition-all duration-1000 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                    <div className="text-8xl mb-6 animate-bounce">{mood.emoji}</div>
                    <div className="mb-4">
                      <Star className="h-6 w-6 text-[#EC7FA9] mx-auto mb-2 animate-pulse" />
                      <h4 className="text-2xl font-bold text-[#BE5985] mb-2">
                        Thanks for checking in! ✨
                      </h4>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${mood.bgGradient}/40 border border-[#FFB8E0]/40 mb-6`}>
                      <p className="text-[#BE5985]/80 text-lg">
                        You recorded your mood as <span className={`font-bold ${mood.color}`}>{mood.text}</span> today.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        sessionStorage.removeItem(`mood_${user?.id}_${new Date().toISOString().split('T')[0]}`)
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5"
                    >
                      Update Mood
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Current Mood Display */}
                  <div className={`text-center py-8 bg-gradient-to-br ${mood.bgGradient}/40 backdrop-blur-sm rounded-2xl border border-[#FFB8E0]/40 relative overflow-hidden group/mood`}>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg group-hover/mood:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="text-7xl mb-4 transition-transform duration-300 group-hover/mood:scale-110">{mood.emoji}</div>
                      <h4 className={`text-2xl font-bold ${mood.color} mb-3 transition-colors duration-300`}>
                        {mood.text}
                      </h4>
                      <div className="flex items-center justify-center gap-4 text-sm text-[#BE5985]/70">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-[#EC7FA9]" />
                          <span>Mood: {todayMood.valence[0] > 0 ? '+' + todayMood.valence[0] : todayMood.valence[0]}</span>
                        </div>
                        <div className="w-px h-4 bg-[#FFB8E0]/40"></div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-[#EC7FA9]" />
                          <span>Energy: {Math.round(todayMood.arousal[0] * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mood Sliders */}
                  <div className="space-y-8">
                    {/* Valence Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-bold text-[#BE5985] flex items-center gap-2">
                          <span className="text-xl">😞</span>
                          How are you feeling emotionally?
                          <span className="text-xl">😊</span>
                        </label>
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                          <span className="text-sm font-medium text-[#BE5985]">
                            {todayMood.valence[0] === -2 ? 'Very Low' : 
                             todayMood.valence[0] === -1 ? 'Low' :
                             todayMood.valence[0] === 0 ? 'Neutral' :
                             todayMood.valence[0] === 1 ? 'Good' : 'Very Good'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                        <Slider
                          value={todayMood.valence}
                          onValueChange={(value) => setTodayMood(prev => ({ ...prev, valence: value }))}
                          min={-2}
                          max={2}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-3 text-sm font-medium text-[#BE5985]/70">
                          <span>😢 Very Low</span>
                          <span>😐 Neutral</span>
                          <span>😄 Very Good</span>
                        </div>
                      </div>
                    </div>

                    {/* Arousal Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-bold text-[#BE5985] flex items-center gap-2">
                          <span className="text-xl">😴</span>
                          What's your energy level?
                          <span className="text-xl">⚡</span>
                        </label>
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                          <span className="text-sm font-medium text-[#BE5985]">
                            {todayMood.arousal[0] < 0.3 ? 'Low Energy' : 
                             todayMood.arousal[0] < 0.7 ? 'Medium Energy' : 'High Energy'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                        <Slider
                          value={todayMood.arousal}
                          onValueChange={(value) => setTodayMood(prev => ({ ...prev, arousal: value }))}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-3 text-sm font-medium text-[#BE5985]/70">
                          <span>😴 Low Energy</span>
                          <span>😌 Balanced</span>
                          <span>⚡ High Energy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 transition-all duration-300 backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Recording your mood...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Record Today's Mood</span>
                        <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Tools */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-[#BE5985] mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-md shadow-[#EC7FA9]/30">
                  <Target className="h-4 w-4 text-white" />
                </div>
                Mood Tools
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/dashboard/mood/atlas" 
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 group/link"
                >
                  <div className="p-2 rounded-lg bg-white/60 group-hover/link:bg-white/80 transition-colors duration-300">
                    <Map className="h-4 w-4" />
                  </div>
                  <span>View Mood Atlas</span>
                  <Sparkles className="h-3 w-3 ml-auto group-hover/link:rotate-180 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href="/dashboard/mood/trends" 
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 group/link"
                >
                  <div className="p-2 rounded-lg bg-white/60 group-hover/link:bg-white/80 transition-colors duration-300">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span>View Trends</span>
                  <Star className="h-3 w-3 ml-auto group-hover/link:fill-current transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mood Tip */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md border border-blue-200/50 shadow-xl shadow-blue-200/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            <Sparkles className="absolute top-4 right-4 h-4 w-4 text-blue-400/60 animate-pulse" />
            
            <div className="relative z-10">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-200 shadow-inner">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                💡 Mood Tip
              </h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Regular mood tracking helps you notice patterns and triggers. 
                Even 30 seconds daily can provide valuable insights for your mental wellness journey!
              </p>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h4 className="font-bold text-[#BE5985] mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#EC7FA9]" />
                This Week
              </h4>
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="text-3xl font-bold text-[#BE5985] mb-1">5/7</div>
                  <div className="w-full bg-[#FFB8E0]/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] h-2 rounded-full transition-all duration-1000" style={{ width: '71%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-[#BE5985]/70">
                  Days tracked this week
                </p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1,2,3,4,5].map(day => (
                    <div key={day} className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-pulse" style={{ animationDelay: `${day * 200}ms` }}></div>
                  ))}
                  {[6,7].map(day => (
                    <div key={day} className="w-2 h-2 bg-[#FFB8E0]/40 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
