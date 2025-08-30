'use client'
import { useState, useEffect } from 'react'
import { Clock, Bell, Heart, Calendar, CheckCircle2, Star, AlertCircle, Coffee } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['600'],
})

interface Reminder {
  id: string
  title: string
  description: string
  time: string
  type: 'mood' | 'journal' | 'selfcare' | 'appointment'
  completed?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function UpcomingReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => {
    // Mock reminders - replace with actual API
    const mockReminders: Reminder[] = [
      {
        id: '1',
        title: 'Evening Mood Check',
        description: 'Take a moment to reflect on your day',
        time: '8:00 PM',
        type: 'mood',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Weekly Journal Review',
        description: 'Review and reflect on this week\'s entries',
        time: 'Tomorrow',
        type: 'journal',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Self-Care Break',
        description: '15 minutes of mindfulness or breathing',
        time: 'In 2 hours',
        type: 'selfcare',
        priority: 'low'
      }
    ]
    setReminders(mockReminders)
  }, [])

  const getTypeConfig = (type: Reminder['type']) => {
    const configs = {
      mood: {
        icon: Heart,
        gradient: 'from-rose-400 to-pink-500',
        bgColor: 'from-rose-50 to-pink-100',
        textColor: 'text-rose-700',
        iconColor: 'text-rose-600',
        shadowColor: 'shadow-rose-200'
      },
      journal: {
        icon: Calendar,
        gradient: 'from-blue-400 to-indigo-500',
        bgColor: 'from-blue-50 to-indigo-100',
        textColor: 'text-blue-700',
        iconColor: 'text-blue-600',
        shadowColor: 'shadow-blue-200'
      },
      selfcare: {
        icon: Coffee,
        gradient: 'from-purple-400 to-violet-500',
        bgColor: 'from-purple-50 to-violet-100',
        textColor: 'text-purple-700',
        iconColor: 'text-purple-600',
        shadowColor: 'shadow-purple-200'
      },
      appointment: {
        icon: Clock,
        gradient: 'from-orange-400 to-amber-500',
        bgColor: 'from-orange-50 to-amber-100',
        textColor: 'text-orange-700',
        iconColor: 'text-orange-600',
        shadowColor: 'shadow-orange-200'
      }
    }
    return configs[type]
  }

  const getPriorityConfig = (priority: Reminder['priority']) => {
    const configs = {
      high: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
      medium: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' },
      low: { icon: Star, color: 'text-green-500', bg: 'bg-green-100' }
    }
    return configs[priority || 'medium']
  }

  const markCompleted = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ))
  }

  if (reminders.length === 0) {
    return (
      <div className={`${montserrat.className} p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20`}>
        <h3 className="text-lg font-bold text-[#BE5985] mb-4 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
            <Bell className="h-4 w-4 text-white" />
          </div>
          Reminders
        </h3>
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-[#BE5985] mb-2">All Caught Up! ✨</h4>
          <p className="text-[#BE5985]/70 text-sm leading-relaxed">
            No reminders right now. Enjoy your peaceful moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${montserrat.className} p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#EC7FA9]/25 transition-all duration-500`}>
      {/* Floating background elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#BE5985] flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Bell className="h-4 w-4 text-white" />
            </div>
            Reminders
          </h3>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFEDFA]/60 border border-[#FFB8E0]/40">
            <div className="h-2 w-2 bg-[#EC7FA9] rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-[#BE5985]">{reminders.filter(r => !r.completed).length} pending</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {reminders.map((reminder, index) => {
            const config = getTypeConfig(reminder.type)
            const priorityConfig = getPriorityConfig(reminder.priority)
            const IconComponent = config.icon

            return (
              <div
                key={reminder.id}
                className={`group/reminder p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  reminder.completed 
                    ? 'bg-gray-50/80 border-gray-200/50 opacity-75' 
                    : `bg-gradient-to-br ${config.bgColor}/40 border-[#FFB8E0]/30 hover:border-[#EC7FA9]/50`
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`relative flex-shrink-0 ${reminder.completed ? 'opacity-60' : ''}`}>
                    {reminder.completed ? (
                      <div className="p-3 rounded-xl bg-green-100 shadow-inner">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg ${config.shadowColor}/50 group-hover/reminder:scale-110 group-hover/reminder:rotate-12 transition-all duration-300`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    {/* Priority indicator */}
                    {!reminder.completed && reminder.priority && (
                      <div className={`absolute -top-1 -right-1 p-1 rounded-full ${priorityConfig.bg} shadow-sm`}>
                        <priorityConfig.icon className={`h-2 w-2 ${priorityConfig.color}`} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold transition-colors duration-300 ${
                        reminder.completed 
                          ? 'text-gray-500 line-through' 
                          : 'text-[#BE5985] group-hover/reminder:text-[#EC7FA9]'
                      }`}>
                        {reminder.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <time className={`text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                          reminder.completed 
                            ? 'text-gray-400 bg-gray-100' 
                            : 'text-[#BE5985] bg-[#FFEDFA]/60'
                        }`}>
                          {reminder.time}
                        </time>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                      reminder.completed 
                        ? 'text-gray-400' 
                        : 'text-[#BE5985]/70'
                    }`}>
                      {reminder.description}
                    </p>
                    
                    {!reminder.completed && (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => markCompleted(reminder.id)}
                          className="text-xs font-medium text-[#EC7FA9] hover:text-[#BE5985] px-3 py-1 rounded-full bg-[#FFEDFA]/60 hover:bg-[#FFB8E0]/40 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 transition-all duration-300 hover:shadow-md hover:shadow-[#FFB8E0]/30"
                        >
                          Mark Complete
                        </button>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                          reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {reminder.priority} priority
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/40 hover:from-[#FFB8E0]/40 hover:to-[#EC7FA9]/30 border border-[#FFB8E0]/40 hover:border-[#EC7FA9]/50 text-[#BE5985] hover:text-[#EC7FA9] font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB8E0]/30 hover:-translate-y-0.5 text-sm">
          View All Reminders
        </button>
      </div>
    </div>
  )
}
