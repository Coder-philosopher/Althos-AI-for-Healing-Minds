export interface User {
  id: string
  name: string
  age?: number
  sex?: string
  profession?: string
  hobbies?: string[]
  locale?: string
  created_at: string
  updated_at: string
}

export interface Journal {
  id: string
  user_id: string
  title?: string
  content: string
  mood_valence?: number
  mood_arousal?: number
  tags?: string[]
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  date: string
  valence: number
  arousal: number
  source: string
  created_at: string
}
export interface Share {
  id: string
  user_id: string
  token: string
  scopes: string[]
  window_days: number
  expires_at: string
  revoked: boolean
  access_count: number
  created_at: string
  url: string  // Added for convenience
}

export interface ShareRequest {
  scopes?: string[]
  window_days?: number
  expires_mins?: number
}

export interface ShareAnalytics {
  share_id: string
  total_views: number
  last_accessed: string | null
  access_log: Array<{
    timestamp: string
    ip_address?: string
  }>
  expires_at: string
  revoked: boolean
}
export interface Test {
  id: string
  user_id: string
  type: 'phq9' | 'gad7'
  score: number
  answers: number[]
  severity_band: string
  taken_at: string
}

export interface Share {
  id: string
  user_id: string
  token: string
  scopes: string[]
  window_days: number
  expires_at: string
  revoked: boolean
  access_count: number
  created_at: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  pagination?: {
    limit: number
    offset: number
    has_more: boolean
  }
}

export interface JournalCoachResponse {
  empathy: string
  reframe: string
  actions: Array<{
    title: string
    steps: string[]
    duration_mins: number
    category: string
  }>
  risk: 'none' | 'low' | 'med' | 'high'
}

export interface WeeklySummaryResponse {
  summary_text: string
  audio_url?: string
  metaphor: string
  period: {
    from: string
    to: string
  }
}

export interface DistressCheckResponse {
  risk: 'none' | 'low' | 'med' | 'high'
  reasons: string[]
  helplines: Array<{
    name: string
    phone: string
    available: string
  }>
  suggest_next_step: string
}
