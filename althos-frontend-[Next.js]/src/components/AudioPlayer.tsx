'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Loader2, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/lib/auth'
import { generateJournalAudio, getSupportedLanguagesAudio } from '@/lib/api'

interface AudioPlayerProps {
  journalId: string
  defaultLanguage?: string
}

interface Language {
  code: string
  name: string
}

export function AudioPlayer({ journalId, defaultLanguage = 'en' }: AudioPlayerProps) {
  const { user } = useAuth()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [languageOpen, setLanguageOpen] = useState(false)

  // Load supported languages
  useEffect(() => {
    getSupportedLanguagesAudio().then(response => {
      setLanguages(response.data)
    })
  }, [])

  // Load audio when language changes
  useEffect(() => {
    if (user && selectedLanguage) {
      loadAudio(selectedLanguage)
    }
  }, [selectedLanguage, user])

  const loadAudio = async (language: string) => {
    try {
      setIsLoading(true)
      const response = await generateJournalAudio(user!.id, journalId, language)
      setAudioUrl(response.data.audioUrl)
    } catch (error) {
      console.error('Failed to load audio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * audioRef.current.duration
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectedLangName = languages.find(l => l.code === selectedLanguage)?.name || 'Select Language'

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFEDFA] to-[#FFB8E0]/30 border-2 border-[#FFB8E0]/50 shadow-xl relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EC7FA9]/5 to-[#BE5985]/5 animate-pulse"></div>
      
      <div className="relative z-10 space-y-4">
        {/* Header with language selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg">
              <Volume2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#BE5985]">Listen to AI Response</h3>
          </div>

          {/* Language Selector */}
          <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={languageOpen}
                className="w-[200px] justify-between bg-white/80 border-[#FFB8E0]/40 text-[#BE5985] hover:bg-white hover:text-[#EC7FA9]"
              >
                <Languages className="h-4 w-4 mr-2" />
                <span className="truncate">{selectedLangName}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        key={language.code}
                        value={language.code}
                        onSelect={(currentValue) => {
                          setSelectedLanguage(currentValue)
                          setLanguageOpen(false)
                          setIsPlaying(false)
                        }}
                      >
                        {language.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Audio Controls */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-[#EC7FA9] animate-spin" />
            <span className="ml-3 text-[#BE5985] font-medium">Generating audio...</span>
          </div>
        ) : audioUrl ? (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Playback Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div
                className="h-2 bg-white/50 rounded-full cursor-pointer relative overflow-hidden group"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-sm text-[#BE5985]/70 font-medium">
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:shadow-xl hover:scale-110 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white fill-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white fill-white ml-1" />
                  )}
                </Button>

                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-2 border-[#FFB8E0]/40 bg-white/80 hover:bg-white hover:border-[#EC7FA9]"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-[#BE5985]" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-[#BE5985]" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-[#BE5985]/70">
            Select a language to generate audio
          </div>
        )}
      </div>
    </div>
  )
}
