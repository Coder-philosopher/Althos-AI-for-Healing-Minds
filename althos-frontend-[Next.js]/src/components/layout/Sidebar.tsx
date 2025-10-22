'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Heart, Home, PenTool, Brain, Smile,
  TestTube2, Share2, User, Settings,
  X, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, badge: null, color: 'from-[#F8A5C2]/20 to-[#E879B9]/20' },
  { name: 'Journal', href: '/dashboard/journal', icon: PenTool, badge: '3', color: 'from-[#E879B9]/20 to-[#DB5F9A]/20' },
  { name: 'Mood', href: '/dashboard/mood', icon: Smile, badge: null, color: 'from-[#F09FCA]/20 to-[#E879B9]/20' },
  { name: 'Tests', href: '/dashboard/tests', icon: TestTube2, badge: 'New', color: 'from-[#DB5F9A]/20 to-[#C74585]/20' },
  { name: 'Wellness', href: '/dashboard/wellness', icon: Brain, badge: null, color: 'from-[#E879B9]/20 to-[#F09FCA]/20' },
  { name: 'Share', href: '/dashboard/share', icon: Share2, badge: null, color: 'from-[#F8A5C2]/20 to-[#DB5F9A]/20' },
  { name: 'Profile', href: '/dashboard/profile', icon: User, badge: null, color: 'from-[#DB5F9A]/20 to-[#E879B9]/20' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, badge: null, color: 'from-[#C74585]/20 to-[#DB5F9A]/20' },
]

interface SidebarProps {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname, setIsMobileOpen])

  const sidebarWidth = isCollapsed ? 'lg:w-20' : 'lg:w-72'

  if (!mounted) return null

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-[#C74585]/30 via-black/50 to-[#DB5F9A]/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          montserrat.className,
          'fixed lg:sticky top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
          'w-72', // Mobile: always full width
          sidebarWidth, // Desktop: collapsible
          'bg-gradient-to-b from-white via-[#FFF8FB] to-[#FFF5F9]',
          'border-r-2 border-[#F8A5C2]/40',
          'shadow-2xl shadow-[#E879B9]/20',
          // Mobile transform
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'h-screen overflow-hidden'
        )}
      >
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F8A5C2]/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-[#E879B9]/20 to-transparent blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b-2 min-h-[64px] border-[#F8A5C2]/30 bg-gradient-to-r from-white/80 to-[#FFF5F9]/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9] to-[#C74585] rounded-2xl blur-md opacity-60 animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#E879B9] to-[#C74585] shadow-lg">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              
              {!isCollapsed && (
                <div className="min-w-0 animate-fade-in">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C74585] via-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent">
                    Althos
                  </h1>
                  <p className="text-xs text-[#A03768]/60 font-medium">Mental Wellness</p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#FFEBF3]/60 text-[#C74585] hover:text-[#DB5F9A] transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isActive
                    ? 'bg-gradient-to-r from-[#E879B9]/25 via-[#F09FCA]/20 to-[#E879B9]/25 text-[#C74585] shadow-lg shadow-[#E879B9]/30 border-2 border-[#F8A5C2]/50'
                    : 'text-[#A03768]/70 hover:text-[#C74585] hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3] hover:shadow-md hover:border-2 hover:border-[#F8A5C2]/30 border-2 border-transparent'
                )}
                style={{ 
                  animationDelay: `${index * 30}ms`,
                  animation: mounted ? 'slideIn 0.3s ease-out forwards' : 'none'
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-[#E879B9] via-[#DB5F9A] to-[#C74585] rounded-r-full shadow-lg shadow-[#E879B9]/50" />
                )}

                {/* Icon container */}
                <div className={cn(
                  'relative p-2.5 rounded-xl transition-all duration-300',
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-inner border border-[#E879B9]/30`
                    : 'bg-white/60 group-hover:bg-white/80 group-hover:shadow-sm'
                )}>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F8A5C2]/20 to-[#E879B9]/20 rounded-xl blur-sm" />
                  )}
                  <Icon className={cn(
                    "h-5 w-5 relative z-10 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                </div>

                {/* Text and badge */}
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate font-semibold">{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        'px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 flex-shrink-0',
                        item.badge === 'New'
                          ? 'bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white shadow-lg shadow-[#E879B9]/40 animate-pulse'
                          : 'bg-gradient-to-r from-[#F8A5C2]/30 to-[#F09FCA]/30 text-[#C74585] border-2 border-[#E879B9]/30'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#F8A5C2]/10 via-transparent to-[#E879B9]/10 transition-opacity duration-300 pointer-events-none" />
              </Link>
            )
          })}
        </nav>

        {/* Wellness Streak Card */}
        {!isCollapsed && (
          <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#F8A5C2]/20 via-[#FFEBF3]/30 to-[#F09FCA]/20 border-2 border-[#E879B9]/30 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#C74585] mb-1">7-Day Streak! 🎉</h3>
                <p className="text-xs text-[#A03768]/70 leading-relaxed">You're building great habits. Keep it up!</p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-center p-4 border-t-2 border-[#F8A5C2]/30 bg-gradient-to-r from-white/80 to-[#FFF5F9]/60">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#F8A5C2]/20 hover:to-[#E879B9]/20 border-2 border-[#F8A5C2]/40 hover:border-[#E879B9]/50 shadow-md hover:shadow-lg transition-all duration-300 text-[#C74585] hover:text-[#DB5F9A]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 transition-transform group-hover:scale-110" />
            ) : (
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 text-center border-t-2 border-[#F8A5C2]/30 bg-gradient-to-r from-white/80 to-[#FFF5F9]/60">
            <p className="text-xs text-[#A03768]/60 font-medium">
              Built with <Heart className="inline h-3 w-3 text-[#E879B9] fill-current" /> by{' '}
              <span className="font-bold bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] bg-clip-text text-transparent">
                SkyMax
              </span>
            </p>
          </div>
        )}

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(248, 165, 194, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #E879B9, #DB5F9A);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #DB5F9A, #C74585);
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
        `}</style>
      </aside>
    </>
  )
}
