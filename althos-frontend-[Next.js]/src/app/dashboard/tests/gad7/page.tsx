'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Brain, ArrowLeft, CheckCircle, AlertTriangle, Info, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface GAD7Question {
  id: number
  text: string
  options: { value: number; label: string }[]
}

interface GAD7Result {
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  description: string
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

const gad7Questions: GAD7Question[] = [
  { id: 1, text: "Feeling nervous, anxious, or on edge", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 2, text: "Not being able to stop or control worrying", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 3, text: "Worrying too much about different things", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 4, text: "Trouble relaxing", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 5, text: "Being so restless that it's hard to sit still", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 6, text: "Becoming easily annoyed or irritable", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
  { id: 7, text: "Feeling afraid as if something awful might happen", options: [
    { value: 0, label: "Not at all" }, { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }
  ]},
]

export default function GAD7Page() {
  const { user } = useAuth()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<GAD7Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const calculateResult = (answers: Record<number, number>): GAD7Result => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    
    let severity: GAD7Result['severity']
    let description: string
    let recommendations: string[]
    let riskLevel: GAD7Result['riskLevel']

    if (totalScore <= 4) {
      severity = 'minimal'
      description = 'Minimal anxiety symptoms. This is within the normal range.'
      riskLevel = 'low'
      recommendations = [
        'Continue with your current self-care practices',
        'Maintain regular exercise and healthy sleep habits',
        'Practice mindfulness or relaxation techniques',
        'Stay connected with supportive friends and family'
      ]
    } else if (totalScore <= 9) {
      severity = 'mild'
      description = 'Mild anxiety symptoms that may benefit from attention and self-care strategies.'
      riskLevel = 'low'
      recommendations = [
        'Try stress reduction techniques like deep breathing or meditation',
        'Consider regular physical activity to manage anxiety',
        'Practice good sleep hygiene',
        'Talk to trusted friends, family, or a counselor if symptoms persist'
      ]
    } else if (totalScore <= 14) {
      severity = 'moderate'
      description = 'Moderate anxiety symptoms that may significantly impact daily functioning.'
      riskLevel = 'medium'
      recommendations = [
        'Consider speaking with a mental health professional',
        'Practice daily relaxation or mindfulness exercises',
        'Limit caffeine and alcohol consumption',
        'Maintain a regular routine and prioritize self-care',
        'Join a support group or seek peer support'
      ]
    } else {
      severity = 'severe'
      description = 'Severe anxiety symptoms that likely require professional intervention.'
      riskLevel = 'high'
      recommendations = [
        'Strongly consider consulting with a mental health professional',
        'Contact your healthcare provider for evaluation and treatment options',
        'Consider therapy options such as CBT or counseling',
        'Reach out to support systems immediately',
        'Practice grounding techniques during anxiety episodes'
      ]
    }

    return { score: totalScore, severity, description, recommendations, riskLevel }
  }

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < gad7Questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else if (Object.keys(newAnswers).length === gad7Questions.length) {
      setTimeout(() => handleSubmit(newAnswers), 500)
    }
  }

  const handleSubmit = async (finalAnswers: Record<number, number>) => {
    setLoading(true)
    try {
      const calculatedResult = calculateResult(finalAnswers)
      setResult(calculatedResult)
      setIsComplete(true)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minimal': return 'text-green-600 bg-green-100'
      case 'mild': return 'text-blue-600 bg-blue-100'
      case 'moderate': return 'text-orange-600 bg-orange-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'medium': return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <Info className="h-5 w-5 text-gray-500" />
    }
  }


  if (showInstructions) {
    return (
      <div className={`${montserrat.className} space-y-8 relative`}>
        {/* Floating background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/dashboard/tests" 
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] hover:shadow-xl hover:shadow-[#EC7FA9]/25 transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                GAD-7 Anxiety Assessment
              </h1>
              <p className="text-[#BE5985]/70 leading-relaxed">
                Generalized Anxiety Disorder 7-item scale
              </p>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200/50">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#BE5985]">Before We Begin</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-[#BE5985] mb-3">What is GAD-7?</h3>
                  <p className="text-[#BE5985]/80 leading-relaxed">
                    The GAD-7 is a scientifically validated screening tool for generalized anxiety disorder. 
                    It helps identify anxiety symptoms and their severity over the past two weeks.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#BE5985] mb-3">Instructions</h3>
                  <div className="space-y-2 text-[#BE5985]/80">
                    <p>• Answer based on how you've been feeling over the <strong>past 2 weeks</strong></p>
                    <p>• Choose the response that best describes how often you've experienced each symptom</p>
                    <p>• There are no right or wrong answers - be as honest as possible</p>
                    <p>• This assessment takes about 2-3 minutes to complete</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 border border-[#FFB8E0]/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#BE5985] mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#BE5985] mb-1">Important Note</h4>
                      <p className="text-sm text-[#BE5985]/80">
                        This is a screening tool, not a diagnostic test. For professional evaluation and treatment, 
                        please consult with a qualified mental health professional.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Previous Scores */}
                <div>
                  <h3 className="font-bold text-[#BE5985] mb-3">Previous Scores</h3>
                  <div className="space-y-2 text-[#BE5985]/80">
                    <p>No previous scores found</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      <Target className="h-5 w-5" />
                      Start Assessment
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete && result) {
    return (
      <div className={`${montserrat.className} space-y-8 relative`}>
        {/* Floating background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/dashboard/tests" 
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#BE5985]">Your GAD-7 Results</h1>
            </div>
          </div>

          {/* Results Card */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {result.riskLevel === 'low' ? '🌟' : result.riskLevel === 'medium' ? '⚠️' : '🚨'}
              </div>
              <h2 className="text-3xl font-bold text-[#BE5985] mb-4">
                Score: {result.score}/21
              </h2>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-lg ${getSeverityColor(result.severity)}`}>
                {getRiskIcon(result.riskLevel)}
                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Anxiety
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#BE5985] mb-3">What This Means</h3>
                <p className="text-[#BE5985]/80 leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#BE5985] mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFEDFA]/40">
                      <CheckCircle className="h-5 w-5 text-[#EC7FA9] mt-0.5" />
                      <span className="text-[#BE5985]/80">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.riskLevel === 'high' && (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-2">Immediate Support</h4>
                      <p className="text-red-700 mb-3">
                        Your results suggest significant anxiety symptoms. Please consider reaching out for professional support.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-red-600">
                          • National Suicide Prevention Lifeline: 988
                        </p>
                        <p className="text-sm text-red-600">
                          • Crisis Text Line: Text HOME to 741741
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => window.location.href = '/dashboard/tests'}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:-translate-y-1 transition-all duration-300"
                >
                  View All Assessments
                </button>
                <button
                  onClick={() => {
                    setShowInstructions(true)
                    setIsComplete(false)
                    setResult(null)
                    setAnswers({})
                    setCurrentQuestion(0)
                  }}
                  className="px-6 py-3 bg-white border-2 border-[#FFB8E0] text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFEDFA]/30 transition-all duration-300"
                >
                  Take Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/tests" 
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 text-[#BE5985] hover:text-[#EC7FA9] transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-[#BE5985]">GAD-7 Assessment</h1>
          </div>
          
          <div className="text-sm text-[#BE5985]/70">
            Question {currentQuestion + 1} of {gad7Questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-[#FFB8E0]/30 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / gad7Questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#BE5985] mb-4">
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p className="text-2xl text-[#BE5985] leading-relaxed">
              {gad7Questions[currentQuestion].text}?
            </p>
          </div>

          <div className="space-y-4">
            {gad7Questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(gad7Questions[currentQuestion].id, option.value)}
                className={`w-full p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                  answers[gad7Questions[currentQuestion].id] === option.value
                    ? 'border-[#EC7FA9] bg-gradient-to-r from-[#FFEDFA] to-[#FFB8E0]/30 shadow-lg shadow-[#EC7FA9]/20'
                    : 'border-[#FFB8E0]/40 bg-white/50 hover:border-[#EC7FA9]/50 hover:bg-[#FFEDFA]/30'
                } group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    answers[gad7Questions[currentQuestion].id] === option.value
                      ? 'border-[#EC7FA9] bg-[#EC7FA9]'
                      : 'border-[#FFB8E0] group-hover:border-[#EC7FA9]'
                  }`}>
                    {answers[gad7Questions[currentQuestion].id] === option.value && (
                      <CheckCircle className="w-6 h-6 text-white -m-0.5" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-[#BE5985]">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#BE5985]/70 font-medium">Calculating your results...</p>
          </div>
        )}
      </div>
    </div>
  )
}
