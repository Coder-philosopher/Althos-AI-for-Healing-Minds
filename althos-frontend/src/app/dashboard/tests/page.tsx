'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getTestInsights } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, TrendingUp, History, Info, Clock, Star, Award, Target, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

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
  const [activeTab, setActiveTab] = useState('available')

  useEffect(() => {
    if (user) {
      getTestInsights(user.id).then(data => {
        setInsights(data.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [user])

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[60%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
            <Brain className="h-8 w-8 text-white" />
          </div>
          Mental Health Assessments
        </h1>
        <p className="text-[#BE5985]/70 leading-relaxed">
          Track your mental wellness with standardized screening tools and gain valuable insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 relative z-10">
        {/* Enhanced Tab Navigation */}
        <div className="p-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20">
          <TabsList className="grid w-full grid-cols-3 bg-transparent gap-1">
            <TabsTrigger 
              value="available" 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'available' 
                  ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg shadow-[#EC7FA9]/30' 
                  : 'text-[#BE5985] hover:bg-[#FFEDFA]/50'
              }`}
            >
              <Brain className="h-4 w-4" />
              Available Tests
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'insights' 
                  ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg shadow-[#EC7FA9]/30' 
                  : 'text-[#BE5985] hover:bg-[#FFEDFA]/50'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white shadow-lg shadow-[#EC7FA9]/30' 
                  : 'text-[#BE5985] hover:bg-[#FFEDFA]/50'
              }`}
            >
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Available Tests Tab */}
        <TabsContent value="available" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <TestCard
              title="PHQ-9 Depression Screening"
              description="A comprehensive 9-question assessment to screen for depression symptoms and severity"
              duration="5 minutes"
              href="/dashboard/tests/phq9"
              color="info"
              icon="🧠"
              difficulty="Beginner"
            />
            <TestCard
              title="GAD-7 Anxiety Screening"
              description="A focused 7-question assessment to identify and measure anxiety symptoms"
              duration="3 minutes"
              href="/dashboard/tests/gad7"
              color="success"
              icon="💚"
              difficulty="Beginner"
            />
          </div>

          {/* Important Note */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/90 to-amber-50/90 backdrop-blur-md border border-orange-200/50 shadow-xl shadow-orange-200/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-amber-200/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
            <Sparkles className="absolute top-4 right-4 h-5 w-5 text-orange-400/60 animate-pulse" />
            
            <div className="flex gap-4 relative z-10">
              <div className="p-3 rounded-2xl bg-orange-200 shadow-inner flex-shrink-0">
                <Info className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                  Important Note
                  <Target className="h-4 w-4" />
                </h3>
                <p className="text-orange-700 leading-relaxed">
                  These are screening tools, not diagnostic tests. Results should not replace 
                  professional medical advice. If you're experiencing severe symptoms, please 
                  consult a healthcare provider immediately.
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-orange-600">
                  <Award className="h-4 w-4" />
                  <span>Standardized & Evidence-Based Tools</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          {loading ? (
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#FFB8E0]/40 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#FFB8E0]/40 rounded w-1/2"></div>
                    <div className="h-3 bg-[#FFB8E0]/30 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="h-3 bg-[#FFB8E0]/30 rounded w-full"></div>
                <div className="h-3 bg-[#FFB8E0]/30 rounded w-2/3"></div>
              </div>
            </div>
          ) : insights && insights.trends.length > 0 ? (
            <div className="space-y-6">
              {/* Score Trends */}
              <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-[#BE5985] mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Score Trends & Progress
                  </h3>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                    <p className="text-[#BE5985]/80 text-center">📊 Advanced visualization coming soon!</p>
                    <p className="text-[#BE5985]/60 text-sm text-center mt-2">Track your progress over time with interactive charts</p>
                  </div>
                </div>
              </div>

              {/* Correlations */}
              {insights.correlations.length > 0 && (
                <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-[#BE5985] mb-6 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      Personalized Insights
                    </h3>
                    
                    <div className="space-y-4">
                      {insights.correlations.map((correlation: Correlation, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 hover:shadow-lg hover:shadow-[#FFB8E0]/30 transition-all duration-300 group/insight"
                          style={{ animationDelay: `${index * 200}ms` }}
                        >
                          <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 shadow-inner transition-transform duration-300 group-hover/insight:scale-110 ${
                            correlation.strength === 'strong' ? 'bg-green-400 shadow-green-200' :
                            correlation.strength === 'moderate' ? 'bg-yellow-400 shadow-yellow-200' : 
                            'bg-red-400 shadow-red-200'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                correlation.strength === 'strong' ? 'bg-green-100 text-green-700' :
                                correlation.strength === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {correlation.strength.toUpperCase()}
                              </span>
                              <span className="text-xs text-[#BE5985]/60">correlation</span>
                            </div>
                            <p className="text-[#BE5985]/80 leading-relaxed">{correlation.note}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#BE5985]/50 group-hover/insight:text-[#EC7FA9] group-hover/insight:translate-x-1 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/10 rounded-3xl blur-xl"></div>
              <div className="relative z-10">
                <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-[#BE5985]/50" />
                </div>
                <h3 className="text-xl font-bold text-[#BE5985] mb-3">
                  No Data Yet
                </h3>
                <p className="text-[#BE5985]/70 mb-6 leading-relaxed max-w-md mx-auto">
                  Complete some assessments to see your trends, insights, and personalized recommendations
                </p>
                <Link 
                  href="#available" 
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <Brain className="h-4 w-4" />
                  Take Your First Assessment
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="p-12 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/10 rounded-3xl blur-xl"></div>
            <div className="relative z-10">
              <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <History className="h-12 w-12 text-[#BE5985]/50" />
              </div>
              <h3 className="text-xl font-bold text-[#BE5985] mb-3">
                Test History Coming Soon
              </h3>
              <p className="text-[#BE5985]/70 leading-relaxed max-w-md mx-auto">
                View your complete assessment history, track progress over time, and download reports for healthcare providers
              </p>
            </div>
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
  icon: string
  difficulty: string
}

function TestCard({ title, description, duration, href, color, icon, difficulty }: TestCardProps) {
  const colorConfig = {
    info: {
      bg: 'from-blue-50/90 to-indigo-50/90',
      border: 'border-blue-200/50',
      shadow: 'shadow-blue-200/20',
      hoverColor: 'hover:text-blue-600',
      difficultyBg: 'bg-blue-100 text-blue-700'
    },
    success: {
      bg: 'from-green-50/90 to-emerald-50/90',
      border: 'border-green-200/50',
      shadow: 'shadow-green-200/20',
      hoverColor: 'hover:text-green-600',
      difficultyBg: 'bg-green-100 text-green-700'
    },
    warning: {
      bg: 'from-orange-50/90 to-amber-50/90',
      border: 'border-orange-200/50',
      shadow: 'shadow-orange-200/20',
      hoverColor: 'hover:text-orange-600',
      difficultyBg: 'bg-orange-100 text-orange-700'
    },
    calm: {
      bg: 'from-purple-50/90 to-violet-50/90',
      border: 'border-purple-200/50',
      shadow: 'shadow-purple-200/20',
      hoverColor: 'hover:text-purple-600',
      difficultyBg: 'bg-purple-100 text-purple-700'
    }
  }

  const config = colorConfig[color]

  return (
    <Link 
      href={href} 
      className={`group block p-8 rounded-3xl bg-gradient-to-br ${config.bg} backdrop-blur-md border ${config.border} shadow-xl ${config.shadow} hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden`}
    >
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
      <Sparkles className="absolute top-4 right-4 h-4 w-4 text-current opacity-40 group-hover:rotate-180 transition-transform duration-500" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="text-4xl">{icon}</div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.difficultyBg}`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        <div>
          <h3 className={`text-xl font-bold text-gray-800 group-hover:text-[#BE5985] transition-colors duration-300 mb-2`}>
            {title}
          </h3>
          <p className={`text-gray-600 leading-relaxed mb-4`}>
            {description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-current/10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className={`flex items-center gap-2 font-semibold ${config.hoverColor} transition-colors duration-300`}>
            <span>Take Assessment</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  )
}
