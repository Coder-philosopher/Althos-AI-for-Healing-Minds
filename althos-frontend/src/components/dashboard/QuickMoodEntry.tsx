'use client'
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { recordDailyMood } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Heart, Zap, CheckCircle, Sparkles } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

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

  const getMoodEmoji = (val: number) => {
    const emojis = {
      '-2': '😢', '-1': '😞', '0': '😐', '1': '😊', '2': '😄'
    }
    return emojis[val.toString() as keyof typeof emojis] || '😐'
  }

  const getEnergyEmoji = (val: number) => {
    if (val < 0.3) return '😴'
    if (val < 0.7) return '😌'
    return '⚡'
  }

  if (submitted) {
    return (
      <div className={`${montserrat.className} p-8 rounded-3xl bg-gradient-to-br from-green-50/90 to-emerald-100/50 backdrop-blur-md border border-green-200/50 shadow-xl shadow-green-200/20 relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-2xl animate-pulse" />
        <Sparkles className="absolute top-4 right-4 h-5 w-5 text-green-400 animate-bounce" />
        
        <div className="text-center py-6 relative z-10">
          <div className="relative mb-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto animate-bounce" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-3">
            Thanks for checking in! ✨
          </h3>
          <p className="text-green-700 text-lg leading-relaxed">
            Your mood has been recorded for today.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-2xl bg-white/60 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-green-600 fill-current animate-pulse" />
            <span className="text-sm font-medium text-green-700">Mood logged at {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${montserrat.className} p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500`}>
      {/* Floating background elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#BE5985] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Heart className="h-5 w-5 text-white" />
            </div>
            Quick Mood Check
          </h3>
          <div className="px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
            <span className="text-sm font-medium text-[#BE5985]">Daily Check-in</span>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Mood Valence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-[#BE5985] flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(valence[0])}</span>
                How are you feeling?
              </label>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                <span className="text-sm font-medium text-[#BE5985]">
                  {valence[0] === -2 ? 'Very Low' : 
                   valence[0] === -1 ? 'Low' :
                   valence[0] === 0 ? 'Neutral' :
                   valence[0] === 1 ? 'Good' : 'Very Good'}
                </span>
              </div>
            </div>
            
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
              <Slider
                value={valence}
                onValueChange={setValence}
                min={-2}
                max={2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs font-medium text-[#BE5985]/70">
                <span>😢 Low</span>
                <span>😐 Neutral</span>
                <span>😄 High</span>
              </div>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-[#BE5985] flex items-center gap-2">
                <span className="text-xl">{getEnergyEmoji(arousal[0])}</span>
                <Zap className="h-4 w-4 text-[#EC7FA9]" />
                Energy Level
              </label>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB8E0]/30 to-[#EC7FA9]/20 border border-[#FFB8E0]/50">
                <span className="text-sm font-medium text-[#BE5985]">
                  {arousal[0] < 0.3 ? 'Low' : arousal[0] < 0.7 ? 'Medium' : 'High'}
                </span>
              </div>
            </div>
            
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
              <Slider
                value={arousal}
                onValueChange={setArousal}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs font-medium text-[#BE5985]/70">
                <span>😴 Calm</span>
                <span>😌 Balanced</span>
                <span>⚡ Energized</span>
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
              <>
                <span className="relative z-10">Record My Mood</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
