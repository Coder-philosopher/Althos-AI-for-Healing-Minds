'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getWeeklySummary } from '@/lib/api'
import { 
  Brain, Heart, Star, Headphones, 
  Calendar, Clock, Shield, Phone 
} from 'lucide-react'
import Link from 'next/link'

export default function WellnessPage() {
  const { user } = useAuth()
  const [weeklySummary, setWeeklySummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateSummary = async (withAudio = false) => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await getWeeklySummary(user.id, withAudio)
      setWeeklySummary(response.data)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-brand" />
          Wellness Hub
        </h1>
        <p className="text-text-secondary">
          AI-powered insights, support resources, and personalized wellness tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand" />
                Weekly Growth Story
              </h3>
              <button
                onClick={() => generateSummary(true)}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Headphones className="h-4 w-4" />
                {loading ? 'Generating...' : 'Generate Summary'}
              </button>
            </div>

            {weeklySummary ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-success/10 to-info/10 border border-success/20 rounded-lg p-6">
                  <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-brand" />
                    {weeklySummary.metaphor}
                  </h4>
                  <p className="text-text-secondary leading-relaxed">
                    {weeklySummary.summary_text}
                  </p>
                </div>

                {weeklySummary.audio_url && (
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Headphones className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Listen to Your Story</span>
                    </div>
                    <audio 
                      controls 
                      className="w-full"
                      src={weeklySummary.audio_url}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                <div className="text-xs text-text-secondary">
                  Generated for period: {weeklySummary.period.from} to {weeklySummary.period.to}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Generate Your Weekly Story
                </h4>
                <p className="text-text-secondary mb-6">
                  Get an AI-generated reflection on your emotional journey this week, 
                  complete with insights and optional audio narration.
                </p>
                <button
                  onClick={() => generateSummary(true)}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Star className="h-4 w-4" />
                  Create My Story
                </button>
              </div>
            )}
          </div>

          {/* Kindness Highlights */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Heart className="h-5 w-5 text-brand" />
                Kindness Highlights
              </h3>
              <Link href="/dashboard/wellness/kindness" className="text-brand hover:text-brand-strong text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Mock kindness highlights */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <p className="text-green-800 mb-2">&quot;Helped my roommate with their project when they were stressed&quot;</p>
                <div className="text-xs text-green-600">From journal entry • 2 days ago</div>
              </div>
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <p className="text-blue-800 mb-2">&quot;Called my parents even though I was busy - they sounded happy&quot;</p>
                <div className="text-xs text-blue-600">From journal entry • 4 days ago</div>
              </div>
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <p className="text-orange-800 mb-2">&quot;Practiced guitar for 30 minutes - felt good to create something&quot;</p>
                <div className="text-xs text-orange-600">From mood entry • 1 week ago</div>
              </div>
            </div>

            <Link href="/dashboard/wellness/kindness" className="btn-secondary w-full mt-4">
              Discover More Kindness
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Crisis Support */}
          <div className="card bg-danger/10 border-danger/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Need Support?</h3>
            </div>
            <p className="text-red-700 text-sm mb-4">
              If you&apos;re experiencing crisis or having thoughts of self-harm, help is available 24/7.
            </p>
            <div className="space-y-2">
              <a href="tel:14416" className="flex items-center gap-2 text-red-800 hover:text-red-900 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Tele-MANAS: 14416
              </a>
              <a href="tel:18005990019" className="flex items-center gap-2 text-red-800 hover:text-red-900 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Kiran: 1800-599-0019
              </a>
            </div>
            <Link href="/dashboard/wellness/distress" className="btn-secondary w-full mt-4 text-sm">
              Get More Resources
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">Wellness Tools</h3>
            <div className="space-y-3">
              <Link href="/dashboard/journal/new" className="btn-secondary w-full flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5-Min Journal
              </Link>
              <button className="btn-secondary w-full flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Breathing Exercise
              </button>
              <Link href="/dashboard/wellness/summary" className="btn-secondary w-full flex items-center gap-2">
                <Star className="h-4 w-4" />
                Growth Insights
              </Link>
            </div>
          </div>

          {/* Wellness Score */}
          <div className="card">
            <h4 className="font-medium text-text-primary mb-3">Current Wellness</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand mb-2">Good</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-brand h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
              <p className="text-xs text-text-secondary">
                Based on recent mood and journal activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
