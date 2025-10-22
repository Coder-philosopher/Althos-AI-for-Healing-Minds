'use client'

import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { 
  Brain, Heart, Users, Lightbulb, BookOpen, Activity, 
  Smile, Shield, Zap, Moon, Sun, Coffee, Wind,
  ArrowRight, CheckCircle, AlertCircle, Info, Sparkles
} from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

const mentalHealthTopics = [
  {
    id: 'depression',
    title: 'Depression',
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-100',
    description: 'Understanding persistent sadness and loss of interest',
    symptoms: [
      'Persistent sad, anxious, or "empty" mood',
      'Loss of interest in activities once enjoyed',
      'Changes in appetite and sleep patterns',
      'Difficulty concentrating or making decisions',
      'Feelings of hopelessness or worthlessness'
    ],
    whatToDo: [
      'Reach out to a mental health professional',
      'Maintain a routine with regular sleep and meals',
      'Stay connected with supportive people',
      'Engage in physical activity, even light exercise',
      'Practice self-compassion and patience'
    ]
  },
  {
    id: 'anxiety',
    title: 'Anxiety',
    icon: Activity,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'from-amber-50 to-orange-100',
    description: 'Managing excessive worry and nervousness',
    symptoms: [
      'Excessive worrying that\'s difficult to control',
      'Restlessness or feeling on edge',
      'Rapid heartbeat or breathing',
      'Difficulty concentrating',
      'Physical symptoms like sweating or trembling'
    ],
    whatToDo: [
      'Practice deep breathing exercises (4-7-8 technique)',
      'Challenge anxious thoughts with evidence',
      'Limit caffeine and alcohol intake',
      'Establish a regular sleep schedule',
      'Consider therapy like CBT or mindfulness'
    ]
  },
  {
    id: 'stress',
    title: 'Stress Management',
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
    bgColor: 'from-purple-50 to-violet-100',
    description: 'Coping with daily pressures and demands',
    symptoms: [
      'Feeling overwhelmed or unable to cope',
      'Headaches or muscle tension',
      'Irritability or mood swings',
      'Difficulty sleeping or concentrating',
      'Changes in eating habits'
    ],
    whatToDo: [
      'Identify and address stressors',
      'Practice time management techniques',
      'Take regular breaks throughout the day',
      'Engage in relaxation activities',
      'Set realistic goals and priorities'
    ]
  },
  {
    id: 'burnout',
    title: 'Burnout',
    icon: Coffee,
    color: 'from-rose-400 to-pink-500',
    bgColor: 'from-rose-50 to-pink-100',
    description: 'Recovering from emotional and physical exhaustion',
    symptoms: [
      'Chronic fatigue and lack of energy',
      'Reduced performance and productivity',
      'Cynicism or detachment from work/studies',
      'Sense of ineffectiveness',
      'Irritability and decreased satisfaction'
    ],
    whatToDo: [
      'Take time off if possible',
      'Set boundaries between work and personal life',
      'Reconnect with hobbies and interests',
      'Seek support from colleagues or mentors',
      'Consider professional counseling'
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep & Mental Health',
    icon: Moon,
    color: 'from-indigo-400 to-blue-500',
    bgColor: 'from-indigo-50 to-blue-100',
    description: 'The vital connection between rest and wellbeing',
    symptoms: [
      'Difficulty falling or staying asleep',
      'Waking up tired despite sleeping',
      'Daytime fatigue and irritability',
      'Difficulty concentrating',
      'Increased emotional reactivity'
    ],
    whatToDo: [
      'Maintain a consistent sleep schedule',
      'Create a relaxing bedtime routine',
      'Limit screen time before bed',
      'Keep bedroom cool, dark, and quiet',
      'Avoid caffeine and heavy meals before sleep'
    ]
  },
  {
    id: 'selfcare',
    title: 'Self-Care Practices',
    icon: Heart,
    color: 'from-emerald-400 to-green-500',
    bgColor: 'from-emerald-50 to-green-100',
    description: 'Daily habits for mental wellness',
    symptoms: [
      'Neglecting personal needs',
      'Feeling guilty for taking breaks',
      'Low energy and motivation',
      'Decreased self-worth',
      'Difficulty saying no to others'
    ],
    whatToDo: [
      'Schedule regular "me time"',
      'Practice mindfulness or meditation',
      'Engage in activities you enjoy',
      'Maintain social connections',
      'Exercise regularly and eat nutritious meals'
    ]
  }
]

const resources = [
  {
    title: 'NIMHANS Helpline',
    description: '24/7 mental health support',
    contact: '080-46110007',
    type: 'Emergency'
  },
  {
    title: 'iCall Helpline',
    description: 'Counseling service by TISS',
    contact: '9152987821',
    type: 'Counseling'
  },
  {
    title: 'Vandrevala Foundation',
    description: '24x7 helpline in multiple languages',
    contact: '1860-2662-345',
    type: 'Support'
  },
  {
    title: 'AASRA',
    description: 'Crisis intervention center',
    contact: '9820466726',
    type: 'Crisis'
  }
]

export default function HealthPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<'symptoms' | 'whatToDo' | null>(null)

  const activeTopic = selectedTopic 
    ? mentalHealthTopics.find(t => t.id === selectedTopic)
    : null

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
              <Brain className="h-5 w-5 text-[#DB5F9A]" />
              <span className="text-sm font-bold text-[#C74585]">Mental Health Education</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#C74585] mb-6 leading-tight">
              Understanding{' '}
              <span className="bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#C74585] bg-clip-text text-transparent">
                Mental Health
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#A03768]/75 max-w-3xl mx-auto leading-relaxed">
              Knowledge is the first step towards wellness. Learn about common mental health conditions, 
              recognize symptoms, and discover effective coping strategies.
            </p>
          </div>

          {/* Important Note */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 mb-2">Important Disclaimer</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    This information is for educational purposes only and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. If you're experiencing a mental health crisis, please contact a helpline or 
                    visit a healthcare professional immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#C74585] mb-8 text-center">
            Explore Mental Health Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mentalHealthTopics.map((topic) => {
              const IconComponent = topic.icon
              const isSelected = selectedTopic === topic.id
              
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
                  className={cn(
                    "group relative text-left transition-all duration-500",
                    isSelected && "md:col-span-2 lg:col-span-3"
                  )}
                >
                  {!isSelected && (
                    <div className={cn(
                      "absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity",
                      `bg-gradient-to-r ${topic.color}`
                    )} />
                  )}
                  
                  <div className={cn(
                    "relative p-6 rounded-2xl border-2 transition-all duration-500",
                    `bg-gradient-to-br ${topic.bgColor}`,
                    isSelected 
                      ? "border-[#E879B9]/60 shadow-2xl" 
                      : "border-[#F8A5C2]/40 hover:border-[#E879B9]/60 hover:shadow-xl hover:-translate-y-1"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl shadow-lg border-2 border-white/50 transition-transform duration-300",
                        `bg-gradient-to-br ${topic.color}`,
                        !isSelected && "group-hover:scale-110 group-hover:rotate-6"
                      )}>
                        <IconComponent className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-[#C74585] mb-2 flex items-center gap-2">
                          {topic.title}
                          {isSelected && <CheckCircle className="h-5 w-5 text-[#E879B9]" />}
                        </h3>
                        <p className="text-sm text-[#A03768]/70 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isSelected && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {/* Symptoms */}
                        <div className="p-5 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-[#F8A5C2]/40">
                          <div className="flex items-center gap-2 mb-4">
                            <Info className="h-5 w-5 text-[#DB5F9A]" />
                            <h4 className="font-bold text-lg text-[#C74585]">Common Symptoms</h4>
                          </div>
                          <ul className="space-y-2">
                            {topic.symptoms.map((symptom, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-[#A03768]/80">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E879B9] flex-shrink-0" />
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* What to Do */}
                        <div className="p-5 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-[#E879B9]/40">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="h-5 w-5 text-[#E879B9]" />
                            <h4 className="font-bold text-lg text-[#C74585]">What You Can Do</h4>
                          </div>
                          <ul className="space-y-2">
                            {topic.whatToDo.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-[#A03768]/80">
                                <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {!isSelected && (
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#DB5F9A]">
                        <span>Learn more</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Emergency Resources */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border-2 border-rose-300 mb-4">
                <Shield className="h-5 w-5 text-rose-600" />
                <span className="text-sm font-bold text-rose-700">Emergency Resources</span>
              </div>
              <h2 className="text-3xl font-bold text-[#C74585] mb-3">Need Immediate Help?</h2>
              <p className="text-[#A03768]/70 max-w-2xl mx-auto">
                These helplines are available 24/7 to provide support during difficult times
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] border-2 border-[#F8A5C2]/40 hover:border-[#E879B9]/60 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[#C74585]">{resource.title}</h3>
                      <p className="text-sm text-[#A03768]/70">{resource.description}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/20 border border-[#E879B9]/30">
                      <span className="text-xs font-bold text-[#C74585]">{resource.type}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${resource.contact}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Heart className="h-4 w-4" fill="white" />
                    {resource.contact}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold shadow-2xl hover:shadow-[#E879B9]/50 transition-all duration-300 hover:-translate-y-1 border-2 border-white/30"
              >
                <Sparkles className="h-5 w-5" />
                Start Your Wellness Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
