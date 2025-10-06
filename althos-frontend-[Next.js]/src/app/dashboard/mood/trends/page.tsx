'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getMoodAtlas } from '@/lib/api'
import { TrendingUp, ArrowLeft, Calendar, BarChart3, Activity, Target, Sparkles, Heart, Zap, Sun, Moon, Cloud, Star, Filter, LineChart } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface MoodTrend {
  date: string
  valence: number
  arousal: number
  dayOfWeek: string
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  weekNumber: number
}

interface TrendAnalysis {
  weeklyAverage: { week: number; avgValence: number; avgArousal: number }[]
  dailyPatterns: { day: string; avgValence: number; avgArousal: number; count: number }[]
  timePatterns: { time: string; avgValence: number; avgArousal: number; count: number }[]
  correlations: {
    sleepQuality?: number
    academicStress?: number
    socialActivity?: number
  }
}

export default function MoodTrendsPage() {
  const { user } = useAuth()
  const [trends, setTrends] = useState<MoodTrend[]>([])
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [selectedView, setSelectedView] = useState<'weekly' | 'daily' | 'time'>('weekly')
  const [animatingCard, setAnimatingCard] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadMoodTrends()
    }
  }, [user, timeRange])

  const loadMoodTrends = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const toDate = new Date().toISOString().split('T')[0]
      const fromDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      // Mock trend data - in real implementation, this would come from backend
      const mockTrends: MoodTrend[] = generateMockTrendData(parseInt(timeRange))
      const mockAnalysis = analyzeTrends(mockTrends)
      
      setTrends(mockTrends)
      setAnalysis(mockAnalysis)
    } catch (error) {
      console.error('Failed to load mood trends:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockTrendData = (days: number): MoodTrend[] => {
    const data: MoodTrend[] = []
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayOfWeek = dayNames[date.getDay()]
      const weekNumber = Math.floor((days - i) / 7)
      
      // Generate realistic mood patterns
      let valence = Math.sin(i * 0.1) + (Math.random() - 0.5) * 0.8
      let arousal = 0.5 + Math.cos(i * 0.15) * 0.3 + (Math.random() - 0.5) * 0.4
      
      // Add day-of-week patterns
      if (dayOfWeek === 'Monday') valence -= 0.3
      if (dayOfWeek === 'Friday') valence += 0.2
      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') valence += 0.1
      
      // Clamp values
      valence = Math.max(-2, Math.min(2, valence))
      arousal = Math.max(0, Math.min(1, arousal))
      
      data.push({
        date: date.toISOString().split('T')[0],
        valence: Math.round(valence * 10) / 10,
        arousal: Math.round(arousal * 10) / 10,
        dayOfWeek,
        timeOfDay: i % 3 === 0 ? 'morning' : i % 3 === 1 ? 'afternoon' : 'evening',
        weekNumber
      })
    }
    
    return data.reverse()
  }

  const analyzeTrends = (data: MoodTrend[]): TrendAnalysis => {
    // Weekly averages
    const weeklyData = data.reduce((acc, curr) => {
      const week = curr.weekNumber
      if (!acc[week]) acc[week] = { valence: [], arousal: [] }
      acc[week].valence.push(curr.valence)
      acc[week].arousal.push(curr.arousal)
      return acc
    }, {} as Record<number, { valence: number[]; arousal: number[] }>)

    const weeklyAverage = Object.entries(weeklyData).map(([week, values]) => ({
      week: parseInt(week),
      avgValence: Math.round((values.valence.reduce((a, b) => a + b, 0) / values.valence.length) * 10) / 10,
      avgArousal: Math.round((values.arousal.reduce((a, b) => a + b, 0) / values.arousal.length) * 10) / 10
    }))

    // Daily patterns
    const dailyData = data.reduce((acc, curr) => {
      if (!acc[curr.dayOfWeek]) acc[curr.dayOfWeek] = { valence: [], arousal: [] }
      acc[curr.dayOfWeek].valence.push(curr.valence)
      acc[curr.dayOfWeek].arousal.push(curr.arousal)
      return acc
    }, {} as Record<string, { valence: number[]; arousal: number[] }>)

    const dailyPatterns = Object.entries(dailyData).map(([day, values]) => ({
      day,
      avgValence: Math.round((values.valence.reduce((a, b) => a + b, 0) / values.valence.length) * 10) / 10,
      avgArousal: Math.round((values.arousal.reduce((a, b) => a + b, 0) / values.arousal.length) * 10) / 10,
      count: values.valence.length
    }))

    // Time patterns
    const timeData = data.reduce((acc, curr) => {
      if (!acc[curr.timeOfDay]) acc[curr.timeOfDay] = { valence: [], arousal: [] }
      acc[curr.timeOfDay].valence.push(curr.valence)
      acc[curr.timeOfDay].arousal.push(curr.arousal)
      return acc
    }, {} as Record<string, { valence: number[]; arousal: number[] }>)

    const timePatterns = Object.entries(timeData).map(([time, values]) => ({
      time,
      avgValence: Math.round((values.valence.reduce((a, b) => a + b, 0) / values.valence.length) * 10) / 10,
      avgArousal: Math.round((values.arousal.reduce((a, b) => a + b, 0) / values.arousal.length) * 10) / 10,
      count: values.valence.length
    }))

    return {
      weeklyAverage,
      dailyPatterns,
      timePatterns,
      correlations: {
        sleepQuality: 0.65,
        academicStress: -0.42,
        socialActivity: 0.38
      }
    }
  }

  const handleViewChange = (view: typeof selectedView) => {
    setAnimatingCard(view)
    setTimeout(() => {
      setSelectedView(view)
      setAnimatingCard(null)
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

  const getMoodEmoji = (valence: number) => {
    if (valence >= 1) return '😊'
    if (valence >= 0.5) return '🙂'
    if (valence >= 0) return '😐'
    if (valence >= -0.5) return '😕'
    return '😞'
  }

  const getEnergyIcon = (arousal: number) => {
    if (arousal >= 0.7) return <Zap className="h-4 w-4 text-orange-500" />
    if (arousal >= 0.4) return <Sun className="h-4 w-4 text-yellow-500" />
    return <Moon className="h-4 w-4 text-blue-500" />
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
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              Mood Trends
            </h1>
            <p className="text-[#BE5985]/70 leading-relaxed">
              Analyze your emotional patterns and discover insights over time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Time Range Selector */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-[#BE5985]" />
            <span className="text-sm font-medium text-[#BE5985]">Period:</span>
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
          </div>

          {/* View Selector */}
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#BE5985]" />
            <span className="text-sm font-medium text-[#BE5985]">View:</span>
            <div className="flex gap-2">
              {[
                { value: 'weekly' as const, label: 'Weekly', icon: Calendar },
                { value: 'daily' as const, label: 'Daily', icon: Sun },
                { value: 'time' as const, label: 'Time', icon: Activity }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleViewChange(value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedView === value
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
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#BE5985]/70 font-medium">Analyzing your mood trends...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          {/* Trend Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Trend */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-[#BE5985]">Overall Trend</h3>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-[#BE5985] mb-1">
                    {analysis?.weeklyAverage.length ? 
                      (analysis.weeklyAverage[analysis.weeklyAverage.length - 1]?.avgValence > 
                       analysis.weeklyAverage[0]?.avgValence ? '+0.3' : '-0.1') : '+0.2'}
                  </div>
                  <div className="text-sm text-[#BE5985]/70">vs previous period</div>
                </div>
              </div>
            </div>

            {/* Best Day */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200/50">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-[#BE5985]">Best Day</h3>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {analysis?.dailyPatterns.reduce((best, current) => 
                      current.avgValence > best.avgValence ? current : best
                    )?.day === 'Friday' ? '🎉' : '😊'}
                  </div>
                  <div className="text-lg font-bold text-[#BE5985] mb-1">
                    {analysis?.dailyPatterns.reduce((best, current) => 
                      current.avgValence > best.avgValence ? current : best
                    )?.day || 'Friday'}
                  </div>
                  <div className="text-sm text-[#BE5985]/70">
                    Avg: {analysis?.dailyPatterns.reduce((best, current) => 
                      current.avgValence > best.avgValence ? current : best
                    )?.avgValence.toFixed(1) || '+1.2'}
                  </div>
                </div>
              </div>
            </div>

            {/* Peak Energy */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-200/50">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-[#BE5985]">Peak Energy</h3>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  
                  <div className="text-sm text-[#BE5985]/70">
                    {Math.round((analysis?.timePatterns.reduce((best, current) => 
                      current.avgArousal > best.avgArousal ? current : best
                    )?.avgArousal || 0.8) * 100)}% energy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#BE5985] mb-2 flex items-center gap-2">
                    <LineChart className="h-6 w-6 text-[#EC7FA9]" />
                    {selectedView === 'weekly' ? 'Weekly Patterns' : 
                     selectedView === 'daily' ? 'Daily Patterns' : 'Time-of-Day Patterns'}
                  </h2>
                  <p className="text-[#BE5985]/70">
                    {getTimeRangeText()} • {trends.length} mood entries analyzed
                  </p>
                </div>
              </div>

              {/* Pattern Visualization */}
              <div className={`transition-all duration-300 ${animatingCard ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                {selectedView === 'weekly' && analysis && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {analysis.weeklyAverage.map((week, index) => (
                        <div key={week.week} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFEDFA]/40 border border-[#FFB8E0]/30">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded-lg bg-white/60">
                              <Calendar className="h-4 w-4 text-[#BE5985]" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#BE5985]">Week {week.week + 1}</div>
                              <div className="text-sm text-[#BE5985]/70">
                                {index === 0 ? 'Oldest' : index === analysis.weeklyAverage.length - 1 ? 'Latest' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                <Heart className="h-4 w-4 text-[#EC7FA9]" />
                                <span className="text-sm font-medium text-[#BE5985]">Mood</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{getMoodEmoji(week.avgValence)}</span>
                                <span className="font-bold text-[#BE5985]">
                                  {week.avgValence > 0 ? '+' : ''}{week.avgValence}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-[#EC7FA9]" />
                                <span className="text-sm font-medium text-[#BE5985]">Energy</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getEnergyIcon(week.avgArousal)}
                                <span className="font-bold text-[#BE5985]">
                                  {Math.round(week.avgArousal * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedView === 'daily' && analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                      const dayData = analysis.dailyPatterns.find(d => d.day === day)
                      if (!dayData) return null
                      
                      return (
                        <div key={day} className="p-4 rounded-2xl bg-[#FFEDFA]/40 border border-[#FFB8E0]/30 text-center">
                          <div className="font-semibold text-[#BE5985] mb-2">{day.slice(0, 3)}</div>
                          <div className="text-3xl mb-3">{getMoodEmoji(dayData.avgValence)}</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-1">
                              <Heart className="h-3 w-3 text-[#EC7FA9]" />
                              <span className="text-sm font-bold text-[#BE5985]">
                                {dayData.avgValence > 0 ? '+' : ''}{dayData.avgValence}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              {getEnergyIcon(dayData.avgArousal)}
                              <span className="text-sm font-bold text-[#BE5985]">
                                {Math.round(dayData.avgArousal * 100)}%
                              </span>
                            </div>
                            <div className="text-xs text-[#BE5985]/60">
                              {dayData.count} entries
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedView === 'time' && analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {analysis.timePatterns.map(timeData => (
                      <div key={timeData.time} className="p-6 rounded-2xl bg-[#FFEDFA]/40 border border-[#FFB8E0]/30 text-center">
                        <div className="text-4xl mb-4">
                          {timeData.time === 'morning' ? '🌅' : 
                           timeData.time === 'afternoon' ? '☀️' : '🌙'}
                        </div>
                        <h4 className="font-bold text-[#BE5985] mb-4 capitalize">
                          {timeData.time}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <Heart className="h-4 w-4 text-[#EC7FA9]" />
                            <span className="text-sm text-[#BE5985]/70">Mood:</span>
                            <span className="font-bold text-[#BE5985]">
                              {timeData.avgValence > 0 ? '+' : ''}{timeData.avgValence}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4 text-[#EC7FA9]" />
                            <span className="text-sm text-[#BE5985]/70">Energy:</span>
                            <span className="font-bold text-[#BE5985]">
                              {Math.round(timeData.avgArousal * 100)}%
                            </span>
                          </div>
                          <div className="text-xs text-[#BE5985]/60 pt-2 border-t border-[#FFB8E0]/30">
                            Based on {timeData.count} entries
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Correlations & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Correlations */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50/90 to-indigo-50/90 backdrop-blur-md border border-purple-200/50 shadow-xl shadow-purple-200/20">
              <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Mood Correlations
              </h3>
              
              <div className="space-y-4">
                {analysis?.correlations && Object.entries(analysis.correlations).map(([factor, correlation]) => (
                  <div key={factor} className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-purple-200/40">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {factor === 'sleepQuality' ? '😴' : 
                         factor === 'academicStress' ? '📚' : '👥'}
                      </div>
                      <span className="font-medium text-purple-800 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        correlation > 0.5 ? 'text-green-600' : 
                        correlation > 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
                      </div>
                      <div className="text-xs text-purple-600">
                        {Math.abs(correlation) > 0.5 ? 'Strong' : 
                         Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 to-cyan-50/90 backdrop-blur-md border border-blue-200/50 shadow-xl shadow-blue-200/20">
              <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Key Insights
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/60 border border-blue-200/40">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Peak Performance</h4>
                      <p className="text-sm text-blue-700">
                        Your mood tends to be highest on Fridays, suggesting better emotional states before weekends.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border border-blue-200/40">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Energy Patterns</h4>
                      <p className="text-sm text-blue-700">
                        Morning hours show your highest energy levels - ideal for important tasks and decision-making.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border border-blue-200/40">
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Weekly Trends</h4>
                      <p className="text-sm text-blue-700">
                        Your emotional resilience shows gradual improvement over recent weeks - keep up the good work!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
