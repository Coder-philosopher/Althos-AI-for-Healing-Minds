'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getMoodAtlas } from '@/lib/api'
import { Map, ArrowLeft, Sparkles, Heart, TrendingUp, Calendar, Filter, Target, Zap, Sun, Moon, Cloud, Star } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface MoodCluster {
  id: number
  name: string
  color: string
  bgColor: string
  emoji: string
  description: string
  count: number
  avgValence: number
  avgArousal: number
  entries: Array<{
    date: string
    valence: number
    arousal: number
    note?: string
  }>
}

export default function MoodAtlasPage() {
  const { user } = useAuth()
  const [clusters, setClusters] = useState<MoodCluster[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('30') // days
  const [animatingCluster, setAnimatingCluster] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      loadMoodAtlas()
    }
  }, [user, timeRange])

  const loadMoodAtlas = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const toDate = new Date().toISOString().split('T')[0]
      const fromDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const response = await getMoodAtlas(user.id, fromDate, toDate)
      
      // Mock clustered data - in real implementation, this would come from backend ML
      const mockClusters: MoodCluster[] = [
        {
          id: 1,
          name: 'Excited & Energetic',
          color: 'text-green-600',
          bgColor: 'from-green-100 to-emerald-50',
          emoji: '🤗',
          description: 'High positive energy states',
          count: 8,
          avgValence: 1.5,
          avgArousal: 0.8,
          entries: [
            { date: '2025-10-01', valence: 2, arousal: 0.9, note: 'Great day!' },
            { date: '2025-10-03', valence: 1, arousal: 0.7 }
          ]
        },
        {
          id: 2,
          name: 'Content & Peaceful',
          color: 'text-blue-600',
          bgColor: 'from-blue-100 to-sky-50',
          emoji: '😌',
          description: 'Calm positive states',
          count: 12,
          avgValence: 0.8,
          avgArousal: 0.3,
          entries: [
            { date: '2025-10-02', valence: 1, arousal: 0.2, note: 'Peaceful morning' },
            { date: '2025-10-04', valence: 0.5, arousal: 0.4 }
          ]
        },
        {
          id: 3,
          name: 'Balanced & Neutral',
          color: 'text-purple-600',
          bgColor: 'from-purple-100 to-violet-50',
          emoji: '😐',
          description: 'Stable neutral states',
          count: 15,
          avgValence: 0.1,
          avgArousal: 0.5,
          entries: [
            { date: '2025-10-05', valence: 0, arousal: 0.5 },
            { date: '2025-10-06', valence: 0.2, arousal: 0.4 }
          ]
        },
        {
          id: 4,
          name: 'Stressed & Anxious',
          color: 'text-orange-600',
          bgColor: 'from-orange-100 to-amber-50',
          emoji: '😰',
          description: 'High arousal negative states',
          count: 5,
          avgValence: -0.5,
          avgArousal: 0.8,
          entries: [
            { date: '2025-09-28', valence: -1, arousal: 0.9, note: 'Exam stress' },
            { date: '2025-09-30', valence: -0.5, arousal: 0.7 }
          ]
        },
        {
          id: 5,
          name: 'Low & Withdrawn',
          color: 'text-gray-600',
          bgColor: 'from-gray-100 to-slate-50',
          emoji: '😔',
          description: 'Low energy negative states',
          count: 3,
          avgValence: -1.2,
          avgArousal: 0.2,
          entries: [
            { date: '2025-09-25', valence: -2, arousal: 0.1, note: 'Feeling down' }
          ]
        }
      ]
      
      setClusters(mockClusters)
    } catch (error) {
      console.error('Failed to load mood atlas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClusterClick = (clusterId: number) => {
    setAnimatingCluster(clusterId)
    setTimeout(() => {
      setSelectedCluster(selectedCluster === clusterId ? null : clusterId)
      setAnimatingCluster(null)
    }, 200)
  }

  const getTimeRangeText = () => {
    switch(timeRange) {
      case '7': return 'Past Week'
      case '30': return 'Past Month'
      case '90': return 'Past 3 Months'
      case '180': return 'Past 6 Months'
      default: return 'Past Month'
    }
  }

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/dashboard/mood" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] hover:shadow-xl hover:shadow-[#EC7FA9]/25 transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Map className="h-8 w-8 text-white" />
              </div>
              Mood Atlas
            </h1>
            <p className="text-[#BE5985]/70 leading-relaxed">
              Discover your emotional patterns and clusters over time
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-5 w-5 text-[#BE5985]" />
          <span className="text-sm font-medium text-[#BE5985]">Time Range:</span>
          <div className="flex gap-2">
            {[
              { value: '7', label: '1W' },
              { value: '30', label: '1M' },
              { value: '90', label: '3M' },
              { value: '180', label: '6M' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  timeRange === value
                    ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg shadow-[#EC7FA9]/30'
                    : 'bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#BE5985] hover:bg-[#FFEDFA]/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm text-[#BE5985]/70 ml-2">({getTimeRangeText()})</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#BE5985]/70 font-medium">Analyzing your mood patterns...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          {/* Mood Clusters Overview */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#BE5985] mb-2 flex items-center gap-2">
                    <Target className="h-6 w-6 text-[#EC7FA9]" />
                    Your Emotional Clusters
                  </h2>
                  <p className="text-[#BE5985]/70">
                    AI has identified {clusters.length} distinct emotional patterns in your mood data
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/60 to-[#FFB8E0]/40 border border-[#FFB8E0]/50">
                  <div className="text-2xl font-bold text-[#BE5985] mb-1">
                    {clusters.reduce((sum, cluster) => sum + cluster.count, 0)}
                  </div>
                  <div className="text-sm text-[#BE5985]/70">Total Entries</div>
                </div>
              </div>

              {/* Cluster Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusters.map((cluster) => (
                  <div
                    key={cluster.id}
                    onClick={() => handleClusterClick(cluster.id)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 ${
                      selectedCluster === cluster.id 
                        ? 'border-[#EC7FA9] shadow-xl shadow-[#EC7FA9]/25' 
                        : 'border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50'
                    } ${
                      animatingCluster === cluster.id ? 'scale-95' : 'scale-100'
                    } bg-gradient-to-br ${cluster.bgColor} backdrop-blur-sm relative overflow-hidden group`}
                  >
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{cluster.emoji}</div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#BE5985]">{cluster.count}</div>
                          <div className="text-xs text-[#BE5985]/70">entries</div>
                        </div>
                      </div>
                      
                      <h3 className={`font-bold text-lg mb-2 ${cluster.color}`}>
                        {cluster.name}
                      </h3>
                      
                      <p className="text-sm text-[#BE5985]/70 mb-4 leading-relaxed">
                        {cluster.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3 text-[#EC7FA9]" />
                          <span className="text-[#BE5985]/60">
                            Mood: {cluster.avgValence > 0 ? '+' : ''}{cluster.avgValence.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-[#EC7FA9]" />
                          <span className="text-[#BE5985]/60">
                            Energy: {Math.round(cluster.avgArousal * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Cluster Details */}
          {selectedCluster && (
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 animate-slide-up">
              {(() => {
                const cluster = clusters.find(c => c.id === selectedCluster)
                if (!cluster) return null
                
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl">{cluster.emoji}</div>
                      <div>
                        <h3 className={`text-2xl font-bold ${cluster.color} mb-2`}>
                          {cluster.name}
                        </h3>
                        <p className="text-[#BE5985]/70">
                          {cluster.entries.length} mood entries in this cluster
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cluster Stats */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#BE5985] mb-3">Cluster Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFEDFA]/40">
                            <span className="text-sm font-medium text-[#BE5985]">Average Mood</span>
                            <span className={`font-bold ${cluster.color}`}>
                              {cluster.avgValence > 0 ? '+' : ''}{cluster.avgValence.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFEDFA]/40">
                            <span className="text-sm font-medium text-[#BE5985]">Average Energy</span>
                            <span className={`font-bold ${cluster.color}`}>
                              {Math.round(cluster.avgArousal * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFEDFA]/40">
                            <span className="text-sm font-medium text-[#BE5985]">Frequency</span>
                            <span className={`font-bold ${cluster.color}`}>
                              {Math.round((cluster.count / clusters.reduce((sum, c) => sum + c.count, 0)) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Entries */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#BE5985] mb-3">Recent Entries</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cluster.entries.slice(0, 5).map((entry, index) => (
                            <div key={index} className="p-3 rounded-xl bg-[#FFEDFA]/40 border border-[#FFB8E0]/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#BE5985]">
                                  {new Date(entry.date).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-[#BE5985]/70">
                                  <span>M: {entry.valence > 0 ? '+' : ''}{entry.valence}</span>
                                  <span>E: {Math.round(entry.arousal * 100)}%</span>
                                </div>
                              </div>
                              {entry.note && (
                                <p className="text-sm text-[#BE5985]/70 italic">
                                  "{entry.note}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Insights Section */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md border border-blue-200/50 shadow-xl shadow-blue-200/20">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-800">Mood Atlas Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800">🌟 Key Patterns</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>You spend most time in balanced and peaceful states</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>Stress episodes are brief but intense - consider coping strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>Your excited states often follow peaceful periods</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800">💡 Recommendations</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>Practice mindfulness during neutral states to enhance awareness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>Identify triggers for your stress cluster patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-blue-500" />
                    <span>Build on your natural tendency toward peaceful states</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
