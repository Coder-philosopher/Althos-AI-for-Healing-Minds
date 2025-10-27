'use client'

import { useAuth } from '@/lib/auth'
import { useState, useRef, useEffect } from 'react'
import { 
  Bell, Menu, LogOut, User as UserIcon, 
  HelpCircle, Award, TrendingUp, Sparkles 
} from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [notifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Mock user data - replace with actual data
  const userStats = {
    streak: 7,
    journalEntries: 24,
    mood: 'Great',
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('dashboardVisited')
    window.location.href = '/login'
  }

  // Mock notifications
  const notificationsList = [
    { id: 1, title: 'Daily Check-in', message: 'Time for your wellness check-in!', time: '10 min ago', type: 'reminder' },
    { id: 2, title: 'Mood Insight', message: 'Your mood has improved by 15% this week', time: '2 hours ago', type: 'insight' },
    { id: 3, title: 'New Feature', message: 'Try our new guided meditation', time: '1 day ago', type: 'update' },
  ]

  return (
    <header className={cn(
      montserrat.className,
      'sticky top-0 z-30 bg-gradient-to-r from-white via-[#FFF8FB] to-[#FFF5F9] border-b-2 border-[#F8A5C2]/40 shadow-lg shadow-[#E879B9]/10 backdrop-blur-md'
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F8A5C2]/5 to-transparent pointer-events-none" />
      
      <div className="relative px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Mobile Menu + Welcome */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button - Hamburger in TopNav for mobile */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-white to-[#FFF5F9] hover:from-[#FFEBF3] hover:to-[#FFF0F6] border-2 border-[#F8A5C2]/50 shadow-md hover:shadow-lg transition-all duration-300 text-[#C74585] hover:text-[#DB5F9A] active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Welcome Message & Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="min-w-0">
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#C74585] to-[#DB5F9A] bg-clip-text text-transparent">
                  Welcome back, {user?.name?.split(' ')[0] || 'Friend'}! 👋
                </h2>
                <p className="text-sm text-[#A03768]/60 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#F8A5C2]/20 to-[#FFEBF3]/30 border border-[#E879B9]/30">
                  <Award className="h-4 w-4 text-[#E879B9]" />
                  <span className="text-sm font-bold text-[#C74585]">{userStats.streak} days</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#F09FCA]/20 to-[#F8A5C2]/20 border border-[#E879B9]/30">
                  <TrendingUp className="h-4 w-4 text-[#DB5F9A]" />
                  <span className="text-sm font-bold text-[#C74585]">{userStats.journalEntries} entries</span>
                </div>
              </div>
            </div>

            {/* Mobile - Just date */}
            <div className="md:hidden">
              <p className="text-xs text-[#A03768]/70 font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Section - Actions + User */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Quick Action - Today's Mood */}
            <button
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] hover:from-[#DB5F9A] hover:to-[#C74585] text-white font-semibold text-sm shadow-lg shadow-[#E879B9]/40 hover:shadow-xl hover:shadow-[#DB5F9A]/50 transition-all duration-300 active:scale-95"
              title="Log today's mood"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Quick Check-in</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-white hover:bg-gradient-to-br hover:from-[#FFEBF3] hover:to-[#FFF0F6] border-2 border-[#F8A5C2]/50 shadow-md hover:shadow-lg transition-all duration-300 text-[#C74585] hover:text-[#DB5F9A] active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-[#F8A5C2]/50 rounded-2xl shadow-2xl shadow-[#E879B9]/20 py-2 animate-scale-in overflow-hidden">
                  <div className="px-4 py-3 border-b-2 border-[#F8A5C2]/30 bg-gradient-to-r from-[#FFF5F9] to-white">
                    <h3 className="font-bold text-[#C74585]">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3] transition-colors cursor-pointer border-b border-[#F8A5C2]/20 last:border-0"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-[#F8A5C2]/30 to-[#E879B9]/20">
                            <Bell className="h-4 w-4 text-[#DB5F9A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-[#C74585]">{notif.title}</h4>
                            <p className="text-xs text-[#A03768]/70 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-[#A03768]/50 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t-2 border-[#F8A5C2]/30 bg-gradient-to-r from-white to-[#FFF5F9]">
                    <button className="text-sm font-semibold text-[#DB5F9A] hover:text-[#C74585] transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-white hover:bg-gradient-to-br hover:from-[#FFEBF3] hover:to-[#FFF0F6] border-2 border-[#F8A5C2]/50 shadow-md hover:shadow-lg transition-all duration-300 group active:scale-95"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-[#C74585] group-hover:text-[#DB5F9A] transition-colors">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-[#A03768]/60 font-medium">
                    {user?.profession || 'Student'}
                  </div>
                </div>
                <div className="relative">
                  <div className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-[#E879B9] to-[#C74585] rounded-xl flex items-center justify-center shadow-lg shadow-[#E879B9]/40 group-hover:scale-105 transition-transform duration-300 border-2 border-white">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-gradient-to-br from-green-400 to-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-[#F8A5C2]/50 rounded-2xl shadow-2xl shadow-[#E879B9]/20 py-2 z-50 animate-scale-in overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b-2 border-[#F8A5C2]/30 bg-gradient-to-br from-[#FFF5F9] via-white to-[#FFEBF3]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-14 w-14 bg-gradient-to-br from-[#E879B9] to-[#C74585] rounded-xl flex items-center justify-center shadow-lg shadow-[#E879B9]/40 border-2 border-white">
                          <span className="text-lg font-bold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-gradient-to-br from-green-400 to-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#C74585] truncate">{user?.name || 'User'}</div>
                        <div className="text-sm text-[#A03768]/60 font-medium">{user?.profession || 'Student'}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="h-3 w-3 text-[#E879B9]" />
                          <span className="text-xs font-semibold text-[#DB5F9A]">{userStats.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a 
                      href="/dashboard/profile" 
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#A03768] hover:text-[#C74585] hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3] transition-all"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#F8A5C2]/20 to-[#E879B9]/10">
                        <UserIcon className="h-4 w-4 text-[#DB5F9A]" />
                      </div>
                      <span>Profile Settings</span>
                    </a>
                    
                    <a 
                      href="/help" 
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#A03768] hover:text-[#C74585] hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3] transition-all"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#F8A5C2]/20 to-[#F09FCA]/10">
                        <HelpCircle className="h-4 w-4 text-[#DB5F9A]" />
                      </div>
                      <span>Help & Support</span>
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="border-t-2 border-[#F8A5C2]/30 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all w-full text-left"
                    >
                      <div className="p-2 rounded-lg bg-red-50">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span>Sign Out</span>
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(248, 165, 194, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #E879B9, #DB5F9A);
          border-radius: 3px;
        }
      `}</style>
    </header>
  )
}
