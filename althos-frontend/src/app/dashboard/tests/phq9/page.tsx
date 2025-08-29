'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { submitPHQ9 } from '@/lib/api'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
]

export default function PHQ9Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    }
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
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-text-primary mb-2">Assessment Complete</h1>
          <p className="text-text-secondary">Here are your PHQ-9 results</p>
        </div>

        <div className="card space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand mb-2">{result.score}/27</div>
            <div className="text-lg font-medium text-text-primary mb-1 capitalize">
              {result.severity_band} symptoms
            </div>
          </div>

          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <p className="text-text-secondary">{result.explanation}</p>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-2">Recommendation</h3>
            <p className="text-text-secondary">{result.suggestion}</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/tests" className="btn-secondary flex-1">
              Back to Tests
            </Link>
            <Link href="/dashboard/tests/insights" className="btn-primary flex-1">
              View Insights
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/tests" className="text-brand hover:text-brand-strong">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">PHQ-9 Depression Screening</h1>
          <p className="text-text-secondary">Over the last 2 weeks, how often have you been bothered by...</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Question {Math.min(currentQuestion + 1, 9)} of 9
          </span>
          <span className="text-sm text-text-secondary">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="card">
        <h2 className="text-lg font-medium text-text-primary mb-6">
          {PHQ9_QUESTIONS[currentQuestion]}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {RESPONSE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`p-4 text-left border border-border rounded-lg transition-all hover:border-brand hover:bg-brand/5 ${
                answers[currentQuestion] === option.value
                  ? 'border-brand bg-brand/10'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-text-primary">{option.label}</span>
                <span className="text-xs text-text-secondary">
                  {option.value} {option.value === 1 ? 'point' : 'points'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {PHQ9_QUESTIONS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                answers[index] !== -1
                  ? 'bg-brand'
                  : index === currentQuestion
                  ? 'bg-brand/50'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {isComplete ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(8, currentQuestion + 1))}
            disabled={currentQuestion === 8}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
