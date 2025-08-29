'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { getJournalCoaching } from '@/lib/api'
import { JournalCoachResponse } from '@/lib/types'
import { ArrowLeft, Heart, Lightbulb, Clock, AlertTriangle, Phone } from 'lucide-react'
import Link from 'next/link'

export default function JournalCoachPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [response, setResponse] = useState<JournalCoachResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/journal" className="text-brand hover:text-brand-strong">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">AI Support</h1>
            <p className="text-text-secondary">Getting personalized support...</p>
          </div>
        </div>

        <div className="card animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/journal" className="text-brand hover:text-brand-strong">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">AI Support</h1>
          </div>
        </div>

        <div className="card bg-danger/10 border-danger/20">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!response) {
    return null
  }

  const helplines = [
    { name: 'Tele-MANAS', phone: '14416', available: '24/7' },
    { name: 'Kiran Mental Health', phone: '1800-599-0019', available: '24/7' },
    { name: 'iCall Psychosocial', phone: '022-25521111', available: 'Mon-Sat, 8 AM - 10 PM' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/journal" className="text-brand hover:text-brand-strong">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">AI Support & Guidance</h1>
          <p className="text-text-secondary">Personalized response to your journal entry</p>
        </div>
      </div>

      {/* Risk Alert */}
      {(response.risk === 'high' || response.risk === 'med') && (
        <div className="card bg-danger/10 border-danger/30">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                {response.risk === 'high' ? 'Immediate Support Available' : 'Support Resources'}
              </h3>
              <p className="text-red-700 mb-4">
                {response.risk === 'high' 
                  ? "We're concerned about you. Please reach out for support right away."
                  : "It sounds like you're going through a difficult time. Support is available."
                }
              </p>
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-800">Crisis Helplines (India):</h4>
                {helplines.map(helpline => (
                  <div key={helpline.name} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Phone className="h-4 w-4 text-red-600" />
                    <div>
                      <span className="font-medium text-red-800">{helpline.name}: </span>
                      <a href={`tel:${helpline.phone}`} className="text-red-700 hover:underline">
                        {helpline.phone}
                      </a>
                      <span className="text-red-600 text-sm ml-2">({helpline.available})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empathy Response */}
      <div className="card bg-info/10 border-info/20">
        <div className="flex gap-3">
          <Heart className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-3">Understanding & Validation</h3>
            <p className="text-blue-700 leading-relaxed">{response.empathy}</p>
          </div>
        </div>
      </div>

      {/* Reframe */}
      <div className="card bg-success/10 border-success/20">
        <div className="flex gap-3">
          <Lightbulb className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-green-800 mb-3">Gentle Perspective</h3>
            <p className="text-green-700 leading-relaxed">{response.reframe}</p>
          </div>
        </div>
      </div>

      {/* Coping Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand" />
          Personalized Coping Strategies
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {response.actions.map((action, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:shadow-1 transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-text-primary">{action.title}</h4>
                <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-pill">
                  {action.duration_mins} min
                </span>
              </div>
              
              <ol className="space-y-2 text-sm text-text-secondary">
                {action.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-2">
                    <span className="text-brand font-medium">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-text-secondary capitalize bg-brand/10 text-brand px-2 py-1 rounded-pill">
                  {action.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/journal" className="btn-secondary flex-1">
          Back to Journal
        </Link>
        <Link href="/dashboard/journal/new" className="btn-primary flex-1">
          Write Another Entry
        </Link>
      </div>
    </div>
  )
}
