'use client'
import Link from 'next/link'
import { Heart, Home, ArrowLeft, Star, Sparkles, Brain, Compass, BookOpen } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

const inspirationalQuotes = [
  {
    text: "Every small step you take towards healing is a victory worth celebrating.",
    author: "Unknown",
    category: "Healing"
  },
  {
    text: "You are not your struggles. You are the brave soul who faces them each day.",
    author: "Anonymous", 
    category: "Courage"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer",
    category: "Journey"
  },
  {
    text: "Your current situation is not your final destination. Keep going.",
    author: "Unknown",
    category: "Hope"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay",
    category: "Support"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person.",
    author: "Lori Deschene",
    category: "Acceptance"
  }
]

const wellnessTips = [
  {
    icon: Heart,
    tip: "Take three deep breaths and remind yourself: 'This moment will pass.'",
    action: "Practice mindful breathing"
  },
  {
    icon: Star,
    tip: "Write down one thing you're grateful for today, no matter how small.",
    action: "Start a gratitude practice"
  },
  {
    icon: Brain,
    tip: "Remember that seeking help is a sign of strength, not weakness.",
    action: "Reach out for support"
  }
]

export default function NotFound() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const quote = inspirationalQuotes[currentQuote]

  return (
    <div className={`${montserrat.className} min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4`}>
      {/* Floating background elements */}
      <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-[#FFB8E0]/15 to-[#EC7FA9]/10 blur-[60px] animate-pulse" />
      <div className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full bg-gradient-to-br from-[#FFEDFA]/25 to-[#BE5985]/10 blur-[40px] animate-pulse" />
      <div className="absolute top-[60%] right-[5%] w-32 h-32 rounded-full bg-gradient-to-br from-[#EC7FA9]/10 to-[#FFB8E0]/15 blur-[30px] animate-pulse" />

      <div className={`max-w-4xl mx-auto text-center space-y-12 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header Section */}
        <div className="space-y-8">
          {/* 404 Display */}
          <div className="relative">
            <div className="text-8xl md:text-9xl font-bold text-[#BE5985]/10 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-full bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-2xl shadow-[#EC7FA9]/30 animate-bounce">
                <Heart className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#BE5985] leading-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-[#BE5985]/80 max-w-2xl mx-auto leading-relaxed">
              It seems like you've wandered off the path, but that's okay. Sometimes getting lost helps us discover new directions. 
              Let's get you back to your wellness journey.
            </p>
          </div>
        </div>

        {/* Inspirational Quote Section */}
        <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
          <Sparkles className="absolute top-6 right-6 h-5 w-5 text-[#EC7FA9]/60 animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#BE5985]">Daily Inspiration</h3>
            </div>
            
            <div key={currentQuote} className="animate-fade-in">
              <blockquote className="text-xl md:text-2xl font-semibold text-[#BE5985] leading-relaxed mb-4 italic">
                "{quote.text}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <cite className="text-[#BE5985]/70 font-medium">— {quote.author}</cite>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FFB8E0]/40 to-[#EC7FA9]/30 border border-[#FFB8E0]/50">
                  <span className="text-xs font-medium text-[#BE5985]">{quote.category}</span>
                </div>
              </div>
            </div>

            {/* Quote Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {inspirationalQuotes.map((_, index) => (
                <button
                  title='button'
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote 
                      ? 'bg-[#EC7FA9] w-6' 
                      : 'bg-[#FFB8E0]/50 hover:bg-[#FFB8E0]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wellness Tips Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {wellnessTips.map((tip, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-[#FFB8E0]/40 shadow-lg shadow-[#FFB8E0]/20 hover:shadow-xl hover:shadow-[#EC7FA9]/25 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30 w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <tip.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-[#BE5985] font-medium leading-relaxed mb-3">
                  {tip.tip}
                </p>
                <div className="px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
                  <span className="text-xs font-medium text-[#BE5985]/80">{tip.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Actions */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Let's Go Back to Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#BE5985] to-[#EC7FA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-1"
            >
              <Compass className="h-5 w-5" />
              Go to Dashboard
            </Link>
          </div>

          {/* Emergency Support */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 backdrop-blur-sm">
            <p className="text-sm text-blue-700 mb-2">
              <strong>Need immediate support?</strong> You're not alone.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="tel:14416" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">
                Tele-MANAS: 14416
              </a>
              <span className="text-blue-400">•</span>
              <a href="tel:18005990019" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">
                Kiran: 1800-599-0019
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Brand */}
        <div className="flex items-center justify-center gap-2 text-[#BE5985]/60">
          <Heart className="h-4 w-4 text-[#EC7FA9] animate-pulse" />
          <span className="text-sm">Althos - Your Mental Wellness Companion</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
