'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
})

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className={`${montserrat.className} h-screen flex bg-white relative overflow-hidden`}>
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/20 blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#BE5985]/5 to-[#EC7FA9]/10 blur-[60px] -z-10" />

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden backdrop-blur-sm">
        {/* ✅ Use the correct prop name */}
        <TopNav onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-6 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
