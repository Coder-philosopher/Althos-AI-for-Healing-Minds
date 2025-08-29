'use client'
import { useAuth } from '@/lib/auth'
import { Bell, Search, Menu } from 'lucide-react'

export function TopNav() {
  const { user } = useAuth()

  return (
    <header className="bg-surface border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Search journals, moods, insights..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button title='button' className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-50">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-text-primary">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-text-secondary">
                {user?.profession || 'Student'}
              </div>
            </div>
            <div className="h-8 w-8 bg-brand/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-brand">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
