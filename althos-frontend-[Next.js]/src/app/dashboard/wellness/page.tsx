'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getWeeklySummary } from '@/lib/api'
import { 
  Brain, Heart, Star, Headphones, Calendar, Clock, Shield, Phone,
  Sparkles, Award, Target, Zap, Sun, Moon, Play, Pause, Volume2,
  ChevronRight, TrendingUp, Book, Smile, RefreshCw, Download
} from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function WellnessPage() {
  const { user } = useAuth()
  const [weeklySummary, setWeeklySummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [showKindnessDetails, setShowKindnessDetails] = useState(false)
  
  const generateSummary = async (withAudio = false) => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await getWeeklySummary(user.id, withAudio)
      setWeeklySummary(response.data)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: 'Good morning', icon: Sun, color: 'text-yellow-600' }
    if (hour < 18) return { greeting: 'Good afternoon', icon: Sun, color: 'text-orange-600' }
    return { greeting: 'Good evening', icon: Moon, color: 'text-purple-600' }
  }

  const timeInfo = getTimeBasedGreeting()
  const TimeIcon = timeInfo.icon

  // Mock kindness highlights with enhanced data
  const kindnessHighlights = [
    {
      id: 1,
      text: "Helped my roommate with their project when they were stressed",
      source: "journal entry",
      date: "2 days ago",
      sentiment: "positive",
      color: "from-green-50 to-emerald-100",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      category: "Supporting Others"
    },
    {
      id: 2,
      text: "Called my parents even though I was busy - they sounded happy",
      source: "journal entry", 
      date: "4 days ago",
      sentiment: "nurturing",
      color: "from-blue-50 to-sky-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      category: "Family Connection"
    },
    {
      id: 3,
      text: "Practiced guitar for 30 minutes - felt good to create something",
      source: "mood entry",
      date: "1 week ago",
      sentiment: "creative",
      color: "from-purple-50 to-violet-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      category: "Self-Care"
    }
  ]

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[60%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Enhanced Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Brain className="h-8 w-8 text-white" />
              </div>
              Wellness Hub
            </h1>
            <p className="text-[#BE5985]/70 leading-relaxed flex items-center gap-2">
              <TimeIcon className={`h-4 w-4 ${timeInfo.color}`} />
              {timeInfo.greeting}! AI-powered insights, support resources, and personalized wellness tools
            </p>
          </div>
          
          {/* Wellness Score Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#FFB8E0"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#EC7FA9"
                  strokeWidth="2"
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#BE5985]">72%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#BE5985]">Wellness</div>
              <div className="text-xs text-[#BE5985]/70">Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Enhanced Weekly Summary */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
            <Sparkles className="absolute top-6 right-6 h-5 w-5 text-[#EC7FA9]/60 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Weekly Growth Story
                </h3>
                <button
                  onClick={() => generateSummary(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group/btn"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Headphones className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      Generate Summary
                      <Sparkles className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-300" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {weeklySummary ? (
                <div className="space-y-6">
                  {/* Summary Content */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50/90 to-emerald-100/50 border border-green-200/50 shadow-inner relative overflow-hidden group/summary">
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-lg group-hover/summary:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-200 shadow-inner">
                          <Star className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                            {weeklySummary.metaphor}
                            <Award className="h-4 w-4 text-green-600" />
                          </h4>
                          <p className="text-green-700 leading-relaxed">
                            {weeklySummary.summary_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Player */}
                  {weeklySummary.audio_url && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-200/50 shadow-inner relative overflow-hidden">
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-indigo-300/20 rounded-full blur-lg animate-pulse" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-blue-200 shadow-inner">
                            <Headphones className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-bold text-blue-800">Listen to Your Story</span>
                          <Volume2 className="h-4 w-4 text-blue-600" />
                        </div>
                        
                        <div className="bg-white/80 rounded-xl p-4 border border-blue-200/50">
                          <audio 
                            controls 
                            className="w-full h-10 rounded-lg"
                            src={weeklySummary.audio_url}
                            onPlay={() => setIsPlayingAudio(true)}
                            onPause={() => setIsPlayingAudio(false)}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Period Info */}
                  <div className="flex items-center justify-between text-sm text-[#BE5985]/70 p-3 rounded-lg bg-[#FFEDFA]/50 border border-[#FFB8E0]/30">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#EC7FA9]" />
                      <span>Generated for period: {weeklySummary.period.from} to {weeklySummary.period.to}</span>
                    </div>
                    <button className="flex items-center gap-1 text-[#EC7FA9] hover:text-[#BE5985] transition-colors duration-300">
                      <Download className="h-3 w-3" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/10 rounded-2xl blur-xl"></div>
                  <div className="relative z-10">
                    <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-[#BE5985]/50" />
                    </div>
                    <h4 className="text-xl font-bold text-[#BE5985] mb-3">
                      Generate Your Weekly Story
                    </h4>
                    <p className="text-[#BE5985]/70 mb-8 leading-relaxed max-w-md mx-auto">
                      Get an AI-generated reflection on your emotional journey this week, 
                      complete with insights and optional audio narration.
                    </p>
                    <button
                      onClick={() => generateSummary(true)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Star className="h-4 w-4" />
                      Create My Story
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Kindness Highlights */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  Kindness Highlights
                </h3>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
                    <span className="text-sm font-medium text-[#BE5985]">{kindnessHighlights.length} moments</span>
                  </div>
                  <Link 
                    href="/dashboard/wellness/kindness" 
                    className="flex items-center gap-1 text-[#EC7FA9] hover:text-[#BE5985] text-sm font-medium transition-colors duration-300"
                  >
                    View All
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {kindnessHighlights.map((highlight, index) => (
                  <div
                    key={highlight.id}
                    className={`group/highlight p-6 rounded-2xl bg-gradient-to-br ${highlight.color} border ${highlight.borderColor} hover:shadow-lg hover:shadow-[#FFB8E0]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg group-hover/highlight:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-lg bg-white/80 shadow-inner group-hover/highlight:scale-110 transition-transform duration-300">
                            <Heart className="h-4 w-4 text-[#EC7FA9]" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className={`${highlight.textColor} font-medium mb-2 leading-relaxed group-hover/highlight:text-opacity-90 transition-all duration-300`}>
                                "{highlight.text}"
                              </p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className={`${highlight.textColor.replace('800', '600')} font-medium px-2 py-1 rounded-full bg-white/60`}>
                                  {highlight.category}
                                </span>
                                <span className={`${highlight.textColor.replace('800', '600')}`}>
                                  From {highlight.source} • {highlight.date}
                                </span>
                              </div>
                            </div>
                            <Sparkles className={`h-4 w-4 ${highlight.textColor.replace('800', '600')} group-hover/highlight:rotate-180 transition-transform duration-500`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                href="/dashboard/wellness/kindness" 
                className="flex items-center justify-center gap-2 w-full py-4 mt-6 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5"
              >
                <Heart className="h-4 w-4" />
                Discover More Kindness
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Crisis Support */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50/90 to-pink-50/90 backdrop-blur-md border border-red-200/50 shadow-xl shadow-red-200/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-red-200/30 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-200/30 to-pink-200/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            <Sparkles className="absolute top-4 right-4 h-4 w-4 text-red-400/60 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-red-200 shadow-inner">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-bold text-red-800">Need Support?</h3>
              </div>
              <p className="text-red-700 text-sm mb-6 leading-relaxed">
                If you're experiencing crisis or having thoughts of self-harm, help is available 24/7.
              </p>
              <div className="space-y-3 mb-6">
                <a 
                  href="tel:14416" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-red-200/50 text-red-800 hover:text-red-900 text-sm font-medium transition-all duration-300 hover:shadow-md group/phone"
                >
                  <Phone className="h-4 w-4 group-hover/phone:scale-110 transition-transform duration-300" />
                  <div>
                    <div className="font-bold">Tele-MANAS: 14416</div>
                    <div className="text-xs text-red-600">National mental health helpline</div>
                  </div>
                </a>
                <a 
                  href="tel:18005990019" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-red-200/50 text-red-800 hover:text-red-900 text-sm font-medium transition-all duration-300 hover:shadow-md group/phone"
                >
                  <Phone className="h-4 w-4 group-hover/phone:scale-110 transition-transform duration-300" />
                  <div>
                    <div className="font-bold">Kiran: 1800-599-0019</div>
                    <div className="text-xs text-red-600">Multilingual support available</div>
                  </div>
                </a>
              </div>
              <Link 
                href="/dashboard/wellness/distress" 
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Shield className="h-4 w-4" />
                Get More Resources
              </Link>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-[#BE5985] mb-6 flex items-center gap-2">
                <Target className="h-4 w-4 text-[#EC7FA9]" />
                Wellness Tools
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/dashboard/journal/new" 
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 group/tool"
                >
                  <div className="p-2 rounded-lg bg-white/60 group-hover/tool:bg-white/80 transition-colors duration-300">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>5-Min Journal</span>
                  <ChevronRight className="h-3 w-3 ml-auto group-hover/tool:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <button className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 group/tool">
                  <div className="p-2 rounded-lg bg-white/60 group-hover/tool:bg-white/80 transition-colors duration-300">
                    <Brain className="h-4 w-4" />
                  </div>
                  <span>Breathing Exercise</span>
                  <Zap className="h-3 w-3 ml-auto group-hover/tool:scale-110 transition-transform duration-300" />
                </button>
                
                <Link 
                  href="/dashboard/wellness/summary" 
                  className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 group/tool"
                >
                  <div className="p-2 rounded-lg bg-white/60 group-hover/tool:bg-white/80 transition-colors duration-300">
                    <Star className="h-4 w-4" />
                  </div>
                  <span>Growth Insights</span>
                  <TrendingUp className="h-3 w-3 ml-auto group-hover/tool:rotate-12 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Wellness Score */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h4 className="font-bold text-[#BE5985] mb-4 flex items-center gap-2">
                <Smile className="h-4 w-4 text-[#EC7FA9]" />
                Current Wellness
              </h4>
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="text-3xl font-bold text-[#BE5985] mb-2">Good</div>
                  <div className="text-sm text-[#BE5985]/70 mb-3">72% wellness score</div>
                  <div className="w-full bg-[#FFB8E0]/30 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{width: '72%'}}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#BE5985]/70 leading-relaxed">
                  Based on recent mood and journal activity
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
