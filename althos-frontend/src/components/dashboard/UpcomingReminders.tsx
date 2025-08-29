'use client'
import { useState, useEffect } from 'react'
import { Clock, Bell, Heart, Calendar, CheckCircle2 } from 'lucide-react'

interface Reminder {
  id: string
  title: string
  description: string
  time: string
  type: 'mood' | 'journal' | 'selfcare' | 'appointment'
  completed?: boolean
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
        type: 'mood'
      },
      {
        id: '2',
        title: 'Weekly Journal Review',
        description: 'Review and reflect on this week\'s entries',
        time: 'Tomorrow',
        type: 'journal'
      },
      {
        id: '3',
        title: 'Self-Care Break',
        description: '15 minutes of mindfulness or breathing',
        time: 'In 2 hours',
        type: 'selfcare'
      }
    ]
    setReminders(mockReminders)
  }, [])

  const getTypeConfig = (type: Reminder['type']) => {
    const configs = {
      mood: {
        icon: Heart,
        color: 'bg-success/10 border-success/20 text-green-700',
        iconColor: 'text-green-600'
      },
      journal: {
        icon: Calendar,
        color: 'bg-info/10 border-info/20 text-blue-700',
        iconColor: 'text-blue-600'
      },
      selfcare: {
        icon: Bell,
        color: 'bg-calm/10 border-calm/20 text-purple-700',
        iconColor: 'text-purple-600'
      },
      appointment: {
        icon: Clock,
        color: 'bg-warning/10 border-warning/20 text-orange-700',
        iconColor: 'text-orange-600'
      }
    }
    return configs[type]
  }

  const markCompleted = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ))
  }

  if (reminders.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand" />
          Reminders
        </h3>
        <div className="text-center py-6">
          <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary">
            All caught up! No reminders right now.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand" />
        Reminders
      </h3>
      
      <div className="space-y-3">
        {reminders.map((reminder) => {
          const config = getTypeConfig(reminder.type)
          const IconComponent = config.icon

          return (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                reminder.completed 
                  ? 'bg-gray-50 border-gray-200 opacity-75' 
                  : config.color
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${reminder.completed ? 'text-gray-400' : config.iconColor}`}>
                  {reminder.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium ${
                      reminder.completed 
                        ? 'text-gray-500 line-through' 
                        : 'text-text-primary'
                    }`}>
                      {reminder.title}
                    </h4>
                    <time className={`text-xs ${
                      reminder.completed 
                        ? 'text-gray-400' 
                        : 'text-text-secondary'
                    }`}>
                      {reminder.time}
                    </time>
                  </div>
                  <p className={`text-sm ${
                    reminder.completed 
                      ? 'text-gray-400' 
                      : 'text-text-secondary'
                  }`}>
                    {reminder.description}
                  </p>
                  
                  {!reminder.completed && (
                    <button
                      onClick={() => markCompleted(reminder.id)}
                      className="text-xs text-brand hover:text-brand-strong mt-2 font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button className="btn-secondary w-full mt-4 text-sm">
        View All Reminders
      </button>
    </div>
  )
}
