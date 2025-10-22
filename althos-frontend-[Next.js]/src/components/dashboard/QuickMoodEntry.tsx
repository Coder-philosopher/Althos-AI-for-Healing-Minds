'use client'
import { useState } from 'react'
import { recordDailyMood } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Heart, Zap, CheckCircle, Sparkles, Smile, Frown, Meh, Battery, BatteryFull } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// Custom Enhanced Slider Component
function EnhancedSlider({ 
  value, 
  onChange, 
  min, 
  max, 
  step,
  labels,
  type = 'mood'
}: { 
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  labels: string[]
  type?: 'mood' | 'energy'
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const color = type === 'mood' 
    ? value <= -1 ? 'from-rose-400 to-pink-500' 
      : value === 0 ? 'from-amber-400 to-yellow-500'
      : 'from-emerald-400 to-green-500'
    : 'from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2]'

  return (
    <div className="relative py-2">
      {/* Track */}
      <div className="relative h-3 bg-gradient-to-r from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-full shadow-inner border-2 border-[#F8A5C2]/30">
        {/* Filled track with gradient */}
        <div 
          className={cn(
            "absolute h-full rounded-full transition-all duration-300 shadow-lg",
            `bg-gradient-to-r ${color}`
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
        </div>
        
        {/* Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -ml-5 transition-all duration-300"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse",
              `bg-gradient-to-r ${color}`
            )} />
            {/* Thumb button */}
            <div className={cn(
              "relative w-10 h-10 rounded-full shadow-2xl cursor-pointer",
              "border-4 border-white",
              "flex items-center justify-center",
              "hover:scale-110 active:scale-95 transition-transform duration-200",
              `bg-gradient-to-br ${color}`
            )}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden input for accessibility */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
      />

      {/* Labels */}
      <div className="flex justify-between mt-4 px-1">
        {labels.map((label, i) => (
          <span key={i} className="text-xs font-medium text-[#A03768]/60">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function QuickMoodEntry() {
  const { user } = useAuth()
  const [valence, setValence] = useState(0)
  const [arousal, setArousal] = useState(0.5)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await recordDailyMood(user.id, {
        date: new Date().toISOString().split('T')[0],
        valence: valence,
        arousal: arousal
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to record mood:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodData = (val: number) => {
    const moods = {
      '-2': { emoji: '😢', label: 'Very Low', icon: Frown, color: 'text-rose-600' },
      '-1': { emoji: '😞', label: 'Low', icon: Frown, color: 'text-orange-600' },
      '0': { emoji: '😐', label: 'Neutral', icon: Meh, color: 'text-amber-600' },
      '1': { emoji: '😊', label: 'Good', icon: Smile, color: 'text-emerald-600' },
      '2': { emoji: '😄', label: 'Very Good', icon: Smile, color: 'text-green-600' }
    }
    return moods[val.toString() as keyof typeof moods] || moods['0']
  }

  const getEnergyData = (val: number) => {
    if (val < 0.3) return { emoji: '😴', label: 'Low', icon: Battery, color: 'text-blue-600' }
    if (val < 0.7) return { emoji: '😌', label: 'Medium', icon: Battery, color: 'text-purple-600' }
    return { emoji: '⚡', label: 'High', icon: BatteryFull, color: 'text-pink-600' }
  }

  const moodData = getMoodData(valence)
  const energyData = getEnergyData(arousal)

  if (submitted) {
    return (
      <div className={`${montserrat.className} relative group`}>
        {/* Success animation background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-green-50 to-teal-100/60 rounded-3xl blur-2xl opacity-60 animate-pulse" />
        
        <div className="relative p-10 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-green-50/80 backdrop-blur-xl border-2 border-emerald-300/50 shadow-2xl shadow-emerald-200/30 overflow-hidden">
          {/* Confetti-like sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles 
                key={i} 
                className={cn(
                  "absolute h-6 w-6 text-emerald-400 animate-bounce",
                  i === 0 && "top-4 left-4 animation-delay-200",
                  i === 1 && "top-6 right-8 animation-delay-400",
                  i === 2 && "top-12 left-1/3 animation-delay-600",
                  i === 3 && "bottom-8 right-12 animation-delay-800",
                  i === 4 && "bottom-6 left-8 animation-delay-1000",
                  i === 5 && "top-1/2 right-1/4 animation-delay-1200"
                )}
              />
            ))}
          </div>
          
          <div className="text-center py-8 relative z-10">
            {/* Animated checkmark */}
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-2xl opacity-40 animate-ping" />
              <div className="relative p-5 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-2xl">
                <CheckCircle className="h-16 w-16 text-white animate-bounce" strokeWidth={2.5} />
              </div>
            </div>

            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-4">
              Thanks for checking in! ✨
            </h3>
            <p className="text-emerald-700/80 text-lg leading-relaxed mb-6 max-w-md mx-auto">
              Your mood has been recorded. Keep building your wellness streak!
            </p>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 shadow-lg">
                <div className="text-3xl font-bold text-emerald-600">{moodData.emoji}</div>
                <div className="text-sm font-semibold text-emerald-700 mt-1">Mood: {moodData.label}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-green-200/50 shadow-lg">
                <div className="text-3xl font-bold text-green-600">{energyData.emoji}</div>
                <div className="text-sm font-semibold text-green-700 mt-1">Energy: {energyData.label}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-emerald-200/40">
              <Heart className="h-5 w-5 text-emerald-600 fill-current animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">
                Logged at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${montserrat.className} relative group`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E879B9]/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#F8A5C2]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] rounded-2xl blur-xl opacity-40 animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] shadow-xl border-2 border-white/50">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#C74585]">Quick Mood Check</h3>
                <p className="text-sm text-[#A03768]/60 font-medium">How are you feeling right now?</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 border-2 border-[#E879B9]/30 shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent">
                Daily Check-in
              </span>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Mood Valence with enhanced visuals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-bold text-[#C74585] flex items-center gap-3">
                  <span className="text-4xl transition-transform duration-300 hover:scale-125">
                    {moodData.emoji}
                  </span>
                  <div>
                    <div>How are you feeling?</div>
                    <div className="text-sm font-medium text-[#A03768]/60">Rate your current mood</div>
                  </div>
                </label>
                <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-white to-[#FFF5F9] border-2 border-[#E879B9]/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <moodData.icon className={cn("h-5 w-5", moodData.color)} />
                    <span className="text-base font-bold text-[#C74585]">
                      {moodData.label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] border-2 border-[#F8A5C2]/50 shadow-lg">
                <EnhancedSlider
                  value={valence}
                  onChange={setValence}
                  min={-2}
                  max={2}
                  step={1}
                  labels={['😢 Very Low', '😐 Neutral', '😄 Very Good']}
                  type="mood"
                />
              </div>
            </div>

            {/* Energy Level with enhanced visuals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-bold text-[#C74585] flex items-center gap-3">
                  <span className="text-4xl transition-transform duration-300 hover:scale-125">
                    {energyData.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#E879B9]" />
                      Energy Level
                    </div>
                    <div className="text-sm font-medium text-[#A03768]/60">How energized do you feel?</div>
                  </div>
                </label>
                <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-white to-[#FFF5F9] border-2 border-[#E879B9]/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <energyData.icon className={cn("h-5 w-5", energyData.color)} />
                    <span className="text-base font-bold text-[#C74585]">
                      {energyData.label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] border-2 border-[#F8A5C2]/50 shadow-lg">
                <EnhancedSlider
                  value={arousal}
                  onChange={setArousal}
                  min={0}
                  max={1}
                  step={0.1}
                  labels={['😴 Calm', '😌 Balanced', '⚡ Energized']}
                  type="energy"
                />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative w-full group/button overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-2xl blur-lg opacity-60 group-hover/button:opacity-100 transition-opacity duration-300" />
              <div className="relative px-8 py-5 rounded-2xl bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#C74585] border-2 border-white/30 shadow-2xl hover:shadow-[#E879B9]/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg font-bold text-white">Recording your mood...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5 text-white fill-current group-hover/button:animate-pulse" />
                    <span className="text-lg font-bold text-white">Record My Mood</span>
                    <Sparkles className="h-5 w-5 text-white group-hover/button:animate-spin" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
  )
}
