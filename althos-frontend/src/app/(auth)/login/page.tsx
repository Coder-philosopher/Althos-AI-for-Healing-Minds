'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { getProfile } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!userId.trim()) {
      setError('User ID is required')
      setLoading(false)
      return
    }

    try {
      // Validate user exists
      await getProfile(userId)
      localStorage.setItem('userId', userId)
      router.push('/dashboard')
    } catch (err) {
      console.log(err);
      
      setError('User not found. Please check your User ID or register a new account.')
    } finally {
      setLoading(false)
    }
  }

  // Demo user for quick access
  const useDemoUser = () => {
    const demoId = '550e8400-e29b-41d4-a716-446655440000'
    setUserId(demoId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-brand hover:text-brand-strong mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-brand" />
            <span className="text-2xl font-bold text-text-primary">Althos</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Enter your User ID to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-danger/20 border border-danger/30 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              User ID
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <p className="text-xs text-text-secondary mt-1">
              This was provided when you first registered
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={useDemoUser}
              className="text-brand hover:text-brand-strong text-sm underline"
            >
              Use Demo Account
            </button>
          </div>

          <div className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand hover:text-brand-strong">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
