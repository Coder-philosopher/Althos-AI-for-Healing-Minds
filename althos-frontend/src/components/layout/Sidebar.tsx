'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Heart, Home, PenTool, Brain, Smile, 
  TestTube2, Share2, User, Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Journal', href: '/dashboard/journal', icon: PenTool },
  { name: 'Mood', href: '/dashboard/mood', icon: Smile },
  { name: 'Tests', href: '/dashboard/tests', icon: TestTube2 },
  { name: 'Wellness', href: '/dashboard/wellness', icon: Brain },
  { name: 'Share', href: '/dashboard/share', icon: Share2 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-brand" />
          <span className="text-2xl font-bold text-text-primary">Althos</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-text-secondary">
        Built with ❤️ for mental wellness
      </div>
    </div>
  )
}
