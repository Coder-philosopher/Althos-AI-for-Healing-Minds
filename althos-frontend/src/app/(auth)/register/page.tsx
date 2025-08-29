'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { register } from '@/lib/api'

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
      
      localStorage.setItem('userId', userId)
      router.push('/dashboard')
    } catch (err) {
      console.log(err);
    
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Your Account</h1>
          <p className="text-text-secondary">Tell us a bit about yourself to personalize your experience</p>
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
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Age</label>
              <select
              title='Age'
                className="input"
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
              <label className="block text-sm font-medium text-text-primary mb-2">Gender</label>
              <div className="space-y-2">
                {['male', 'female', 'other', 'prefer not to say'].map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value={option}
                      checked={formData.sex === option}
                      onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                      className="mr-2"
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Profession</label>
            <select
              title='Profession'
              className="input"
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
            <label className="block text-sm font-medium text-text-primary mb-2">
              Hobbies & Interests (optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hobbiesOptions.map(hobby => (
                <label key={hobby} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hobbies.includes(hobby)}
                    onChange={() => handleHobbyToggle(hobby)}
                    className="mr-2"
                  />
                  <span className="text-sm">{hobby}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-brand hover:text-brand-strong">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
