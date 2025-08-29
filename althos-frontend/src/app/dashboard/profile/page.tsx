'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { updateProfile } from '@/lib/api'
import { User, Save } from 'lucide-react'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    profession: '',
    hobbies: [] as string[],
    locale: 'en-IN'
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        sex: user.sex || '',
        profession: user.profession || '',
        hobbies: user.hobbies || [],
        locale: user.locale || 'en-IN'
      })
    }
  }, [user])

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
    if (!user) return

    setLoading(true)
    setSaved(false)

    try {
      await updateProfile(user.id, {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      })
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <User className="h-8 w-8 text-brand" />
          Your Profile
        </h1>
        <p className="text-text-secondary">
          Update your information to personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {saved && (
              <div className="bg-success/20 border border-success/30 text-green-800 px-4 py-3 rounded-lg">
                Profile updated successfully!
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Name
              </label>
              <input
                title='Name'
                type="text"
                className="input"
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
                <select
                  title='Gender'
                  className="input"
                  value={formData.sex}
                  onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
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
                Hobbies & Interests
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

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4">Profile Preview</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-text-primary">Name:</span>
              <span className="ml-2 text-text-secondary">{formData.name || 'Not provided'}</span>
            </div>
            {formData.age && (
              <div>
                <span className="font-medium text-text-primary">Age:</span>
                <span className="ml-2 text-text-secondary">{formData.age}</span>
              </div>
            )}
            {formData.sex && (
              <div>
                <span className="font-medium text-text-primary">Gender:</span>
                <span className="ml-2 text-text-secondary capitalize">{formData.sex}</span>
              </div>
            )}
            {formData.profession && (
              <div>
                <span className="font-medium text-text-primary">Profession:</span>
                <span className="ml-2 text-text-secondary capitalize">{formData.profession}</span>
              </div>
            )}
            {formData.hobbies.length > 0 && (
              <div>
                <span className="font-medium text-text-primary">Hobbies:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.hobbies.map(hobby => (
                    <span key={hobby} className="px-2 py-1 bg-info/20 text-blue-800 rounded-pill text-xs">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
