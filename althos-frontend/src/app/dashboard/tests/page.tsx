'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getTestInsights } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, TrendingUp, History, Info } from 'lucide-react'
import Link from 'next/link'

interface Correlation {
  strength: 'strong' | 'moderate' | 'weak'
  note: string
}

interface Trend {
  date: string;
  score: number;
  testType: string;
}

interface Insights {
  trends: Trend[]
  correlations: Correlation[]
}

export default function TestsPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getTestInsights(user.id).then(data => {
        setInsights(data.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [user])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-brand" />
          Mental Health Assessments
        </h1>
        <p className="text-text-secondary">
          Track your mental wellness with standardized screening tools
        </p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Available Tests
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <TestCard
              title="PHQ-9 Depression Screening"
              description="A 9-question assessment to screen for depression symptoms"
              duration="5 minutes"
              href="/dashboard/tests/phq9"
              color="info"
            />
            <TestCard
              title="GAD-7 Anxiety Screening"
              description="A 7-question assessment to screen for anxiety symptoms"
              duration="3 minutes"
              href="/dashboard/tests/gad7"
              color="success"
            />
          </div>

          <div className="card bg-warning/10 border-warning/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary mb-1">Important Note</h3>
                <p className="text-text-secondary text-sm">
                  These are screening tools, not diagnostic tests. Results should not replace 
                  professional medical advice. If you&apos;re experiencing severe symptoms, please 
                  consult a healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          {loading ? (
            <div className="card">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : insights && insights.trends.length > 0 ? (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Score Trends</h3>
                {/* Add chart component here */}
                <p className="text-text-secondary">Score visualization coming soon</p>
              </div>

              {insights.correlations.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Insights</h3>
                  <div className="space-y-3">
                    {insights.correlations.map((correlation: Correlation, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          correlation.strength === 'strong' ? 'bg-success' :
                          correlation.strength === 'moderate' ? 'bg-warning' : 'bg-danger'
                        }`} />
                        <p className="text-text-secondary">{correlation.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Data Yet
              </h3>
              <p className="text-text-secondary mb-6">
                Complete some assessments to see your trends and insights
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Test History</h3>
            <p className="text-text-secondary">Test history feature coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TestCardProps {
  title: string
  description: string
  duration: string
  href: string
  color: 'info' | 'success' | 'warning' | 'calm'
}

function TestCard({ title, description, duration, href, color }: TestCardProps) {
  const colorClasses = {
    info: 'bg-info/10 border-info/20 hover:bg-info/20',
    success: 'bg-success/10 border-success/20 hover:bg-success/20',
    warning: 'bg-warning/10 border-warning/20 hover:bg-warning/20',
    calm: 'bg-calm/10 border-calm/20 hover:bg-calm/20'
  }

  return (
    <Link href={href} className={`card ${colorClasses[color]} transition-colors group`}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="text-text-secondary">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            ⏱️ {duration}
          </span>
          <span className="text-brand font-medium">
            Take Assessment →
          </span>
        </div>
      </div>
    </Link>
  )
}
