'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'
import { generateAIMusic } from '@/lib/api'
import { Sparkles, Music, Zap, Heart, Play, Pause, Download, X } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['600'] })

const defaultAudioURL =
  'https://storage.googleapis.com/althos-music-bucket/music/0be07fe4-72af-4dcb-8a56-8f9925b449c7/1761943642056_7fcee0a5-a5d6-4574-8db0-391465881359.mp3'

const promptLibrary = [
  'Bright and cheerful instrumental music full of hope and energy.',
  'Uplifting melody radiating joy and positivity.',
  'Happy and playful tune with light, bouncy rhythms.',
  'Soothing instrumental that brings comfort and smiles.',
  'Energetic beat perfect for motivation and happiness.',
  'Warm and sunny music evoking bright afternoons.',
  'Gentle and inspiring music to brighten your day.',
  'Feel-good instrumental with peaceful harmonies.',
  'Content and cheerful melody to lift your spirits.',
  'Light-hearted music to accompany joyful moments.',
]

function EnhancedSlider({
  value,
  onChange,
  min,
  max,
  step,
  labels,
  type = 'mood',
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
  const color =
    type === 'mood'
      ? value <= -1
        ? 'from-rose-400 to-pink-500'
        : value === 0
        ? 'from-amber-400 to-yellow-500'
        : 'from-emerald-400 to-green-500'
      : 'from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2]'

  return (
    <div className="relative py-3">
      {/* Track */}
      <div className="relative h-4 bg-gradient-to-r from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-full shadow-inner border-2 border-[#F8A5C2]/30">
        {/* Filled track */}
        <div
          className={cn(
            'absolute h-full rounded-full transition-all duration-300 shadow-lg',
            `bg-gradient-to-r ${color}`
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
        </div>

        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-transparent appearance-none cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-4 border-white shadow-lg bg-gradient-to-br cursor-pointer z-10"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-1 select-none text-xs font-medium text-pink-500">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  )
}

export default function MusicPage() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [moodValence, setMoodValence] = useState(0)
  const [moodArousal, setMoodArousal] = useState(0.5)
  const [audioErrorOccurred, setAudioErrorOccurred] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Combine text and prompt
  const combinedPrompt = useMemo(() => {
    if (selectedPrompt && text.trim()) {
      if (selectedPrompt.toLowerCase().includes(text.trim().toLowerCase())) return selectedPrompt
      return `${text.trim()} ${selectedPrompt}`
    }
    if (selectedPrompt) return selectedPrompt
    return text.trim()
  }, [text, selectedPrompt])

  const getMoodLabel = useCallback(
    (val: number) => {
      if (val <= -1) return 'sad'
      if (val >= 1 && moodArousal >= 0.5) return 'happy'
      if (moodArousal >= 0.7) return 'energetic'
      if (moodArousal <= 0.2) return 'calm'
      return 'neutral'
    },
    [moodArousal]
  )

  const handleGenerate = async () => {
    if (!user || !combinedPrompt) return
    setLoading(true)
    setAudioErrorOccurred(false)
    setAudioUrl(null)
    setIsPlaying(false)
    setTooltipVisible(true)
    try {
      const payload = {
        mood_text: combinedPrompt,
        mood_label: getMoodLabel(moodValence),
      }
      const resp = await generateAIMusic(user.id, payload)
      if (resp?.data?.audioUrl) {
        setAudioUrl(resp.data.audioUrl)
      } else {
        throw new Error('No audio URL returned')
      }
    } catch {
      // Suppress error message and play fallback audio
      setAudioErrorOccurred(true)
      setAudioUrl(defaultAudioURL)
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  // Sync play state with audio element events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', () => setIsPlaying(false))
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  // When new audioUrl loaded, auto-hide tooltip after 8 sec
  useEffect(() => {
    if (audioUrl) {
      const timeout = setTimeout(() => setTooltipVisible(false), 8000)
      return () => clearTimeout(timeout)
    }
  }, [audioUrl])

  // Prevent unwanted download link navigation
  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!audioUrl) {
      e.preventDefault()
      return
    }
  }

  return (
    <main className={`${montserrat.className} max-w-3xl mx-auto p-6 sm:p-10 space-y-10`}>
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold flex justify-center items-center gap-3 text-[#BE5985]">
          <Music className="h-10 w-10 text-[#FFB8E0]" />
          AI Mood Music Generator
        </h1>
        <p className="mt-2 text-[#BE5985]/80 max-w-xl mx-auto text-base sm:text-lg">
          Describe how you feel or pick a prompt to get uplifting AI-generated instrumental music.
        </p>
      </header>

      {/* Inputs */}
      <section className="space-y-6">
        <label htmlFor="mood-input" className="block font-semibold text-[#BE5985] mb-2">
          Your mood description
        </label>
        <textarea
          id="mood-input"
          className="w-full rounded-xl border border-[#FFB8E0]/60 bg-[#FFEDFA]/50 px-4 py-3 text-[#BE5985] text-base placeholder-[#BE5985]/50 focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/80 focus:border-none resize-y min-h-[100px] transition"
          placeholder="E.g. feeling joyful, bright, and free..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <p className="text-sm text-[#BE5985]/60 mb-4">
          You can type your own mood/idea or choose a prompt below.
        </p>

        <fieldset>
          <legend className="font-semibold text-[#BE5985] mb-3 select-none">Prompt Library</legend>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto">
            {promptLibrary.map(prompt => (
              <li key={prompt}>
                <button
                  type="button"
                  onClick={() => setSelectedPrompt(prompt)}
                  className={cn(
                    'w-full text-left rounded-lg px-4 py-2 border transition text-pink-500',
                    selectedPrompt === prompt
                      ? 'bg-[#EC7FA9]/30 border-[#EC7FA9] font-semibold'
                      : 'bg-white border-[#FFB8E0]/60 hover:border-[#EC7FA9]'
                  )}
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Mood Valence */}
          <div>
            <label className="font-semibold text-[#BE5985] flex items-center gap-2 mb-1">
              <Heart className="text-[#EC7FA9]" /> Mood Valence ({moodValence.toFixed(1)})
            </label>
            <EnhancedSlider
              min={-2}
              max={2}
              step={0.1}
              value={moodValence}
              onChange={setMoodValence}
              labels={['Sad', 'Neutral', 'Happy']}
              type="mood"
            />
          </div>

          {/* Mood Energy */}
          <div>
            <label className="font-semibold text-[#BE5985] flex items-center gap-2 mb-1">
              <Zap className="text-[#EC7FA9]" /> Mood Energy ({moodArousal.toFixed(2)})
            </label>
            <EnhancedSlider
              min={0}
              max={1}
              step={0.05}
              value={moodArousal}
              onChange={setMoodArousal}
              labels={['Calm', 'Balanced', 'Energized']}
              type="energy"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!combinedPrompt || loading}
          className="w-full rounded-xl py-3 text-white font-semibold bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] shadow-xl hover:shadow-[#EC7FA9]/70 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <Sparkles />
          )}
          {loading ? 'Generating Music...' : 'Generate AI Music'}
        </button>

        {/* Tooltip about generation time */}
        {loading && tooltipVisible && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-xs bg-[#EC7FA9]/95 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-3 select-none z-50">
            <span>
              Audio generation may take up to a minute for free users. Upgrade to{' '}
              <Link href="/pricing" className="underline font-semibold">
                Pro
              </Link>{' '}
              for faster generation.
            </span>
            <button
              onClick={() => setTooltipVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Audio Player with controls */}
        {audioUrl && (
          <section className="mt-8 space-y-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              className="w-full rounded-lg shadow-lg focus:outline-none"
              controls={false}
            />
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={togglePlay}
                className="rounded-full bg-[#EC7FA9] p-3 shadow-lg text-white hover:bg-[#BE5985] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC7FA9]"
                type="button"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>

              <a
                title='audio'
                href={audioUrl}
                download="AI_generated_music.mp3"
                onClick={handleDownloadClick}
                className="rounded-full bg-[#BE5985] p-3 shadow-lg text-white hover:bg-[#EC7FA9] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BE5985]"
              >
                <Download className="h-6 w-6" />
              </a>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
