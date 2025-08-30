'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { updateProfile } from '@/lib/api'
import { User, Save, CheckCircle, Star, Sparkles, Heart,Trophy, Edit3, Camera } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

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
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user) {
      const newFormData = {
        name: user.name || '',
        age: user.age?.toString() || '',
        sex: user.sex || '',
        profession: user.profession || '',
        hobbies: user.hobbies || [],
        locale: user.locale || 'en-IN'
      }
      setFormData(newFormData)
    }
  }, [user])

  // Check for changes
  useEffect(() => {
    if (user) {
      const originalData = {
        name: user.name || '',
        age: user.age?.toString() || '',
        sex: user.sex || '',
        profession: user.profession || '',
        hobbies: user.hobbies || [],
        locale: user.locale || 'en-IN'
      }
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
      setHasChanges(hasChanges)
    }
  }, [formData, user])

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

  const getProfileCompleteness = () => {
    const fields = [formData.name, formData.age, formData.sex, formData.profession]
    const filledFields = fields.filter(field => field && field.trim()).length
    const hobbiesBonus = formData.hobbies.length > 0 ? 1 : 0
    return Math.round(((filledFields + hobbiesBonus) / (fields.length + 1)) * 100)
  }

  const completeness = getProfileCompleteness()

  return (
    <div className={`${montserrat.className} max-w-6xl mx-auto space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[50%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <User className="h-8 w-8 text-white" />
            </div>
            Your Profile
          </h1>
          <p className="text-[#BE5985]/70 leading-relaxed">
            Update your information to personalize your wellness experience
          </p>
        </div>
        
        {/* Profile Completeness */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#FFB8E0"
                strokeWidth="2"
                strokeOpacity="0.3"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#EC7FA9"
                strokeWidth="2"
                strokeDasharray={`${completeness}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#BE5985]">{completeness}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-[#BE5985]">Profile</div>
            <div className="text-xs text-[#BE5985]/70">Complete</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 space-y-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            {/* Floating background element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              {/* Success Message */}
              {saved && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50/90 to-emerald-100/50 backdrop-blur-md border border-green-200/50 shadow-lg shadow-green-200/20 relative overflow-hidden animate-fade-in">
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-lg animate-pulse" />
                  <div className="flex items-center gap-3 relative z-10">
                    <CheckCircle className="h-5 w-5 text-green-600 animate-bounce" />
                    <span className="text-green-800 font-semibold">Profile updated successfully! ✨</span>
                  </div>
                </div>
              )}

              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] rounded-full flex items-center justify-center shadow-lg shadow-[#EC7FA9]/30 group/avatar hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">
                      {formData.name.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border-2 border-[#FFB8E0]/40 hover:bg-[#FFEDFA]/80 transition-colors duration-300 group/btn"
                  >
                    <Camera className="h-3 w-3 text-[#BE5985] group-hover/btn:text-[#EC7FA9] transition-colors duration-300" />
                  </button>
                </div>
                <p className="text-sm text-[#BE5985]/70 mt-2">Profile Avatar</p>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#BE5985] flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-[#EC7FA9]" />
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] placeholder-[#BE5985]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Age and Gender Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-[#BE5985]">Age</label>
                  <select
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  >
                    <option value="">Select age</option>
                    {Array.from({ length: 23 }, (_, i) => i + 13).map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-[#BE5985]">Gender</label>
                  <select
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
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

              {/* Profession */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#BE5985]">Profession</label>
                <select
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 shadow-inner shadow-[#FFEDFA]/30"
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

              {/* Hobbies */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-[#BE5985] flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#EC7FA9]" />
                  Hobbies & Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hobbiesOptions.map((hobby, index) => (
                    <label 
                      key={hobby} 
                      className="flex items-center cursor-pointer group/hobby"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
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
                            : 'border-[#FFB8E0] group-hover/hobby:border-[#EC7FA9]'
                        }`}>
                          {formData.hobbies.includes(hobby) && (
                            <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm text-[#BE5985] group-hover/hobby:text-[#EC7FA9] transition-colors duration-300">{hobby}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || !hasChanges} 
                  className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg shadow-[#EC7FA9]/30 transition-all duration-300 backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving changes...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10">Save Changes</span>
                      <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                {hasChanges && (
                  <p className="text-center text-sm text-[#BE5985]/70 mt-2">
                    You have unsaved changes
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          {/* Profile Preview */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-[#BE5985] mb-6 flex items-center gap-2">
                <Star className="h-4 w-4 text-[#EC7FA9]" />
                Profile Preview
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                  <span className="font-semibold text-[#BE5985]">Name:</span>
                  <span className="text-[#BE5985]/80">{formData.name || 'Not provided'}</span>
                </div>
                {formData.age && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                    <span className="font-semibold text-[#BE5985]">Age:</span>
                    <span className="text-[#BE5985]/80">{formData.age}</span>
                  </div>
                )}
                {formData.sex && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                    <span className="font-semibold text-[#BE5985]">Gender:</span>
                    <span className="text-[#BE5985]/80 capitalize">{formData.sex}</span>
                  </div>
                )}
                {formData.profession && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                    <span className="font-semibold text-[#BE5985]">Profession:</span>
                    <span className="text-[#BE5985]/80 capitalize">{formData.profession}</span>
                  </div>
                )}
                {formData.hobbies.length > 0 && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#FFEDFA]/50 to-[#FFB8E0]/30 border border-[#FFB8E0]/40">
                    <span className="font-semibold text-[#BE5985] block mb-3">Hobbies:</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.hobbies.map((hobby, index) => (
                        <span 
                          key={hobby} 
                          className="px-3 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-xs font-medium border border-[#FFB8E0]/50 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completeness Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-md border border-green-200/50 shadow-xl shadow-green-200/20 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-lg animate-pulse" />
            
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">{completeness}%</div>
              <p className="text-green-600 text-sm font-medium mb-3">Profile Complete</p>
              <div className="w-full bg-green-200/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              {completeness === 100 && (
                <div className="mt-3 animate-bounce">
                  <Trophy className="h-5 w-5 text-green-600 mx-auto" />
                  <p className="text-xs text-green-600 font-medium">Perfect! 🎉</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
