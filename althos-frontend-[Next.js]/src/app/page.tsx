'use client'

import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { Heart, Brain, Shield, Users, NotebookPen, Hospital, Compass, Sparkles, ArrowRight } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const bentoItems = [
  {
    title: "Smart Journaling",
    description: "Write your thoughts and get empathetic AI responses with personalized coping strategies.",
    header: <NotebookPen size={40} className="text-[#E879B9]" />,
    icon: "✍️",
    className: "md:col-span-2",
  },
  {
    title: "Mood Atlas",
    description: "Visualize your emotional patterns and discover insights about your mental wellness journey.",
    header: <Compass size={40} className="text-[#DB5F9A]" />,
    icon: "🧭",
    className: "md:col-span-1",
  },
  {
    title: "Clinical Sharing",
    description: "Securely share your progress with healthcare providers through time-limited links.",
    header: <Hospital size={40} className="text-[#F09FCA]" />,
    icon: "🏥",
    className: "md:col-span-1",
  },
  {
    title: "100% Private & Secure",
    description: "Advanced privacy and data protection for peace of mind.",
    header: <Shield size={40} className="text-[#C74585]" />,
    icon: "🔒",
    className: "md:col-span-1",
  },
  {
    title: "Built for Indian Youth",
    description: "Culturally relevant, designed for modern challenges.",
    header: <Users size={40} className="text-[#E879B9]" />,
    icon: "🙋‍♂️",
    className: "md:col-span-2",
  },
  {
    title: "AI-Powered Support",
    description: "Unbiased, non-judgmental, and always available.",
    header: <Brain size={40} className="text-[#DB5F9A]" />,
    icon: "🧠",
    className: "md:col-span-1",
  },
]

export default function LandingPage() {
  return (
    <div className={montserrat.className}>
      <Navbar />
      
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5F9] to-[#FFEBF3]">
        {/* Elegant pink blobs */}
        <div className="absolute top-[10%] left-[80%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#F8C9DD]/30 to-[#E879B9]/20 blur-[90px] animate-pulse z-0" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#DB5F9A]/15 to-[#F09FCA]/25 blur-[70px] animate-pulse z-0" />
        <div className="absolute top-[45%] left-[50%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#FFCCE0]/20 to-[#E879B9]/15 blur-[60px] animate-pulse z-0" />

        {/* Hero Section - Added padding-top for navbar */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 pt-32 md:pt-40 pb-12 md:pb-20 text-center">
          <h1 className="text-[#C74585] font-bold leading-tight tracking-tight text-[clamp(2rem,5vw,4rem)] mb-4 md:mb-6">
            Your Personal Mental <br />
            <span className="bg-gradient-to-r from-[#E879B9] to-[#C74585] bg-clip-text text-transparent">
              Wellness Companion
            </span>
          </h1>
          <p className="text-base md:text-xl text-[#A03768]/75 max-w-3xl mx-auto mb-8 md:mb-12 font-light leading-relaxed px-4">
            AI-powered journaling, mood tracking, and personalized support designed 
            specifically for Indian youth navigating modern challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-4">
            <Link
              href="/register"
              className="group relative overflow-hidden"
            >
              <div className=" inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold text-white rounded-full shadow-lg border  bg-gradient-to-r from-[#DB5F9A] to-[#C74585] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center">
                <Sparkles className="h-5 w-5" />
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium text-[#C74585] rounded-full shadow-lg shadow-[#F09FCA]/30 bg-white/85 backdrop-blur-md border border-[#F09FCA]/45 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-[#F09FCA]/40"
            >
              I Have An Account
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-[#A03768]/70 text-xs md:text-sm px-4">
            <div className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/85 backdrop-blur-md border border-[#F09FCA]/35 shadow-inner shadow-[#FFF0F6]/60">
              <Shield size={14} className="md:hidden text-[#E879B9]" />
              <Shield size={16} className="hidden md:block text-[#E879B9]" />
              <span className="font-medium">100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/85 backdrop-blur-md border border-[#F09FCA]/35 shadow-inner shadow-[#FFF0F6]/60">
              <Users size={14} className="md:hidden text-[#F09FCA]" />
              <Users size={16} className="hidden md:block text-[#F09FCA]" />
              <span className="font-medium">Built for Indian Youth</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full bg-white/85 backdrop-blur-md border border-[#F09FCA]/35 shadow-inner shadow-[#FFF0F6]/60">
              <Brain size={14} className="md:hidden text-[#DB5F9A]" />
              <Brain size={16} className="hidden md:block text-[#DB5F9A]" />
              <span className="font-medium">AI-Powered Support</span>
            </div>
          </div>
        </section>
        {/* Access Organization Dashboard Card */}
<section className="relative z-10 flex justify-center px-4 mt-12 md:mt-16">
  <div className="bg-white/90 backdrop-blur-lg border border-[#F09FCA]/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 md:p-10 max-w-2xl text-center">
    <h2 className="text-2xl md:text-3xl font-bold text-[#C74585] mb-3">
      Organization Dashboard Access
    </h2>
    <p className="text-[#A03768]/70 mb-6 md:mb-8 text-base md:text-lg font-light leading-relaxed">
      Are you an organization partner? Access your real-time analytics and engagement insights through your dedicated dashboard.
    </p>
    <Link
      href="/orgs"
      className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-[#E879B9] to-[#C74585] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-300"
    >
      Access Dashboard
      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
</section>


        {/* Bento Grid Section */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
  {/* Decorative grid lines */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Vertical lines */}
    <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[#E879B9]/10 to-transparent" />
    <div className="absolute inset-y-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[#E879B9]/10 to-transparent" />
    <div className="absolute inset-y-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[#E879B9]/10 to-transparent" />

    {/* Horizontal lines */}
    <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-[#E879B9]/10 to-transparent" />
    <div className="absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-[#E879B9]/10 to-transparent" />
  </div>

  {/* Header */}
  <div className="text-center mb-8 md:mb-12">
    <h2 className="text-2xl md:text-4xl font-bold text-[#C74585] mb-3 md:mb-4 px-4">
      Features Built for{' '}
      <span className="bg-gradient-to-r from-[#E879B9] to-[#C74585] bg-clip-text text-transparent">
        Your Wellbeing
      </span>
    </h2>
    <p className="text-base md:text-lg text-[#A03768]/70 max-w-2xl mx-auto font-light px-4">
      Everything you need to support your mental health journey, all in one place
    </p>
  </div>

  {/* Bento grid */}
  <div className="relative">
    <BentoGrid>
      {bentoItems.map((item, i) => (
        <BentoGridItem
          key={item.title + i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={item.className}
        />
      ))}
    </BentoGrid>
  </div>
</section>


        {/* Footer */}
        <footer className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12 text-center">
          <div className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/85 backdrop-blur-md border border-[#F09FCA]/35 shadow-inner shadow-[#FFF0F6]/60">
            <p className="text-[#A03768]/70 font-light text-sm md:text-base">
              &copy; 2025 Althos. Built by team <span className="text-[#DB5F9A] font-semibold">SkyMax</span> for Youth's Mental Wellness.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
