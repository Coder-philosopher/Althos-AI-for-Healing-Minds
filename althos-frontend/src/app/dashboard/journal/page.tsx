'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getJournals } from '@/lib/api'
import { Journal } from '@/lib/types'
import { PenTool, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function JournalPage() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      getJournals(user.id, 20).then(data => {
        setJournals(data.data)
        setLoading(false)
      })
    }
  }, [user])

  const filteredJournals = journals.filter(journal =>
    journal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <PenTool className="h-8 w-8 text-brand" />
            Your Journal
          </h1>
          <p className="text-text-secondary">
            Express your thoughts and get personalized AI support
          </p>
        </div>
        <Link href="/dashboard/journal/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
          <input
            type="text"
            placeholder="Search your entries..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Journal List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="card text-center py-12">
            <PenTool className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchTerm ? 'No matching entries found' : 'Start Your Journey'}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchTerm 
                ? 'Try different search terms or create a new entry'
                : 'Writing can help you process thoughts and emotions. Start with anything on your mind.'
              }
            </p>
            <Link href="/dashboard/journal/new" className="btn-primary">
              Write Your First Entry
            </Link>
          </div>
        ) : (
          filteredJournals.map(journal => (
            <JournalCard key={journal.id} journal={journal} />
          ))
        )}
      </div>
    </div>
  )
}

function JournalCard({ journal }: { journal: Journal }) {
  const moodEmoji = journal.mood_valence !== undefined && journal.mood_valence !== null
    ? journal.mood_valence <= -1 ? '😢' : journal.mood_valence < 1 ? '😐' : '😊'
    : null

  return (
    <div className="card hover:shadow-2 transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {journal.title || 'Untitled Entry'}
            </h3>
            {moodEmoji && (
              <span className="text-2xl">{moodEmoji}</span>
            )}
          </div>
          <p className="text-text-secondary mb-3 line-clamp-3">
            {journal.content}
          </p>
          
          <div className="flex items-center justify-between">
            <time className="text-sm text-text-secondary">
              {new Date(journal.created_at).toLocaleString()}
            </time>
            
            {journal.tags && journal.tags.length > 0 && (
              <div className="flex gap-1">
                {journal.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-info/20 text-blue-800 rounded-pill text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Link 
        href={`/dashboard/journal/coach?entry=${journal.id}`}
        className="btn-secondary w-full mt-4"
      >
        Get AI Support
      </Link>
    </div>
  )
}
