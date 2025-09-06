'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Heart, Home, PenTool, Brain, Smile,
  TestTube2, Share2, User, Settings,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
})

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, badge: null },
  { name: 'Journal', href: '/dashboard/journal', icon: PenTool, badge: '3' },
  { name: 'Mood', href: '/dashboard/mood', icon: Smile, badge: null },
  { name: 'Tests', href: '/dashboard/tests', icon: TestTube2, badge: 'New' },
  { name: 'Wellness', href: '/dashboard/wellness', icon: Brain, badge: null },
  { name: 'Share', href: '/dashboard/share', icon: Share2, badge: null },
  { name: 'Profile', href: '/dashboard/profile', icon: User, badge: null },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, badge: null },
]

interface SidebarProps {
  isMobileOpen?: boolean
  setIsMobileOpen?: (open: boolean) => void
}

export function Sidebar({ isMobileOpen = false, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72'
  const showText = !isCollapsed

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          `${montserrat.className} fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out`,
          sidebarWidth,
          'bg-white/95 backdrop-blur-md border-r border-[#FFB8E0]/30 shadow-xl shadow-[#FFB8E0]/10',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Floating background elements */}
        <div className="absolute top-10 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 blur-xl -z-10" />
        <div className="absolute bottom-20 -left-5 w-16 h-16 rounded-full bg-gradient-to-br from-[#BE5985]/5 to-[#FFEDFA]/15 blur-lg -z-10" />

        {/* Header */}
        <div className="p-6 border-b border-[#FFB8E0]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30 flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              {showText && (
                <span className="text-xl font-bold text-[#BE5985] whitespace-nowrap transition-all duration-300">
                  Althos
                </span>
              )}
            </div>

            {/* Mobile close button */}
            <button
              title='Close'
              onClick={() => setIsMobileOpen?.(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#FFEDFA]/50 text-[#BE5985] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-[#EC7FA9]/20 to-[#BE5985]/10 text-[#BE5985] shadow-lg shadow-[#EC7FA9]/20 border border-[#FFB8E0]/30'
                    : 'text-[#BE5985]/70 hover:text-[#BE5985] hover:bg-[#FFEDFA]/50 hover:shadow-md hover:shadow-[#FFB8E0]/20'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#EC7FA9] to-[#BE5985] rounded-r-full" />
                )}

                <div className={cn(
                  'p-2 rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-white/80 shadow-inner'
                    : 'group-hover:bg-white/60'
                )}>
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                </div>

                {showText && (
                  <div className="flex items-center justify-between w-full overflow-hidden">
                    <span className="whitespace-nowrap transition-all duration-300">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full transition-all duration-300',
                        item.badge === 'New'
                          ? 'bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white'
                          : 'bg-[#FFB8E0]/30 text-[#BE5985] border border-[#FFB8E0]/50'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-center p-4 border-t border-[#FFB8E0]/20">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 rounded-xl bg-white/80 hover:bg-[#FFEDFA]/80 border border-[#FFB8E0]/40 shadow-md hover:shadow-lg transition-all duration-300 text-[#BE5985]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Footer */}
        {showText && (
          <div className="p-4 text-center border-t border-[#FFB8E0]/20">
            <p className="text-xs text-[#BE5985]/60">
              Built by team <span className="text-[#EC7FA9]">SkyMax</span> for mental wellness
            </p>
          </div>
        )}

        {/* Scrollbar Styling */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 184, 224, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(236, 127, 169, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(236, 127, 169, 0.5);
          }
        `}</style>
      </div>
    </>
  )
}
