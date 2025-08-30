'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { register } from '@/lib/api'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    profession: '',
    hobbies: [] as string[],
    locale: 'en-IN'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hobbiesOptions = [
    'Reading', 'Gaming', 'Music', 'Sports', 'Art', 'Cooking', 
    'Dancing', 'Photography', 'Travel', 'Technology', 'Movies', 'Writing'
  ]

  const handleHobbyToggle = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    try {
      const userId = crypto.randomUUID()
      await register({
        id: userId,
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      })
      
      sessionStorage.setItem('userId', userId)
      router.push('/dashboard')
    } catch (err) {
      console.log(err);
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${montserrat.className} min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Floating background elements */}
      <div className="absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/15 blur-[60px] z-0" />
      <div className="absolute bottom-[15%] left-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-[#BE5985]/10 to-[#FFEDFA]/30 blur-[40px] z-0" />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2">Create Your Account</h1>
          <p className="text-[#BE5985]/70">Tell us a bit about yourself to personalize your experience</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl backdrop-blur-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#BE5985] mb-3">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#BE5985] mb-3">Age</label>
              <select
                title='Age'
                className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              >
                <option value="">Select age</option>
                {Array.from({ length: 23 }, (_, i) => i + 13).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#BE5985] mb-3">Gender</label>
              <div className="space-y-3">
                {['male', 'female', 'other', 'prefer not to say'].map(option => (
                  <label key={option} className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="sex"
                        value={option}
                        checked={formData.sex === option}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        formData.sex === option 
                          ? 'border-[#EC7FA9] bg-[#EC7FA9] shadow-md shadow-[#EC7FA9]/30' 
                          : 'border-[#FFB8E0] group-hover:border-[#EC7FA9]'
                      }`}>
                        {formData.sex === option && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>
                    <span className="ml-3 capitalize text-[#BE5985] group-hover:text-[#EC7FA9] transition-colors duration-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#BE5985] mb-3">Profession</label>
            <select
              title='Profession'
              className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
              value={formData.profession}
              onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
            >
              <option value="">Select profession</option>
              <option value="student">Student</option>
              <option value="working">Working Professional</option>
              <option value="unemployed">Looking for Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#BE5985] mb-3">
              Hobbies & Interests (optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hobbiesOptions.map(hobby => (
                <label key={hobby} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.hobbies.includes(hobby)}
                      onChange={() => handleHobbyToggle(hobby)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 ${
                      formData.hobbies.includes(hobby)
                        ? 'border-[#EC7FA9] bg-[#EC7FA9] shadow-md shadow-[#EC7FA9]/30'
                        : 'border-[#FFB8E0] group-hover:border-[#EC7FA9]'
                    }`}>
                      {formData.hobbies.includes(hobby) && (
                        <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-[#BE5985] group-hover:text-[#EC7FA9] transition-colors duration-300">{hobby}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 transition-all duration-300 backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : 'Create Account'}
          </button>

          <div className="text-center text-sm text-[#BE5985]/70">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EC7FA9] hover:text-[#BE5985] font-medium transition-colors duration-300">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
