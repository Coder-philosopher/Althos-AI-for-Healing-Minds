'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { recordDailyMood, getMoodAtlas } from '@/lib/api'
import { Slider } from '@/components/ui/slider'
import { Smile, Calendar, TrendingUp, Map } from 'lucide-react'
import Link from 'next/link'

export default function MoodPage() {
  const { user } = useAuth()
  const [todayMood, setTodayMood] = useState({
    valence: [0],
    arousal: [0.5]
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentMoods, setRecentMoods] = useState([])

  useEffect(() => {
    if (user) {
      // Check if already submitted today
      const today = new Date().toISOString().split('T')[0]
      const lastSubmission = localStorage.getItem(`mood_${user.id}_${today}`)
      if (lastSubmission) {
        setSubmitted(true)
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
    try {
      const today = new Date().toISOString().split('T')[0]
      await recordDailyMood(user.id, {
        date: today,
        valence: todayMood.valence[0],
        arousal: todayMood.arousal[0]
      })
      
      setSubmitted(true)
      localStorage.setItem(`mood_${user.id}_${today}`, 'true')
    } catch (error) {
      console.error('Failed to record mood:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodDescription = () => {
    const v = todayMood.valence[0]
    const a = todayMood.arousal[0]
    
    if (v >= 1 && a >= 0.7) return { text: 'Excited & Happy', color: 'text-green-600', emoji: '🤗' }
    if (v >= 1 && a < 0.4) return { text: 'Content & Peaceful', color: 'text-blue-600', emoji: '😌' }
    if (v <= -1 && a >= 0.7) return { text: 'Stressed & Anxious', color: 'text-red-600', emoji: '😰' }
    if (v <= -1 && a < 0.4) return { text: 'Sad & Low', color: 'text-purple-600', emoji: '😔' }
    if (a >= 0.7) return { text: 'Energetic', color: 'text-orange-600', emoji: '⚡' }
    if (a < 0.3) return { text: 'Calm & Relaxed', color: 'text-green-600', emoji: '😊' }
    return { text: 'Balanced', color: 'text-blue-600', emoji: '😐' }
  }

  const mood = getMoodDescription()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <Smile className="h-8 w-8 text-brand" />
          Mood Tracking
        </h1>
        <p className="text-text-secondary">
          Track your daily emotional state and discover patterns over time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Mood Entry */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" />
              Today&apos;s Mood
            </h3>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{mood.emoji}</div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  Thanks for checking in!
                </h4>
                <p className="text-text-secondary">
                  You recorded your mood as <span className={`font-medium ${mood.color}`}>{mood.text}</span> today.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    localStorage.removeItem(`mood_${user?.id}_${new Date().toISOString().split('T')[0]}`)
                  }}
                  className="btn-secondary mt-4"
                >
                  Update Mood
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Mood Display */}
                <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                  <div className="text-6xl mb-4">{mood.emoji}</div>
                  <h4 className={`text-xl font-semibold ${mood.color} mb-2`}>
                    {mood.text}
                  </h4>
                  <p className="text-text-secondary">
                    Valence: {todayMood.valence[0]}, Energy: {Math.round(todayMood.arousal[0] * 100)}%
                  </p>
                </div>

                {/* Mood Sliders */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-text-primary">
                        😞 How are you feeling emotionally? 😊
                      </label>
                      <span className="text-xs text-text-secondary">
                        {todayMood.valence[0] === -2 ? 'Very negative' : 
                         todayMood.valence[0] === -1 ? 'Negative' :
                         todayMood.valence[0] === 0 ? 'Neutral' :
                         todayMood.valence[0] === 1 ? 'Positive' : 'Very positive'}
                      </span>
                    </div>
                    <Slider
                      value={todayMood.valence}
                      onValueChange={(value) => setTodayMood(prev => ({ ...prev, valence: value }))}
                      min={-2}
                      max={2}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-text-primary">
                        😴 What&apos;s your energy level? ⚡
                      </label>
                      <span className="text-xs text-text-secondary">
                        {todayMood.arousal[0] < 0.3 ? 'Low energy' : 
                         todayMood.arousal[0] < 0.7 ? 'Medium energy' : 'High energy'}
                      </span>
                    </div>
                    <Slider
                      value={todayMood.arousal}
                      onValueChange={(value) => setTodayMood(prev => ({ ...prev, arousal: value }))}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Recording...' : 'Record Today\'s Mood'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">Mood Tools</h3>
            <div className="space-y-3">
              <Link href="/dashboard/mood/atlas" className="btn-secondary w-full flex items-center gap-2">
                <Map className="h-4 w-4" />
                View Mood Atlas
              </Link>
              <Link href="/dashboard/mood/trends" className="btn-secondary w-full flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View Trends
              </Link>
            </div>
          </div>

          <div className="card bg-info/10 border-info/20">
            <h4 className="font-medium text-blue-800 mb-2">💡 Mood Tip</h4>
            <p className="text-blue-700 text-sm">
              Regular mood tracking helps you notice patterns and triggers. 
              Even 30 seconds daily can provide valuable insights!
            </p>
          </div>

          <div className="card">
            <h4 className="font-medium text-text-primary mb-3">This Week</h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand mb-1">5/7</div>
              <p className="text-sm text-text-secondary">
                Days tracked this week
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
