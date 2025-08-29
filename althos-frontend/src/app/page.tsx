'use client'
import Link from 'next/link'
import { Heart, Brain, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-bg to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-brand" />
            <span className="text-2xl font-bold text-text-primary">Althos</span>
          </div>
          <Link href="/login" className="text-brand hover:text-brand-strong font-medium">
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Your Personal Mental<br />
          <span className="text-brand">Wellness Companion</span>
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
          AI-powered journaling, mood tracking, and personalized support designed 
          specifically for Indian youth navigating modern challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-4">
            I Have An Account
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-text-secondary text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>100% Private & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Built for Indian Youth</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI-Powered Support</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Smart Journaling"
            description="Write your thoughts and get empathetic AI responses with personalized coping strategies"
            icon="✍️"
            color="info"
          />
          <FeatureCard 
            title="Mood Atlas"
            description="Visualize your emotional patterns and discover insights about your mental wellness journey"
            icon="🧭"
            color="success"
          />
          <FeatureCard 
            title="Clinical Sharing"
            description="Securely share your progress with healthcare providers through time-limited links"
            icon="🏥"
            color="calm"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-text-secondary">
        <p>&copy; 2025 Althos. Built with ❤️ for Indian youth mental wellness.</p>
      </footer>
    </main>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  color: 'info' | 'success' | 'calm'
}

function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  const colorClasses = {
    info: 'bg-info/20 border-info/30',
    success: 'bg-success/20 border-success/30',
    calm: 'bg-calm/20 border-calm/30'
  }

  return (
    <div className={`card ${colorClasses[color]} animate-slide-up border-2`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
