'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { login } from '@/lib/api'  // You must add this new login function in api.ts
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
})

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirectCountdown, setRedirectCountdown] = useState(6)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!redirecting) return

    if (redirectCountdown <= 0) {
      router.push('/dashboard')
      return
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [redirecting, redirectCountdown, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRedirecting(false)
    setRedirectCountdown(6)

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Both name and email are required')
      setLoading(false)
      return
    }

    try {
      const response = await login(formData)
      sessionStorage.setItem('userId', response.data.id)

      setRedirecting(true)
    } catch (err: any) {
      console.error('Login error:', err)
      setError(
        err?.response?.data?.message ||
          'Invalid name or email. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }


  const useDemoUser = () => {
    const name = 'Abdullah'
    const email = 'abdullah@althos.com'
    setFormData({ name, email })
    
  }

 return (
    <div className={`${montserrat.className} min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden`}>
      <div className="absolute top-[15%] right-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/15 blur-[50px] z-0" />
      <div className="absolute bottom-[20%] left-[20%] w-48 h-48 rounded-full bg-gradient-to-br from-[#BE5985]/10 to-[#FFEDFA]/30 blur-[35px] z-0" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#EC7FA9] hover:text-[#BE5985] mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#FFB8E0]/30 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#EC7FA9]/20">
              <Heart className="h-8 w-8 text-[#EC7FA9]" />
            </div>
            <span className="text-2xl font-bold text-[#BE5985]">Althos</span>
          </div>
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2">Welcome Back</h1>
          <p className="text-[#BE5985]/70">
            Enter your name and email to continue (it will take a few seconds to load please wait)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl backdrop-blur-sm shadow-inner">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#BE5985] mb-3">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#BE5985] mb-3">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
              placeholder="Your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 transition-all duration-300 backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={useDemoUser}
              className="text-[#EC7FA9] hover:text-[#BE5985] text-sm font-medium underline underline-offset-4 decoration-2 decoration-[#FFB8E0] hover:decoration-[#EC7FA9] transition-all duration-300 px-3 py-1 rounded-lg hover:bg-[#FFEDFA]/50"
            >
              Use Demo Account
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FFB8E0]/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/90 text-[#BE5985]/70">or</span>
            </div>
          </div>

          <div className="text-center text-sm text-[#BE5985]/70">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-[#EC7FA9] hover:text-[#BE5985] font-medium transition-colors duration-300 underline underline-offset-4 decoration-2 decoration-[#FFB8E0] hover:decoration-[#EC7FA9]"
            >
              Register here
            </Link>
          </div>
        </form>

        {redirecting && (
          <div className="mt-6 text-center text-sm text-[#BE5985]/70">
            Redirecting to your <strong className="text-[#EC7FA9]">Dashboard</strong> in <strong>{redirectCountdown}</strong> seconds...
            <br />
            <Link
              href="/dashboard"
              className="text-[#EC7FA9] hover:text-[#BE5985] font-medium underline underline-offset-4 decoration-2 decoration-[#FFB8E0] hover:decoration-[#EC7FA9] mt-2 inline-block"
            >
              Click here if you're not redirected
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#FFB8E0]/30 shadow-sm">
            <div className="w-2 h-2 bg-[#EC7FA9] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#BE5985]/70">Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  )
}