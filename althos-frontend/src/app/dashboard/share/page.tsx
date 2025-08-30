'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { createShare, getShareList, revokeShare } from '@/lib/api'
import { Share } from '@/lib/types'
import { Share2, Plus, QrCode, Clock, Users, Eye, Trash2, Calendar, Shield, Copy, Download } from 'lucide-react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function SharePage() {
  const { user } = useAuth()
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    scopes: ['summary', 'tests', 'mood'],
    window_days: 30,
    expires_mins: 60
  })

  useEffect(() => {
    loadShares()
  }, [user])

  const loadShares = async () => {
    if (!user) return
    
    try {
      const response = await getShareList(user.id)
      setShares(response.data)
    } catch (error) {
      console.error('Failed to load shares:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShare = async () => {
    if (!user) return
    
    setCreating(true)
    try {
      const response = await createShare(user.id, formData)
      setShares(prev => [response.data, ...prev])
      setShowCreateForm(false)
      setFormData({ scopes: ['summary', 'tests', 'mood'], window_days: 30, expires_mins: 60 })
    } catch (error) {
      console.error('Failed to create share:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleRevokeShare = async (shareId: string) => {
    if (!user) return
    
    try {
      await revokeShare(user.id, shareId)
      setShares(prev => prev.filter(s => s.id !== shareId))
    } catch (error) {
      console.error('Failed to revoke share:', error)
    }
  }

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // Add toast notification here
  }

  return (
    <div className={`${montserrat.className} space-y-8 relative`}>
      {/* Floating background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] -left-20 w-32 h-32 bg-gradient-to-br from-[#FFEDFA]/20 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#BE5985] mb-2 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Share2 className="h-8 w-8 text-white" />
            </div>
            Clinical Sharing
          </h1>
          <p className="text-[#BE5985]/70 leading-relaxed">
            Create secure, time-limited links for healthcare providers to access your wellness data
          </p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10">New Share</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#FFB8E0]/40 shadow-2xl shadow-[#EC7FA9]/20">
            <h3 className="text-2xl font-bold text-[#BE5985] mb-6">Create Clinical Share</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#BE5985] mb-3">
                  Data Access Scopes
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'summary', label: 'Clinical Summary', icon: '📋' },
                    { id: 'tests', label: 'Mental Health Tests', icon: '🧠' },
                    { id: 'mood', label: 'Mood Tracking', icon: '😊' },
                    { id: 'journals', label: 'Journal Entries', icon: '📝' }
                  ].map(scope => (
                    <label key={scope.id} className="flex items-center p-3 border border-[#FFB8E0]/40 rounded-xl hover:bg-[#FFEDFA]/20 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.scopes.includes(scope.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, scopes: [...prev.scopes, scope.id] }))
                          } else {
                            setFormData(prev => ({ ...prev, scopes: prev.scopes.filter(s => s !== scope.id) }))
                          }
                        }}
                        className="mr-3 accent-[#EC7FA9]"
                      />
                      <span className="text-xl mr-2">{scope.icon}</span>
                      <span className="text-[#BE5985] font-medium">{scope.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#BE5985] mb-2">
                    Data Window (Days)
                  </label>
                  <select
                    value={formData.window_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, window_days: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>2 Weeks</option>
                    <option value={30}>1 Month</option>
                    <option value={90}>3 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#BE5985] mb-2">
                    Link Expires In
                  </label>
                  <select
                    value={formData.expires_mins}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_mins: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 text-[#BE5985] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={240}>4 Hours</option>
                    <option value={1440}>24 Hours</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-6 border border-[#FFB8E0]/40 text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFEDFA]/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateShare}
                  disabled={creating || formData.scopes.length === 0}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 disabled:opacity-50 transition-all duration-300"
                >
                  {creating ? 'Creating...' : 'Create Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shares List */}
      <div className="space-y-6 relative z-10">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#FFB8E0]/40 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-[#FFB8E0]/40 rounded w-1/3"></div>
                    <div className="h-4 bg-[#FFB8E0]/30 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 w-24 bg-[#FFB8E0]/40 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shares.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 text-center">
            <div className="p-6 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Share2 className="h-12 w-12 text-[#BE5985]/50" />
            </div>
            <h3 className="text-xl font-bold text-[#BE5985] mb-3">No Shares Created</h3>
            <p className="text-[#BE5985]/70 mb-6 leading-relaxed max-w-md mx-auto">
              Create secure, time-limited links to share your wellness data with healthcare providers
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Create First Share
            </button>
          </div>
        ) : (
          shares.map((share, index) => (
            <ShareCard 
              key={share.id} 
              share={share} 
              index={index} 
              onCopyLink={copyShareLink}
              onRevoke={handleRevokeShare}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ShareCard({ 
  share, 
  index, 
  onCopyLink, 
  onRevoke 
}: { 
  share: Share; 
  index: number; 
  onCopyLink: (url: string) => void;
  onRevoke: (id: string) => void;
}) {
  const isExpired = new Date(share.expires_at) < new Date()
  const expiresIn = Math.floor((new Date(share.expires_at).getTime() - Date.now()) / (1000 * 60))

  return (
    <div 
      className="group p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-[#BE5985]">
                  Clinical Share #{share.id.slice(-4)}
                </h3>
                {isExpired ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Expired
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#BE5985]/70">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{share.window_days} days data</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {isExpired ? 'Expired' : `${expiresIn}m remaining`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{share.access_count} views</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/share/${share.token}`}
              className="p-2 rounded-xl bg-[#FFEDFA]/60 hover:bg-[#FFB8E0]/40 text-[#BE5985] hover:text-[#EC7FA9] transition-all duration-300"
              title="View QR Code"
            >
              <QrCode className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onCopyLink(share.url)}
              className="p-2 rounded-xl bg-[#FFEDFA]/60 hover:bg-[#FFB8E0]/40 text-[#BE5985] hover:text-[#EC7FA9] transition-all duration-300"
              title="Copy Link"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRevoke(share.id)}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-300"
              title="Revoke Share"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scopes */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {share.scopes.map(scope => (
              <span
                key={scope}
                className="px-3 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-xs font-medium border border-[#FFB8E0]/50"
              >
                {scope === 'summary' ? '📋 Summary' :
                 scope === 'tests' ? '🧠 Tests' :
                 scope === 'mood' ? '😊 Mood' : 
                 scope === 'journals' ? '📝 Journals' : scope}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/dashboard/share/${share.token}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5"
        >
          <QrCode className="h-4 w-4" />
          View QR Code & Summary
        </Link>
      </div>
    </div>
  )
}
