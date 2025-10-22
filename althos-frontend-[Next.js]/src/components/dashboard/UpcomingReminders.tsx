'use client'
import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
      },
      {
        id: '4',
        title: 'Gratitude Practice',
        description: 'List three things you\'re grateful for today',
        time: 'Before bed',
        type: 'journal',
        priority: 'medium'
      }
    ]
    setReminders(mockReminders)
  }, [])

  const getTypeConfig = (type: Reminder['type']) => {
    const configs = {
      mood: {
        
        gradient: 'from-rose-400 via-pink-500 to-rose-500',
        hoverGradient: 'from-rose-500 via-pink-600 to-rose-600',
        bgGradient: 'from-rose-50 via-pink-50 to-rose-100',
        iconColor: 'text-rose-600',
        borderColor: 'border-rose-200',
        glowColor: 'shadow-rose-300'
      },
      journal: {
        
        gradient: 'from-blue-400 via-indigo-500 to-blue-500',
        hoverGradient: 'from-blue-500 via-indigo-600 to-blue-600',
        bgGradient: 'from-blue-50 via-indigo-50 to-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        glowColor: 'shadow-blue-300'
      },
      selfcare: {
       
        gradient: 'from-purple-400 via-violet-500 to-purple-500',
        hoverGradient: 'from-purple-500 via-violet-600 to-purple-600',
        bgGradient: 'from-purple-50 via-violet-50 to-purple-100',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        glowColor: 'shadow-purple-300'
      },
      appointment: {
        
        gradient: 'from-orange-400 via-amber-500 to-orange-500',
        hoverGradient: 'from-orange-500 via-amber-600 to-orange-600',
        bgGradient: 'from-orange-50 via-amber-50 to-orange-100',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        glowColor: 'shadow-orange-300'
      }
    }
    return configs[type]
  }

  const getPriorityConfig = (priority: Reminder['priority']) => {
    const configs = {
      high: { 
        color: 'text-red-600', 
        bg: 'bg-gradient-to-br from-red-100 to-rose-100',
        border: 'border-red-300',
        label: 'High'
      },
      medium: { 
        color: 'text-amber-600', 
        bg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
        border: 'border-amber-300',
        label: 'Medium'
      },
      low: { 
        color: 'text-emerald-600', 
        bg: 'bg-gradient-to-br from-emerald-100 to-green-100',
        border: 'border-emerald-300',
        label: 'Low'
      }
    }
    return configs[priority || 'medium']
  }

  const markCompleted = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ))
  }

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id))
  }

  if (!mounted) return null

  if (reminders.length === 0) {
    return (
      <div className={`${montserrat.className} relative group w-full`}>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-[#FFF8FB] to-[#FFF5F9] backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20">
          <h3 className="text-2xl font-bold text-[#C74585] mb-8 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-xl border-2 border-white/50">
              </div>
            </div>
            Reminders
          </h3>
          
          <div className="text-center py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/30 to-green-300/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative p-8 rounded-full bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 border-2 border-emerald-200 shadow-xl">
              </div>
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
              All Caught Up! ✨
            </h4>
            <p className="text-[#A03768]/70 leading-relaxed max-w-xs mx-auto text-lg">
              No reminders right now. Enjoy your peaceful moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const pendingCount = reminders.filter(r => !r.completed).length

  return (
    <div className={`${montserrat.className} relative group w-full`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-[#FFF0F6] rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
      
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-[#FFF5F9]/80 backdrop-blur-xl border-2 border-[#F8A5C2]/50 shadow-2xl shadow-[#E879B9]/20 overflow-hidden transition-all duration-500 group-hover:shadow-[#E879B9]/30">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E879B9]/30 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-[#F8A5C2]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] rounded-2xl blur-xl opacity-40 animate-pulse" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] shadow-xl border-2 border-white/50">
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#C74585]">Upcoming Reminders</h3>
                <p className="text-sm text-[#A03768]/60 font-medium">Your scheduled wellness tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F8A5C2]/30 to-[#E879B9]/20 border-2 border-[#E879B9]/30 shadow-lg">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E879B9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A]"></span>
              </div>
              <span className="text-sm font-bold text-[#C74585]">{pendingCount} pending</span>
            </div>
          </div>
          
          {/* Reminders grid - 2 columns layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {reminders.map((reminder, index) => {
              const config = getTypeConfig(reminder.type)
              const priorityConfig = getPriorityConfig(reminder.priority)
              

              return (
                <div
                  key={reminder.id}
                  className={cn(
                    "group/reminder relative rounded-2xl transition-all duration-500",
                    reminder.completed && "opacity-60"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card glow effect */}
                  {!reminder.completed && (
                    <div className={cn(
                      "absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover/reminder:opacity-40 transition-opacity duration-500",
                      `bg-gradient-to-r ${config.gradient}`
                    )} />
                  )}

                  <div className={cn(
                    "relative p-5 rounded-2xl border-2 transition-all duration-500 h-full",
                    reminder.completed 
                      ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200" 
                      : `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} hover:shadow-xl hover:-translate-y-1`
                  )}>
                    <div className="flex flex-col h-full">
                      {/* Top section - Icon and Title */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Icon */}
                        <div className="relative flex-shrink-0">
                          {reminder.completed ? (
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-lg border-2 border-emerald-200">
                            </div>
                          ) : (
                            <>
                              <div className={cn(
                                "absolute inset-0 rounded-xl blur-lg transition-all duration-500",
                                `bg-gradient-to-br ${config.gradient}`,
                                "opacity-0 group-hover/reminder:opacity-60"
                              )} />
                              <div className={cn(
                                "relative p-3 rounded-xl shadow-xl border-2 border-white/50 transition-all duration-500",
                                `bg-gradient-to-br ${config.gradient}`,
                                "group-hover/reminder:scale-110 group-hover/reminder:rotate-6"
                              )}>
                              </div>
                            </>
                          )}
                          
                          {/* Priority indicator */}
                          {!reminder.completed && reminder.priority && (
                            <div className={cn(
                              "absolute -top-1 -right-1 p-1 rounded-full shadow-lg border-2 border-white",
                              priorityConfig.bg,
                              priorityConfig.border
                            )}>
                            </div>
                          )}
                        </div>
                        
                        {/* Title and time */}
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-bold text-base mb-1 transition-colors duration-300 line-clamp-1",
                            reminder.completed 
                              ? "text-gray-500 line-through" 
                              : "text-[#C74585] group-hover/reminder:text-[#E879B9]"
                          )}>
                            {reminder.title}
                          </h4>
                          
                          {/* Time badge */}
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border",
                            reminder.completed 
                              ? "text-gray-400 bg-gray-100 border-gray-200" 
                              : "text-[#C74585] bg-white/80 border-[#E879B9]/30"
                          )}>
                            {reminder.time}
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={cn(
                        "text-sm leading-relaxed mb-4 flex-1",
                        reminder.completed ? "text-gray-400" : "text-[#A03768]/70"
                      )}>
                        {reminder.description}
                      </p>
                      
                      {/* Actions */}
                      {!reminder.completed && (
                        <div className="flex items-center gap-2 pt-3 border-t border-[#F8A5C2]/30">
                          <button
                            onClick={() => markCompleted(reminder.id)}
                            className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-white/30"
                          >
                            Complete
                          </button>
                          
                          <button
                            onClick={() => removeReminder(reminder.id)}
                            className="p-1.5 rounded-lg bg-white/60 hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-colors border border-rose-200 hover:border-rose-300"
                            title="Remove reminder"
                          >
                          </button>

                          {/* Priority badge */}
                          <div className={cn(
                            "ml-auto px-2.5 py-1 rounded-full text-xs font-bold border",
                            priorityConfig.bg,
                            priorityConfig.border,
                            priorityConfig.color
                          )}>
                            <div className="flex items-center gap-1">
                              {priorityConfig.label}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* View all button */}
          <button className="w-full group/button relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] rounded-2xl blur-lg opacity-60 group-hover/button:opacity-100 transition-opacity" />
            <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-r from-[#F8A5C2]/40 to-[#E879B9]/30 hover:from-[#E879B9]/40 hover:to-[#DB5F9A]/40 border-2 border-[#E879B9]/40 hover:border-[#DB5F9A]/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-[#C74585] hover:text-[#DB5F9A] font-bold">
                View All Reminders
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
