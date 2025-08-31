'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { getJournalCoaching } from '@/lib/api'
import { JournalCoachResponse } from '@/lib/types'
import { ArrowLeft, Heart, Lightbulb, Clock, AlertTriangle, Phone, Bot, Sparkles, Star, Shield, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

function JournalCoachContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [response, setResponse] = useState<JournalCoachResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedAction, setExpandedAction] = useState<number | null>(null)

  const entryId = searchParams.get('entry')
  const text = searchParams.get('text')

  useEffect(() => {
    if (!user || !text) {
      router.push('/dashboard/journal')
      return
    }

    const fetchCoaching = async () => {
      try {
        const result = await getJournalCoaching(user.id, {
          text,
          language_pref: 'English/Hinglish',
          tone_pref: 'warm'
        })
        setResponse(result.data)
      } catch (err) {
        setError('Failed to get AI response. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCoaching()
  }, [user, text, router])

  if (loading) {
    return (
      <div className={`${montserrat.className} max-w-6xl mx-auto space-y-8 relative`}>
        {/* Floating background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
        
        <div className="flex items-center gap-4 relative z-10">
          <Link 
            href="/dashboard/journal" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              AI Support & Guidance
            </h1>
            <p className="text-[#BE5985]/70 mt-1">Getting personalized support for your wellness journey...</p>
          </div>
        </div>

        {/* Loading Cards */}
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 bg-[#FFB8E0]/40 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-[#FFB8E0]/40 rounded w-1/3"></div>
                  <div className="h-4 bg-[#FFB8E0]/30 rounded w-full"></div>
                  <div className="h-4 bg-[#FFB8E0]/30 rounded w-4/5"></div>
                  <div className="h-4 bg-[#FFB8E0]/30 rounded w-3/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${montserrat.className} max-w-6xl mx-auto space-y-8 relative`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-100/20 to-red-200/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="flex items-center gap-4 relative z-10">
          <Link 
            href="/dashboard/journal" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              AI Support
            </h1>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-red-50/90 backdrop-blur-md border border-red-200/50 shadow-xl shadow-red-200/20 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-200/30 to-red-300/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 text-center">
            <div className="p-4 rounded-full bg-red-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-3">Unable to Get Response</h3>
            <p className="text-red-700 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/70 hover:-translate-y-1 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!response) {
    return null
  }

  const helplines = [
    { name: 'Tele-MANAS', phone: '14416', available: '24/7', description: 'National mental health helpline' },
    { name: 'Kiran Mental Health', phone: '1800-599-0019', available: '24/7', description: 'Multilingual support' },
    { name: 'iCall Psychosocial', phone: '022-25521111', available: 'Mon-Sat, 8 AM - 10 PM', description: 'Professional counseling' }
  ]

  return (
    <div className={`${montserrat.className} max-w-6xl mx-auto space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[50%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/journal" 
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#BE5985] flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              AI Support & Guidance
            </h1>
            <p className="text-[#BE5985]/70 mt-1">Personalized response to your journal entry</p>
          </div>
        </div>
        
        {/* AI Status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-[#BE5985]">AI Analysis Complete</span>
        </div>
      </div>

      {/* Risk Alert */}
      {(response.risk === 'high' || response.risk === 'med') && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-50/90 to-orange-50/90 backdrop-blur-md border border-red-200/50 shadow-xl shadow-red-200/20 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-200/30 to-orange-200/20 rounded-full blur-2xl animate-pulse" />
          <Sparkles className="absolute top-4 right-4 h-5 w-5 text-red-400/60 animate-bounce" />
          
          <div className="relative z-10">
            <div className="flex gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-red-100 shadow-lg flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  {response.risk === 'high' ? 'Immediate Support Available' : 'Support Resources'}
                </h3>
                <p className="text-red-700 leading-relaxed">
                  {response.risk === 'high' 
                    ? "We're concerned about you and want you to know that support is available right now. You don't have to face this alone."
                    : "It sounds like you're going through a difficult time. Professional support can make a real difference."
                  }
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-red-800">
                <Phone className="h-5 w-5" />
                Crisis Helplines (India) - Available Now:
              </h4>
              {helplines.map((helpline, index) => (
                <div 
                  key={helpline.name} 
                  className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-red-800">{helpline.name}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">{helpline.available}</span>
                    </div>
                    <a href={`tel:${helpline.phone}`} className="text-lg font-bold text-red-700 hover:text-red-800 hover:underline transition-colors duration-300">
                      {helpline.phone}
                    </a>
                    <p className="text-sm text-red-600">{helpline.description}</p>
                  </div>
                  <Shield className="h-5 w-5 text-red-500 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empathy Response */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md border border-blue-200/50 shadow-xl shadow-blue-200/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        <Sparkles className="absolute top-4 right-4 h-5 w-5 text-blue-400/60 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-200/50 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                Understanding & Validation
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </h3>
              <p className="text-blue-700 text-lg leading-relaxed">{response.empathy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reframe */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-md border border-green-200/50 shadow-xl shadow-green-200/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-green-200/30 transition-all duration-500">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        <Star className="absolute top-4 right-4 h-5 w-5 text-green-400/60 animate-bounce" />
        
        <div className="relative z-10">
          <div className="flex gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200/50 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                Gentle Perspective
                <Sparkles className="h-5 w-5 text-green-600" />
              </h3>
              <p className="text-green-700 text-lg leading-relaxed">{response.reframe}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coping Actions */}
      <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#BE5985] flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <Clock className="h-6 w-6 text-white" />
              </div>
              Personalized Coping Strategies
            </h3>
            <div className="px-4 py-2 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
              <span className="text-sm font-medium text-[#BE5985]">{response.actions.length} strategies</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {response.actions.map((action, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 hover:shadow-lg hover:shadow-[#FFB8E0]/30 transition-all duration-300 cursor-pointer group/action relative overflow-hidden"
                onClick={() => setExpandedAction(expandedAction === index ? null : index)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover/action:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#BE5985] text-lg mb-2 group-hover/action:text-[#EC7FA9] transition-colors duration-300">
                        {action.title}
                      </h4>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full">
                          <Clock className="h-3 w-3 text-[#EC7FA9]" />
                          <span className="text-xs font-medium text-[#BE5985]">{action.duration_mins} min</span>
                        </div>
                        <span className="text-xs font-medium text-[#BE5985] bg-[#FFB8E0]/40 px-2 py-1 rounded-full capitalize">
                          {action.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 text-[#BE5985]/50 group-hover/action:text-[#EC7FA9] transition-all duration-300 ${
                      expandedAction === index ? 'rotate-90' : ''
                    }`} />
                  </div>
                  
                  <div className={`transition-all duration-500 overflow-hidden ${
                    expandedAction === index ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'
                  }`}>
                    <ol className="space-y-3 text-sm text-[#BE5985]/80">
                      {action.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#EC7FA9] text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {stepIndex + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {expandedAction !== index && action.steps.length > 2 && (
                    <div className="mt-3 text-xs text-[#BE5985]/60 font-medium">
                      Click to see all {action.steps.length} steps...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Link 
          href="/dashboard/journal" 
          className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 text-center"
        >
          Back to Journal
        </Link>
        <Link 
          href="/dashboard/journal/new" 
          className="flex-1 px-6 py-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-0.5 transition-all duration-300 text-center relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
            Write Another Entry
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
    </div>
  )
}
export default function JournalCoachPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JournalCoachContent />
    </Suspense>
  )
}
