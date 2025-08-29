'use client'
import Link from 'next/link'
import { PenTool, Smile, TestTube2, Share2, Plus, TrendingUp } from 'lucide-react'

interface ActionItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

const actions: ActionItem[] = [
  {
    name: 'Journal',
    href: '/dashboard/journal/new',
    icon: PenTool,
    color: 'group-hover:bg-info/20 group-hover:text-blue-700',
    description: 'Write about your thoughts and feelings'
  },
  {
    name: 'Mood',
    href: '/dashboard/mood',
    icon: Smile,
    color: 'group-hover:bg-success/20 group-hover:text-green-700',
    description: 'Track your daily emotional state'
  },
  {
    name: 'Tests',
    href: '/dashboard/tests',
    icon: TestTube2,
    color: 'group-hover:bg-warning/20 group-hover:text-orange-700',
    description: 'Take mental wellness assessments'
  },
  {
    name: 'Share',
    href: '/dashboard/share',
    icon: Share2,
    color: 'group-hover:bg-calm/20 group-hover:text-purple-700',
    description: 'Create links for healthcare providers'
  }
]

export function QuickActions() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-brand" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 rounded-lg border border-border hover:border-brand/30 transition-all duration-200 ease-out hover:shadow-1 bg-surface hover:bg-gray-50"
            aria-label={`Go to ${action.name}: ${action.description}`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`p-3 rounded-lg transition-all duration-200 ${action.color} bg-gray-50`}>
                <action.icon className="h-6 w-6 text-text-secondary transition-colors" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary group-hover:text-brand transition-colors">
                  {action.name}
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-tight">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Quick Action */}
      <Link
        href="/dashboard/wellness"
        className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
      >
        <TrendingUp className="h-4 w-4" />
        View Wellness Hub
      </Link>
    </div>
  )
}
