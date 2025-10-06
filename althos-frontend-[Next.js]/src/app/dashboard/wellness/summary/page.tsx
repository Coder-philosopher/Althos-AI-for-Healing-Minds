'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
// import { getWeeklySummary, generateWellnessSummary } from '@/lib/api'
import { FileText, ArrowLeft, Calendar, TrendingUp, Brain, Heart, Target, Download, Share2, Play, Pause, Volume2, Sparkles, Star, Award, BookOpen, Activity } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface WellnessSummary {
  id: string
  weekStart: string
  weekEnd: string
  totalEntries: number
  avgMoodScore: number
  moodTrend: 'improving' | 'stable' | 'declining'
  keyThemes: string[]
  highlights: string[]
  challenges: string[]
  aiNarrative: string
  audioUrl?: string
  recommendations: {
    category: string
    items: string[]
  }[]
  achievements: {
    title: string
    description: string
    emoji: string
  }[]
  metrics: {
    journalEntries: number
    moodLogs: number
    assessments: number
    wellnessScore: number
  }
}

export default function WellnessSummaryPage() {
  const { user } = useAuth()
  const [summaries, setSummaries] = useState<WellnessSummary[]>([])
  const [selectedSummary, setSelectedSummary] = useState<WellnessSummary | null>(null)
  const [loading, setLoading] = useState(true)
  // const [generating, setGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (user) {
      loadWellnessSummaries()
    }
  }, [user])

  const loadWellnessSummaries = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Mock data - in real implementation, this would come from backend
      const mockSummaries: WellnessSummary[] = [
        {
          id: '1',
          weekStart: '2025-09-30',
          weekEnd: '2025-10-06',
          totalEntries: 5,
          avgMoodScore: 1.2,
          moodTrend: 'improving',
          keyThemes: ['Academic Progress', 'Social Connections', 'Self-Growth'],
          highlights: [
            'Successfully completed a challenging coding project',
            'Made new friends in machine learning course',
            'Practiced mindfulness regularly'
          ],
          challenges: [
            'Struggled with time management',
            'Felt overwhelmed during exam preparation'
          ],
          aiNarrative: `This week has been like watching a garden bloom in early spring. You've shown remarkable growth and resilience, particularly in your academic pursuits. Your dedication to the coding project reminds me of a craftsman carefully shaping their masterpiece - each challenge you overcame added another layer of skill and confidence.

The connections you've made in your machine learning course are like seeds of future collaborations and friendships. There's something beautiful about how learning brings people together, creating bonds over shared curiosity and discovery.

Your mindfulness practice has been a steady anchor through busier moments. Like a lighthouse guiding ships through storms, this practice has helped you stay centered even when academic pressures mounted. The fact that you recognized feeling overwhelmed and still pushed through shows emotional intelligence beyond your years.

Looking ahead, remember that time management is a skill that improves with practice, much like learning to play a musical instrument. Each week you'll get better at orchestrating the different aspects of your life. You're building something meaningful - not just in your studies, but in your character and relationships.`,
          audioUrl: '/audio/summary_week1.mp3',
          recommendations: [
            {
              category: 'Academic Wellness',
              items: [
                'Try the Pomodoro technique for better time management',
                'Create a weekly study schedule with buffer time',
                'Join study groups for peer support'
              ]
            },
            {
              category: 'Emotional Balance',
              items: [
                'Continue daily mindfulness practice',
                'Consider stress-reduction techniques',
                'Schedule regular breaks during study sessions'
              ]
            },
            {
              category: 'Social Connection',
              items: [
                'Nurture new friendships from your ML course',
                'Plan social activities for weekend balance',
                'Share your project successes with friends'
              ]
            }
          ],
          achievements: [
            
            {
              title: 'Social Butterfly',
              description: 'Made meaningful new connections',
              emoji: '🦋'
            },
            {
              title: 'Mindful Warrior',
              description: 'Maintained consistent mindfulness practice',
              emoji: '🧘‍♂️'
            }
          ],
          metrics: {
            journalEntries: 5,
            moodLogs: 7,
            assessments: 1,
            wellnessScore: 78
          }
        },
        {
          id: '2',
          weekStart: '2025-09-23',
          weekEnd: '2025-09-29',
          totalEntries: 4,
          avgMoodScore: 0.8,
          moodTrend: 'stable',
          keyThemes: ['Routine Building', 'Academic Stress', 'Self-Care'],
          highlights: [
            'Established morning routine',
            'Started meditation practice',
            'Improved sleep schedule'
          ],
          challenges: [
            'Mid-term exam anxiety',
            'Difficulty concentrating'
          ],
          aiNarrative: `This week felt like the steady rhythm of waves against the shore - consistent, purposeful, and building toward something greater. Your commitment to establishing a morning routine shows the wisdom of someone who understands that small, daily actions create lasting change.

The meditation practice you've started is like planting a tree. Right now, it might seem small, but with consistent nurturing, it will grow to provide shade and peace for years to come. Your improved sleep schedule is the soil that allows everything else to flourish.

I noticed the exam anxiety that surfaced this week. It's completely natural - anxiety often appears when we care deeply about our goals. Think of it as your inner achiever trying to help, even if the feeling isn't always comfortable. The fact that you acknowledged these feelings in your journal shows self-awareness that will serve you well.

Remember, concentration difficulties often accompany periods of growth and change. Your brain is literally rewiring itself as you build new habits. Be patient with yourself during this process.`,
          audioUrl: '/audio/summary_week2.mp3',
          recommendations: [
            {
              category: 'Study Techniques',
              items: [
                'Break study sessions into smaller chunks',
                'Use active recall methods',
                'Create a distraction-free study environment'
              ]
            },
            {
              category: 'Stress Management',
              items: [
                'Practice deep breathing before exams',
                'Develop pre-exam routines',
                'Talk to professors about concerns'
              ]
            }
          ],
          achievements: [
            {
              title: 'Routine Master',
              description: 'Successfully established morning routine',
              emoji: '⏰'
            },
            {
              title: 'Sleep Champion',
              description: 'Improved sleep consistency',
              emoji: '😴'
            }
          ],
          metrics: {
            journalEntries: 4,
            moodLogs: 6,
            assessments: 0,
            wellnessScore: 72
          }
        }
      ]
      
      setSummaries(mockSummaries)
      if (mockSummaries.length > 0) {
        setSelectedSummary(mockSummaries[0])
      }
    } catch (error) {
      console.error('Failed to load wellness summaries:', error)
    } finally {
      setLoading(false)
    }
  }

  // const generateNewSummary = async () => {
  //   if (!user) return
    
  //   setGenerating(true)
  //   try {
  //     const newSummary = await generateWellnessSummary(user.id)
  //     setSummaries([newSummary, ...summaries])
  //     setSelectedSummary(newSummary)
  //   } catch (error) {
  //     console.error('Failed to generate summary:', error)
  //   } finally {
  //     setGenerating(false)
  //   }
  // }

  const toggleAudio = () => {
    if (!selectedSummary?.audioUrl) return

    if (!audioElement) {
      const audio = new Audio(selectedSummary.audioUrl)
      audio.onended = () => setIsPlaying(false)
      setAudioElement(audio)
      audio.play()
      setIsPlaying(true)
    } else {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play()
        setIsPlaying(true)
      }
    }
  }

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'declining': return <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
      default: return <Activity className="h-5 w-5 text-blue-500" />
    }
  }

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100'
      case 'declining': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const formatWeekRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/wellness" 
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] hover:shadow-xl hover:shadow-[#EC7FA9]/25 transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                Wellness Summary
              </h1>
              <p className="text-[#BE5985]/70 leading-relaxed">
                AI-powered insights into your mental wellness journey
              </p>
            </div>
          </div>

         
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#BE5985]/70 font-medium">Loading your wellness summaries...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10">
          {/* Summary List Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <h3 className="font-bold text-[#BE5985] mb-4">Recent Summaries</h3>
            {summaries.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-[#BE5985]/70 mb-4">No summaries yet</p>
                
              </div>
            ) : (
              summaries.map((summary) => (
                <div
                  key={summary.id}
                  onClick={() => setSelectedSummary(summary)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    selectedSummary?.id === summary.id 
                      ? 'border-[#EC7FA9] bg-gradient-to-br from-[#FFEDFA] to-[#FFB8E0]/30 shadow-lg shadow-[#EC7FA9]/20' 
                      : 'border-[#FFB8E0]/40 bg-white/50 hover:border-[#EC7FA9]/50 hover:bg-[#FFEDFA]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-[#EC7FA9]" />
                    <span className="text-sm font-medium text-[#BE5985]">
                      {formatWeekRange(summary.weekStart, summary.weekEnd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMoodTrendIcon(summary.moodTrend)}
                      <span className="text-xs text-[#BE5985]/70 capitalize">
                        {summary.moodTrend}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#BE5985]">
                      Score: {summary.metrics.wellnessScore}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Main Summary Content */}
          <div className="xl:col-span-3">
            {selectedSummary ? (
              <div className="space-y-8">
                {/* Summary Header */}
                <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-[#BE5985] mb-2">
                          Week of {formatWeekRange(selectedSummary.weekStart, selectedSummary.weekEnd)}
                        </h2>
                        <div className="flex items-center gap-4">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${getMoodTrendColor(selectedSummary.moodTrend)}`}>
                            {getMoodTrendIcon(selectedSummary.moodTrend)}
                            {selectedSummary.moodTrend.charAt(0).toUpperCase() + selectedSummary.moodTrend.slice(1)} Trend
                          </div>
                          <div className="flex items-center gap-2 text-[#BE5985]/70">
                            <BookOpen className="h-4 w-4" />
                            <span>{selectedSummary.totalEntries} entries</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#BE5985] mb-1">
                          {selectedSummary.metrics.wellnessScore}
                        </div>
                        <div className="text-sm text-[#BE5985]/70">Wellness Score</div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-[#FFEDFA]/40">
                        <div className="text-2xl font-bold text-[#BE5985] mb-1">
                          {selectedSummary.metrics.journalEntries}
                        </div>
                        <div className="text-sm text-[#BE5985]/70">Journal Entries</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-[#FFEDFA]/40">
                        <div className="text-2xl font-bold text-[#BE5985] mb-1">
                          {selectedSummary.metrics.moodLogs}
                        </div>
                        <div className="text-sm text-[#BE5985]/70">Mood Logs</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-[#FFEDFA]/40">
                        <div className="text-2xl font-bold text-[#BE5985] mb-1">
                          {selectedSummary.metrics.assessments}
                        </div>
                        <div className="text-sm text-[#BE5985]/70">Assessments</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-[#FFEDFA]/40">
                        <div className="text-2xl font-bold text-[#BE5985] mb-1">
                          {selectedSummary.avgMoodScore > 0 ? '+' : ''}{selectedSummary.avgMoodScore}
                        </div>
                        <div className="text-sm text-[#BE5985]/70">Avg Mood</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Narrative */}
                <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-2">
                        <Brain className="h-6 w-6 text-[#EC7FA9]" />
                        Your Weekly Story
                      </h3>
                      
                      {selectedSummary.audioUrl && (
                        <button
                          onClick={toggleAudio}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EC7FA9]/20 to-[#BE5985]/20 border border-[#FFB8E0]/50 text-[#BE5985] hover:bg-gradient-to-r hover:from-[#EC7FA9]/30 hover:to-[#BE5985]/30 rounded-xl transition-all duration-300"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {isPlaying ? 'Pause' : 'Listen'}
                          </span>
                        </button>
                      )}
                    </div>
                    
                    <div className="prose prose-pink max-w-none">
                      <p className="text-[#BE5985]/80 leading-relaxed text-lg whitespace-pre-line">
                        {selectedSummary.aiNarrative}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlights & Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Highlights */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-md border border-green-200/50 shadow-xl shadow-green-200/20">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Week Highlights
                    </h4>
                    <div className="space-y-3">
                      {selectedSummary.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/40">
                          <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm text-green-800">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-50/90 to-amber-50/90 backdrop-blur-md border border-yellow-200/50 shadow-xl shadow-yellow-200/20">
                    <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Achievements Unlocked
                    </h4>
                    <div className="space-y-3">
                      {selectedSummary.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/40">
                          <div className="text-2xl">{achievement.emoji}</div>
                          <div>
                            <div className="font-semibold text-yellow-800">{achievement.title}</div>
                            <div className="text-sm text-yellow-700">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
                  <h3 className="text-xl font-bold text-[#BE5985] mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-[#EC7FA9]" />
                    Personalized Recommendations
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedSummary.recommendations.map((category, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-semibold text-[#BE5985] border-b-2 border-[#FFB8E0]/30 pb-2">
                          {category.category}
                        </h4>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-2 p-2 rounded-lg bg-[#FFEDFA]/30">
                              <div className="w-2 h-2 bg-[#EC7FA9] rounded-full mt-2"></div>
                              <span className="text-sm text-[#BE5985]/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#FFB8E0] text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFEDFA]/30 transition-all duration-300">
                    <Download className="h-5 w-5" />
                    Download Summary
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#FFB8E0] text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFEDFA]/30 transition-all duration-300">
                    <Share2 className="h-5 w-5" />
                    Share with Provider
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-[#BE5985] mb-2">No Summary Selected</h3>
                  <p className="text-[#BE5985]/70">Choose a summary from the sidebar to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
