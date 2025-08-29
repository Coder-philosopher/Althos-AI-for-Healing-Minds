'use client'
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { recordDailyMood } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Heart, Zap } from 'lucide-react'

export function QuickMoodEntry() {
  const { user } = useAuth()
  const [valence, setValence] = useState([0])
  const [arousal, setArousal] = useState([0.5])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await recordDailyMood(user.id, {
        date: new Date().toISOString().split('T')[0],
        valence: valence[0],
        arousal: arousal[0]
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to record mood:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card bg-success/10 border-success/20">
        <div className="text-center py-4">
          <Heart className="h-12 w-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Thanks for checking in!
          </h3>
          <p className="text-text-secondary">
            Your mood has been recorded for today.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-brand" />
        Quick Mood Check
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              😞 How are you feeling? 😊
            </label>
            <span className="text-xs text-text-secondary">
              {valence[0] === -2 ? 'Very negative' : 
               valence[0] === -1 ? 'Negative' :
               valence[0] === 0 ? 'Neutral' :
               valence[0] === 1 ? 'Positive' : 'Very positive'}
            </span>
          </div>
          <Slider
            value={valence}
            onValueChange={setValence}
            min={-2}
            max={2}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Energy Level
            </label>
            <span className="text-xs text-text-secondary">
              {arousal[0] < 0.3 ? 'Low' : arousal[0] < 0.7 ? 'Medium' : 'High'}
            </span>
          </div>
          <Slider
            value={arousal}
            onValueChange={setArousal}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Recording...' : 'Record Mood'}
        </button>
      </div>
    </div>
  )
}
