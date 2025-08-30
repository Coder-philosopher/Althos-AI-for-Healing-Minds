'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  console.log("from dashboard 1", user, loading, router)
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className={`${montserrat.className} h-screen flex items-center justify-center bg-white relative overflow-hidden`}>
        {/* Loading background elements */}
        <div className="absolute top-[20%] right-[20%] w-64 h-64 rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/15 blur-[50px] animate-pulse" />
        <div className="absolute bottom-[30%] left-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-[#BE5985]/10 to-[#FFEDFA]/30 blur-[40px] animate-pulse" />
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#EC7FA9]/20 mb-4">
            <div className="w-8 h-8 border-3 border-[#FFB8E0] border-t-[#EC7FA9] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#BE5985] text-lg font-medium">Loading your wellness space...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`${montserrat.className} h-screen flex bg-white relative overflow-hidden`}>
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFEDFA]/30 to-[#FFB8E0]/20 blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#BE5985]/5 to-[#EC7FA9]/10 blur-[60px] -z-10" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden backdrop-blur-sm">
        <TopNav />
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
