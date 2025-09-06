'use client'
import { useAuth } from '@/lib/auth'
import { useState, useRef, useEffect } from 'react'
import { Bell, Search, Menu, LogOut, User as UserIcon, Settings, HelpCircle } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [notifications, setNotifications] = useState(3) // Mock notification count
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchValue)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('dashboardVisited')
    window.location.href = '/login'
  }

  return (
    <header className={`${montserrat.className} bg-white/95 backdrop-blur-md border-b border-[#FFB8E0]/30 shadow-lg shadow-[#FFB8E0]/10 relative z-30`}>
      {/* Floating background element */}
      <div className="absolute top-0 right-10 w-32 h-16 bg-gradient-to-l from-[#FFEDFA]/20 to-transparent blur-2xl -z-10" />
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Mobile Menu + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Mobile Menu Button */}
            <button
              title='button'
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-xl bg-white/80 hover:bg-[#FFEDFA]/80 border border-[#FFB8E0]/40 shadow-md hover:shadow-lg transition-all duration-300 text-[#BE5985]"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#BE5985]/50 h-4 w-4 group-focus-within:text-[#EC7FA9] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search journals, moods, insights..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-[#FFB8E0]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 focus:border-[#EC7FA9] transition-all duration-300 text-[#BE5985] placeholder-[#BE5985]/50 shadow-inner shadow-[#FFEDFA]/30"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#BE5985]/50 hover:text-[#EC7FA9] transition-colors duration-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Section - Actions + User */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            

            {/* Notifications */}
            <button
              className="relative p-2.5 rounded-xl bg-white/80 hover:bg-[#FFEDFA]/80 border border-[#FFB8E0]/40 shadow-md hover:shadow-lg transition-all duration-300 text-[#BE5985] hover:text-[#EC7FA9]"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white text-xs font-medium rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-2xl bg-white/80 hover:bg-[#FFEDFA]/80 border border-[#FFB8E0]/40 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-[#BE5985] group-hover:text-[#EC7FA9] transition-colors duration-300">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-[#BE5985]/60">
                    {user?.profession || 'Student'}
                  </div>
                </div>
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] rounded-xl flex items-center justify-center shadow-lg shadow-[#EC7FA9]/30 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-[#FFB8E0]/40 rounded-2xl shadow-2xl shadow-[#FFB8E0]/20 py-2 z-50 animate-scale-in">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[#FFB8E0]/20">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] rounded-xl flex items-center justify-center shadow-lg shadow-[#EC7FA9]/30">
                        <span className="text-base font-semibold text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#BE5985]">{user?.name || 'User'}</div>
                        <div className="text-sm text-[#BE5985]/60">{user?.profession || 'Student'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#BE5985] hover:bg-[#FFEDFA]/50 hover:text-[#EC7FA9] transition-all duration-200">
                      <UserIcon className="h-4 w-4" />
                      Profile Settings
                    </a>
                    <a href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#BE5985] hover:bg-[#FFEDFA]/50 hover:text-[#EC7FA9] transition-all duration-200">
                      <Settings className="h-4 w-4" />
                      Preferences
                    </a>
                    <a href="/help" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#BE5985] hover:bg-[#FFEDFA]/50 hover:text-[#EC7FA9] transition-all duration-200">
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#FFB8E0]/20 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}
