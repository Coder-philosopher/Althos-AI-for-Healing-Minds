'use client'

import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { 
  HelpCircle, BookOpen, PlayCircle, FileText, Users, 
  MessageSquare, Shield, Zap, Heart, Brain, PenTool,
  Smile, Settings, Share2, TrendingUp, CheckCircle,
  ArrowRight, Sparkles, Search, ChevronDown, ChevronUp,
  Mail, Phone, Clock, MapPin, Video, Headphones
} from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

const quickStartGuides = [
  {
    id: 'getting-started',
    title: 'Getting Started with Althos',
    icon: Sparkles,
    color: 'from-purple-400 to-violet-500',
    bgColor: 'from-purple-50 to-violet-100',
    duration: '5 min read',
    steps: [
      {
        number: 1,
        title: 'Create Your Account',
        description: 'Sign up with your email and create a secure password. Your data is encrypted and completely private.',
        tip: 'Use a strong password with a mix of letters, numbers, and symbols.'
      },
      {
        number: 2,
        title: 'Complete Your Profile',
        description: 'Add basic information to personalize your experience. This helps our AI provide better support.',
        tip: 'You can update your profile anytime in Settings.'
      },
      {
        number: 3,
        title: 'Take Your First Mood Check',
        description: 'Log your current mood and energy levels. This creates your baseline for tracking progress.',
        tip: 'Be honest - there are no right or wrong answers!'
      },
      {
        number: 4,
        title: 'Write Your First Journal Entry',
        description: 'Express your thoughts freely. Our AI will provide empathetic responses and coping strategies.',
        tip: 'Write as much or as little as you want - even a few sentences help.'
      },
      {
        number: 5,
        title: 'Explore Your Dashboard',
        description: 'Check your wellness insights, mood patterns, and personalized recommendations.',
        tip: 'Visit daily to track your progress and build healthy habits.'
      }
    ]
  },
  {
    id: 'mood-tracking',
    title: 'How to Track Your Mood',
    icon: Smile,
    color: 'from-emerald-400 to-green-500',
    bgColor: 'from-emerald-50 to-green-100',
    duration: '3 min read',
    steps: [
      {
        number: 1,
        title: 'Access Mood Tracker',
        description: 'Click on "Mood" from your dashboard or use the Quick Mood Check widget.',
        tip: 'Set daily reminders to build a consistent tracking habit.'
      },
      {
        number: 2,
        title: 'Rate Your Mood',
        description: 'Use the slider to indicate how you\'re feeling from very low to very good.',
        tip: 'Think about your overall emotional state, not just this moment.'
      },
      {
        number: 3,
        title: 'Rate Your Energy',
        description: 'Select your current energy level from calm to energized.',
        tip: 'Energy and mood are different - you can feel happy but tired!'
      },
      {
        number: 4,
        title: 'View Your Patterns',
        description: 'Check your Mood Atlas to see trends, patterns, and insights over time.',
        tip: 'Look for patterns related to sleep, activities, or days of the week.'
      }
    ]
  },
  {
    id: 'journaling',
    title: 'Smart Journaling Guide',
    icon: PenTool,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-100',
    duration: '4 min read',
    steps: [
      {
        number: 1,
        title: 'Start a New Entry',
        description: 'Click "New Entry" from the Journal page or dashboard quick action.',
        tip: 'You can journal multiple times a day - there\'s no limit!'
      },
      {
        number: 2,
        title: 'Write Freely',
        description: 'Express your thoughts, feelings, and experiences without judgment.',
        tip: 'Don\'t worry about grammar or structure - just write honestly.'
      },
      {
        number: 3,
        title: 'Get AI Insights',
        description: 'Our AI analyzes your entry and provides empathetic responses and coping strategies.',
        tip: 'AI suggestions are personalized based on your writing.'
      },
      {
        number: 4,
        title: 'Review Past Entries',
        description: 'Reflect on your journey by reading previous entries and tracking growth.',
        tip: 'Use the search feature to find entries about specific topics.'
      }
    ]
  },
  {
    id: 'sharing',
    title: 'Clinical Sharing Feature',
    icon: Share2,
    color: 'from-rose-400 to-pink-500',
    bgColor: 'from-rose-50 to-pink-100',
    duration: '3 min read',
    steps: [
      {
        number: 1,
        title: 'Generate Share Link',
        description: 'Go to Share page and select what data you want to share with your therapist.',
        tip: 'You have full control over what information is shared.'
      },
      {
        number: 2,
        title: 'Set Time Limit',
        description: 'Choose how long the link should be active (24 hours, 7 days, or 30 days).',
        tip: 'Links automatically expire for your security.'
      },
      {
        number: 3,
        title: 'Share with Provider',
        description: 'Send the secure link to your healthcare provider via email or message.',
        tip: 'Only share with trusted, verified healthcare professionals.'
      },
      {
        number: 4,
        title: 'Revoke Access Anytime',
        description: 'You can deactivate the share link at any time from your dashboard.',
        tip: 'All your data remains private and encrypted.'
      }
    ]
  }
]

const faqs = [
  {
    category: 'General',
    icon: HelpCircle,
    color: 'from-purple-400 to-violet-500',
    questions: [
      {
        q: 'Is Althos free to use?',
        a: 'Yes! Althos is completely free for all users. We believe mental health support should be accessible to everyone.'
      },
      {
        q: 'Is my data private and secure?',
        a: 'Absolutely. All your data is encrypted end-to-end. We never share your personal information with third parties. You have complete control over your data and can delete it anytime.'
      },
      {
        q: 'Can I use Althos on my phone?',
        a: 'Yes! Althos works on any device with a web browser - phone, tablet, or computer. We\'re also working on native mobile apps coming soon.'
      },
      {
        q: 'Do I need to use my real name?',
        a: 'No, you can use any name you\'re comfortable with. Your privacy is our top priority.'
      }
    ]
  },
  {
    category: 'Features',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    questions: [
      {
        q: 'How does the AI journal response work?',
        a: 'Our AI analyzes your journal entries using natural language processing to understand your emotions and context. It then provides empathetic responses, validates your feelings, and suggests evidence-based coping strategies personalized to your situation.'
      },
      {
        q: 'Can I track multiple moods per day?',
        a: 'Yes! You can log your mood as many times as you want throughout the day. This helps you understand how your emotions change and what triggers different feelings.'
      },
      {
        q: 'What wellness tests are available?',
        a: 'We offer validated assessments for depression (PHQ-9), anxiety (GAD-7), stress levels, and overall wellbeing. These tests help you understand your mental health status and track improvements over time.'
      },
      {
        q: 'How do I interpret my Mood Atlas?',
        a: 'The Mood Atlas visualizes your emotional patterns over time using charts and graphs. Look for trends, correlations with activities or sleep, and overall trajectory. Our AI also provides insights and explanations.'
      }
    ]
  },
  {
    category: 'Privacy & Security',
    icon: Shield,
    color: 'from-blue-400 to-indigo-500',
    questions: [
      {
        q: 'Who can see my journal entries?',
        a: 'Only you can see your journal entries unless you explicitly share them using the Clinical Sharing feature. Even Althos staff cannot access your private data.'
      },
      {
        q: 'How long do you keep my data?',
        a: 'Your data is kept as long as your account is active. You can delete specific entries or your entire account at any time, which permanently removes all your data from our servers.'
      },
      {
        q: 'Is the sharing feature secure?',
        a: 'Yes! Share links are encrypted, time-limited, and can be revoked instantly. You choose exactly what data to share and for how long.'
      },
      {
        q: 'Do you use my data to train AI?',
        a: 'No. We never use your personal journal entries or mood data to train our AI models. Your privacy is non-negotiable.'
      }
    ]
  },
  {
    category: 'Support',
    icon: Heart,
    color: 'from-rose-400 to-pink-500',
    questions: [
      {
        q: 'What if I\'m in crisis?',
        a: 'Althos is not a crisis service. If you\'re experiencing a mental health emergency, please call emergency services (112) or contact crisis helplines like NIMHANS (080-46110007) or iCall (9152987821) immediately.'
      },
      {
        q: 'Is Althos a replacement for therapy?',
        a: 'No. Althos is a self-help tool that complements professional mental health care. If you\'re struggling, we strongly encourage you to seek help from a licensed therapist or counselor.'
      },
      {
        q: 'How do I contact support?',
        a: 'You can reach us at support@althos.health or use the contact form below. We typically respond within 24 hours.'
      },
      {
        q: 'Can I suggest new features?',
        a: 'Absolutely! We love user feedback. Email us at feedback@althos.health with your ideas. Many of our best features came from user suggestions!'
      }
    ]
  }
]

const supportChannels = [
  {
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    icon: Mail,
    color: 'from-blue-400 to-indigo-500',
    contact: 'support@althos.health',
    availability: 'Response within 24 hours'
  },
  {
    title: 'Help Center',
    description: 'Browse articles and guides',
    icon: BookOpen,
    color: 'from-purple-400 to-violet-500',
    contact: 'Visit Help Center',
    availability: 'Available 24/7'
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    icon: Video,
    color: 'from-rose-400 to-pink-500',
    contact: 'View Tutorials',
    availability: 'Available 24/7'
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: Users,
    color: 'from-emerald-400 to-green-500',
    contact: 'Join Community',
    availability: 'Active community'
  }
]

export default function HelpPage() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const activeGuide = selectedGuide 
    ? quickStartGuides.find(g => g.id === selectedGuide)
    : null

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className={montserrat.className}>
      <Navbar />
      
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#FFF5F9] to-[#FFEBF3]">
        {/* Background elements */}
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#E879B9]/20 to-[#F8A5C2]/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#DB5F9A]/15 to-[#FFCCE0]/20 blur-[80px] animate-pulse" />

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 pt-32 md:pt-40 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border-2 border-[#E879B9]/30 shadow-lg mb-6">
              <HelpCircle className="h-5 w-5 text-[#DB5F9A]" />
              <span className="text-sm font-bold text-[#C74585]">Help Center</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#C74585] mb-6 leading-tight">
              How Can We{' '}
              <span className="bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#C74585] bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#A03768]/75 max-w-3xl mx-auto leading-relaxed mb-8">
              Get answers to your questions and learn how to make the most of Althos
            </p>

            {/* Search Bar */}
          </div>
        </section>

           
        {/* Quick Start Guides */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C74585] mb-3">
              Quick Start Guides
            </h2>
            <p className="text-[#A03768]/70 max-w-2xl mx-auto">
              Step-by-step tutorials to help you get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {quickStartGuides.map((guide) => {
              const IconComponent = guide.icon
              const isSelected = selectedGuide === guide.id
              
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(isSelected ? null : guide.id)}
                  className={cn(
                    "group relative text-left transition-all duration-500",
                    isSelected && "md:col-span-2"
                  )}
                >
                  {!isSelected && (
                    <div className={cn(
                      "absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity",
                      `bg-gradient-to-r ${guide.color}`
                    )} />
                  )}
                  
                  <div className={cn(
                    "relative p-6 rounded-2xl border-2 transition-all duration-500",
                    `bg-gradient-to-br ${guide.bgColor}`,
                    isSelected 
                      ? "border-[#E879B9]/60 shadow-2xl" 
                      : "border-[#F8A5C2]/40 hover:border-[#E879B9]/60 hover:shadow-xl hover:-translate-y-1"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl shadow-lg border-2 border-white/50 transition-transform duration-300",
                        `bg-gradient-to-br ${guide.color}`,
                        !isSelected && "group-hover:scale-110 group-hover:rotate-6"
                      )}>
                        <IconComponent className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl text-[#C74585] flex items-center gap-2">
                            {guide.title}
                          </h3>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-[#E879B9]/30">
                            <Clock className="h-3 w-3 text-[#DB5F9A]" />
                            <span className="text-xs font-bold text-[#C74585]">{guide.duration}</span>
                          </div>
                        </div>
                        
                        {!isSelected && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#DB5F9A] mt-3">
                            <span>View {guide.steps.length} steps</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Steps */}
                    {isSelected && (
                      <div className="mt-6 space-y-4 animate-fade-in">
                        {guide.steps.map((step) => (
                          <div 
                            key={step.number}
                            className="p-5 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-[#F8A5C2]/40 hover:border-[#E879B9]/60 transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] flex items-center justify-center text-white font-bold shadow-lg">
                                {step.number}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-[#C74585] mb-2">
                                  {step.title}
                                </h4>
                                <p className="text-[#A03768]/80 text-sm leading-relaxed mb-3">
                                  {step.description}
                                </p>
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] border border-[#E879B9]/20">
                                  <Sparkles className="h-4 w-4 text-[#E879B9] flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-[#A03768]/70 font-medium">
                                    <span className="font-bold text-[#DB5F9A]">Tip:</span> {step.tip}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
           <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#DB5F9A] h-5 w-5 group-focus-within:text-[#E879B9] transition-colors" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/90 backdrop-blur-md border-2 border-[#F8A5C2]/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E879B9]/50 focus:border-[#E879B9] transition-all duration-300 text-[#C74585] placeholder-[#A03768]/50 shadow-lg font-medium"
                />
              </div>
            </div>
        {/* FAQs Section */}
        <section className="relative z-10 max-w-7xl mx-auto my-4 px-4 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C74585] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#A03768]/70 max-w-2xl mx-auto">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Find answers to common questions'}
            </p>
          </div>

          <div className="space-y-8">
            {(searchQuery ? filteredFAQs : faqs).map((category) => {
              const IconComponent = category.icon
              
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2.5 rounded-xl shadow-lg border-2 border-white/50",
                      `bg-gradient-to-br ${category.color}`
                    )}>
                      <IconComponent className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#C74585]">{category.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {category.questions.map((faq, idx) => {
                      const faqId = `${category.category}-${idx}`
                      const isExpanded = expandedFAQ === faqId
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setExpandedFAQ(isExpanded ? null : faqId)}
                          className="w-full text-left p-5 rounded-2xl bg-white/80 backdrop-blur-md border-2 border-[#F8A5C2]/40 hover:border-[#E879B9]/60 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-[#C74585] mb-2 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#E879B9]" />
                                {faq.q}
                              </h4>
                              {isExpanded && (
                                <p className="text-[#A03768]/80 leading-relaxed mt-3 pl-4 animate-fade-in">
                                  {faq.a}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-[#DB5F9A]" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-[#DB5F9A]" />
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {searchQuery && filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-8 rounded-full bg-gradient-to-br from-[#F8A5C2]/20 to-[#E879B9]/10 mb-4">
                <Search className="h-16 w-16 text-[#DB5F9A]" />
              </div>
              <h3 className="text-xl font-bold text-[#C74585] mb-2">No results found</h3>
              <p className="text-[#A03768]/70">Try different keywords or browse all FAQs above</p>
            </div>
          )}
        </section>

        {/* Contact Support Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 border-2 border-[#E879B9]/30 mb-4">
                <Headphones className="h-5 w-5 text-[#DB5F9A]" />
                <span className="text-sm font-bold text-[#C74585]">Need More Help?</span>
              </div>
              <h2 className="text-3xl font-bold text-[#C74585] mb-3">Contact Support</h2>
              <p className="text-[#A03768]/70 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {supportChannels.map((channel, idx) => {
                const IconComponent = channel.icon
                
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] border-2 border-[#F8A5C2]/40 hover:border-[#E879B9]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={cn(
                      "inline-flex p-3 rounded-xl shadow-lg border-2 border-white/50 mb-4",
                      `bg-gradient-to-br ${channel.color}`
                    )}>
                      <IconComponent className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-lg text-[#C74585] mb-2">{channel.title}</h3>
                    <p className="text-sm text-[#A03768]/70 mb-3">{channel.description}</p>
                    <div className="text-sm font-bold text-[#DB5F9A]">{channel.contact}</div>
                    <div className="text-xs text-[#A03768]/60 mt-1">{channel.availability}</div>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold shadow-2xl hover:shadow-[#E879B9]/50 transition-all duration-300 hover:-translate-y-1 border-2 border-white/30"
              >
                <Heart className="h-5 w-5" fill="white" />
                Start Your Wellness Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
