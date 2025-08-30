'use client'

import Link from 'next/link'
import { Heart, Brain, Shield, Users } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const inter = Montserrat({ 
  subsets: ['latin'],
  weight: ['500'],
  
})

export default function LandingPage() {
  return (
    <div className={ inter.className }>
      <main className="relative min-h-screen overflow-hidden bg-white">
        
        {/* Floating pastel blobs */}
        <div className="absolute top-[10%] left-[80%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/15 blur-[60px] z-0" />
        <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#BE5985]/10 to-[#FFB8E0]/20 blur-[40px] z-0" />

        {/* Header */}
        <header className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/30 shadow-lg shadow-[#EC7FA9]/20 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/30">
                <Heart size={24} className="text-[#EC7FA9]" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-[#BE5985]">Althos</span>
            </div>
            <Link
              href="/login"
              className="px-6 py-3 rounded-full font-medium text-[#EC7FA9] bg-white/70 backdrop-blur-md border border-[#FFB8E0]/40 shadow-md shadow-[#EC7FA9]/20 transition hover:bg-[#FFEDFA] hover:text-[#BE5985] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#EC7FA9]/25"
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center animate-fadeInUp">
          <h1 className="text-[#BE5985] font-bold leading-tight tracking-tight text-[clamp(2.5rem,5vw,4rem)] mb-6">
            Your Personal Mental <br />
            <span className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] bg-clip-text text-transparent">
              Wellness Companion
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#BE5985]/70 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            AI-powered journaling, mood tracking, and personalized support designed 
            specifically for Indian youth navigating modern challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="px-8 py-4 text-lg font-semibold text-white rounded-full shadow-lg shadow-[#EC7FA9]/30 transition backdrop-blur-md border border-white/20 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EC7FA9]/40"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-lg font-medium text-[#BE5985] rounded-full shadow-lg shadow-[#FFB8E0]/30 bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-[#FFB8E0]/40"
            >
              I Have An Account
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-[#BE5985]/70 text-sm">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#FFB8E0]/30 shadow-inner shadow-[#FFEDFA]/50">
              <Shield size={16} className="text-[#EC7FA9]" />
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#FFB8E0]/30 shadow-inner shadow-[#FFEDFA]/50">
              <Users size={16} className="text-[#FFB8E0]" />
              <span>Built for Indian Youth</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#FFB8E0]/30 shadow-inner shadow-[#FFEDFA]/50">
              <Brain size={16} className="text-[#BE5985]" />
              <span>AI-Powered Support</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              title="Smart Journaling"
              description="Write your thoughts and get empathetic AI responses with personalized coping strategies"
              icon="✍️"
              color="primary"
            />
            <FeatureCard 
              title="Mood Atlas"
              description="Visualize your emotional patterns and discover insights about your mental wellness journey"
              icon="🧭"
              color="secondary"
            />
            <FeatureCard 
              title="Clinical Sharing"
              description="Securely share your progress with healthcare providers through time-limited links"
              icon="🏥"
              color="accent"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-block px-8 py-4 rounded-full bg-white/80 backdrop-blur-md border border-[#FFB8E0]/30 shadow-inner shadow-[#FFEDFA]/50">
            <p className="text-[#BE5985]/70 font-light">
              &copy; 2025 Althos. Built with <span className="text-[#EC7FA9]">❤️</span> for Indian youth mental wellness.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  color: 'primary' | 'secondary' | 'accent'
}

function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  const colorConfig = {
    primary: {
      shadow: "hover:shadow-[#EC7FA9]/25",
      bg: "hover:bg-gradient-to-br hover:from-[#FFEDFA]/80 hover:to-[#FFB8E0]/30"
    },
    secondary: {
      shadow: "hover:shadow-[#FFB8E0]/30",
      bg: "hover:bg-gradient-to-br hover:from-[#FFB8E0]/20 hover:to-[#EC7FA9]/20"
    },
    accent: {
      shadow: "hover:shadow-[#BE5985]/25",
      bg: "hover:bg-gradient-to-br hover:from-[#EC7FA9]/15 hover:to-[#BE5985]/20"
    }
  }

  return (
    <div
      className={`group p-10 rounded-3xl bg-white/85 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${colorConfig[color].shadow} ${colorConfig[color].bg} cursor-pointer relative overflow-hidden`}
    >
      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold text-[#BE5985] mb-4 tracking-tight">{title}</h3>
      <p className="text-[#BE5985]/70 font-light leading-relaxed">{description}</p>
      
      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFEDFA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}
