'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getJournals } from '@/lib/api'
import { Journal } from '@/lib/types'
import { PenTool, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function RecentJournals() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getJournals(user.id, 3).then(data => {
        setJournals(data.data)
        setLoading(false)
      })
    }
  }, [user])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <PenTool className="h-5 w-5 text-brand" />
          Recent Journals
        </h3>
        <Link href="/dashboard/journal" className="text-brand hover:text-brand-strong text-sm font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : journals.length === 0 ? (
        <div className="text-center py-8">
          <PenTool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">No journal entries yet</p>
          <Link href="/dashboard/journal/new" className="btn-primary">
            Write Your First Entry
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map(journal => (
            <div key={journal.id} className="border border-border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary mb-1">
                    {journal.title || 'Untitled Entry'}
                  </h4>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-2">
                    {journal.content.substring(0, 100)}...
                  </p>
                  <time className="text-xs text-text-secondary">
                    {new Date(journal.created_at).toLocaleDateString()}
                  </time>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary ml-2" />
              </div>
            </div>
          ))}
          
          <Link href="/dashboard/journal/new" className="btn-secondary w-full">
            Write New Entry
          </Link>
        </div>
      )}
    </div>
  )
}
