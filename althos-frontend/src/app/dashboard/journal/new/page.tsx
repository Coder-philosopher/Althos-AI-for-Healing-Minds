'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { createJournal } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'

export default function NewJournalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mood: {
      valence: [0],
      arousal: [0.5]
    }
  })
  const [loading, setLoading] = useState(false)
  const [includeAI, setIncludeAI] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.content.trim()) return

    setLoading(true)
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      const response = await createJournal(user.id, {
        title: formData.title || undefined,
        content: formData.content,
        mood: {
          valence: formData.mood.valence[0],
          arousal: formData.mood.arousal[0]
        },
        tags: tags.length > 0 ? tags : undefined
      })

      if (includeAI) {
        router.push(`/dashboard/journal/coach?entry=${response.data.id}&text=${encodeURIComponent(formData.content)}`)
      } else {
        router.push('/dashboard/journal')
      }
    } catch (error) {
      console.error('Failed to create journal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/journal" className="text-brand hover:text-brand-strong">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">New Journal Entry</h1>
            <p className="text-text-secondary">Express your thoughts and feelings</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Give your entry a title (optional)"
                    className="input text-xl font-semibold"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <textarea
                    placeholder="What's on your mind? Write about your day, thoughts, feelings, or anything you'd like to process..."
                    className="input min-h-[300px] resize-none text-base leading-relaxed"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tags (comma-separated, e.g. stress, family, exam)"
                    className="input"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood */}
            <div className="card">
              <h3 className="font-semibold text-text-primary mb-4">How are you feeling?</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-text-primary">
                      😢 Mood 😊
                    </label>
                    <span className="text-xs text-text-secondary">
                      {formData.mood.valence[0] === -2 ? 'Very sad' : 
                       formData.mood.valence[0] === -1 ? 'Sad' :
                       formData.mood.valence[0] === 0 ? 'Neutral' :
                       formData.mood.valence[0] === 1 ? 'Happy' : 'Very happy'}
                    </span>
                  </div>
                  <Slider
                    value={formData.mood.valence}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      mood: { ...prev.mood, valence: value }
                    }))}
                    min={-2}
                    max={2}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-text-primary">
                      😴 Energy ⚡
                    </label>
                    <span className="text-xs text-text-secondary">
                      {formData.mood.arousal[0] < 0.3 ? 'Low' : 
                       formData.mood.arousal[0] < 0.7 ? 'Medium' : 'High'}
                    </span>
                  </div>
                  <Slider
                    value={formData.mood.arousal}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      mood: { ...prev.mood, arousal: value }
                    }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            {/* AI Options */}
            <div className="card">
              <h3 className="font-semibold text-text-primary mb-4">AI Support</h3>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-text-primary">Get AI response</span>
                  <p className="text-sm text-text-secondary">
                    Receive empathetic feedback and personalized coping strategies
                  </p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : includeAI ? 'Save & Get AI Support' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
