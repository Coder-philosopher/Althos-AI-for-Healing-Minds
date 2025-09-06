'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { submitPHQ9 } from '@/lib/api'
import { ArrowLeft, CheckCircle, Brain, Sparkles, Star, Award, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
]

const RESPONSE_OPTIONS = [
  { value: 0, label: "Not at all", color: "from-green-400 to-green-600" },
  { value: 1, label: "Several days", color: "from-yellow-400 to-yellow-600" },
  { value: 2, label: "More than half the days", color: "from-orange-400 to-orange-600" },
  { value: 3, label: "Nearly every day", color: "from-red-400 to-red-600" }
]

export default function PHQ9Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      }
    }, 500)
  }

  const handleSubmit = async () => {
    if (!user || answers.some(a => a === -1)) return

    setLoading(true)
    try {
      const response = await submitPHQ9(user.id, { answers })
      setResult(response.data)
    } catch (error) {
      console.error('Failed to submit test:', error)
    } finally {
      setLoading(false)
    }
  }

  const isComplete = answers.every(a => a !== -1)
  const progress = ((answers.filter(a => a !== -1).length) / PHQ9_QUESTIONS.length) * 100

  if (result) {
    const getSeverityColor = (severity: string) => {
      switch (severity.toLowerCase()) {
        case 'minimal': return 'from-green-400 to-green-600'
        case 'mild': return 'from-yellow-400 to-yellow-600'
        case 'moderate': return 'from-orange-400 to-orange-600'
        case 'severe': return 'from-red-400 to-red-600'
        default: return 'from-gray-400 to-gray-600'
      }
    }

    return (
      <div className={`${montserrat.className} max-w-4xl mx-auto space-y-8 relative`}>
        {/* Floating background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-100/20 to-emerald-200/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Success Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200/50 mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2">Assessment Complete! ✨</h1>
          <p className="text-[#BE5985]/70">Here are your PHQ-9 results with personalized insights</p>
        </div>

        {/* Results Card */}
        <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 space-y-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
          <Sparkles className="absolute top-6 right-6 h-5 w-5 text-[#EC7FA9]/60 animate-pulse" />
          
          <div className="relative z-10">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#FFEDFA]/60 to-[#FFB8E0]/40 border border-[#FFB8E0]/50">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#BE5985] mb-2">{result.score}</div>
                  <div className="text-sm text-[#BE5985]/70">out of 27</div>
                </div>
                <div className="w-px h-16 bg-[#FFB8E0]/40"></div>
                <div className="text-center">
                  <div className={`text-lg font-bold capitalize mb-1 bg-gradient-to-r ${getSeverityColor(result.severity_band)} bg-clip-text text-transparent`}>
                    {result.severity_band}
                  </div>
                  <div className="text-sm text-[#BE5985]/70">symptoms</div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-200/50 shadow-inner mb-6">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">Understanding Your Results</h3>
                  <p className="text-blue-700 leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50/90 to-emerald-50/90 border border-green-200/50 shadow-inner mb-6">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-800 mb-2">Personalized Recommendation</h3>
                  <p className="text-green-700 leading-relaxed">{result.suggestion}</p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
              <div className="flex items-center gap-2 text-sm text-[#BE5985]/80">
                <Shield className="h-4 w-4 text-[#EC7FA9]" />
                <span>Your responses are confidential and stored securely</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link 
            href="/dashboard/tests" 
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 text-center"
          >
            Back to Tests
          </Link>
          <Link 
            href="/dashboard/tests?tab=insights" 
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-0.5 transition-all duration-300 text-center relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              View Insights
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`${montserrat.className} max-w-4xl mx-auto space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <Link 
          href="/dashboard/tests" 
          className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 text-[#EC7FA9] hover:text-[#BE5985] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#BE5985] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            PHQ-9 Depression Screening
          </h1>
          <p className="text-[#BE5985]/70 mt-1">Over the last 2 weeks, how often have you been bothered by...</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-[#BE5985]">
            Question {Math.min(currentQuestion + 1, 9)} of 9
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#BE5985]/70">{Math.round(progress)}% Complete</span>
            <Award className="h-4 w-4 text-[#EC7FA9]" />
          </div>
        </div>
        <div className="w-full bg-[#FFB8E0]/30 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 relative z-10">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-[#BE5985] mb-8 leading-relaxed">
            {PHQ9_QUESTIONS[currentQuestion]}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {RESPONSE_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`group/option p-6 text-left border-2 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  answers[currentQuestion] === option.value
                    ? 'border-[#EC7FA9] bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 shadow-lg shadow-[#EC7FA9]/20'
                    : selectedAnswer === option.value
                    ? 'border-[#EC7FA9] bg-gradient-to-r from-[#FFEDFA]/40 to-[#FFB8E0]/20 scale-95'
                    : 'border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 hover:bg-[#FFEDFA]/30'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${option.color} shadow-md flex items-center justify-center text-white text-sm font-bold group-hover/option:scale-110 transition-transform duration-300`}>
                      {option.value}
                    </div>
                    <span className="text-[#BE5985] font-medium group-hover/option:text-[#EC7FA9] transition-colors duration-300">
                      {option.label}
                    </span>
                  </div>
                  <div className="text-xs text-[#BE5985]/60 font-medium">
                    {option.value} {option.value === 1 ? 'point' : 'points'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center relative z-10">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Previous
        </button>

        {/* Question Indicators */}
        <div className="flex gap-2">
          {PHQ9_QUESTIONS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-110 ${
                answers[index] !== -1
                  ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] shadow-md'
                  : index === currentQuestion
                  ? 'bg-[#EC7FA9]/50 animate-pulse'
                  : 'bg-[#FFB8E0]/40 hover:bg-[#FFB8E0]/60'
              }`}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>

        {isComplete ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                Submit Assessment
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(8, currentQuestion + 1))}
            disabled={currentQuestion === 8}
            className="px-6 py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
