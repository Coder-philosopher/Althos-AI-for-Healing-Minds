export interface User {
  id: string;
  display_name?: string;
  locale?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Journal {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood_valence?: number;
  mood_arousal?: number;
  tags?: string[];
  pii_redacted?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MoodDaily {
  id: string;
  user_id: string;
  date: string;
  valence: number;
  arousal: number;
  source: 'self' | 'journal' | 'derived';
  created_at: Date;
}

export interface Test {
  id: string;
  user_id: string;
  type: 'phq9' | 'gad7';
  score: number;
  answers: number[];
  severity_band?: string;
  taken_at: Date;
}

export interface CopingTask {
  id: string;
  user_id: string;
  journal_id?: string;
  title: string;
  steps: string[];
  duration_mins?: number;
  category?: string;
  status: 'pending' | 'done' | 'skipped';
  created_at: Date;
  completed_at?: Date;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  from_date: string;
  to_date: string;
  summary_text: string;
  audio_url?: string;
  metaphor?: string;
  created_at: Date;
}

export interface Share {
  id: string;
  user_id: string;
  token: string;
  scopes: string[];
  window_days: number;
  expires_at: Date;
  revoked: boolean;
  access_count: number;
  created_at: Date;
}

export interface Alert {
  id: string;
  user_id: string;
  risk_level: 'none' | 'low' | 'med' | 'high';
  reasons?: string[];
  context_text?: string;
  status: 'open' | 'acknowledged' | 'closed';
  created_at: Date;
}

export interface AccessLog {
  id: number;
  user_id?: string;
  actor: 'user' | 'clinician' | 'system';
  action: string;
  resource: string;
  token?: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  created_at: Date;
}

export interface KindnessHighlight {
  id: string;
  user_id: string;
  source_journal_id: string;
  highlight_text: string;
  generated_at: Date;
}

// API Request/Response Types

export interface CreateJournalRequest {
  title?: string;
  content: string;
  mood?: {
    valence: number; // -2 to 2
    arousal: number; // 0 to 1
  };
  tags?: string[];
}

export interface CreateJournalResponse {
  id: string;
  created_at: Date;
}

export interface JournalCoachRequest {
  text: string;
  language_pref?: string;
  tone_pref?: string;
  context?: {
    recent_moods?: Array<{ valence: number; arousal: number; date: string }>;
    recent_scores?: Array<{ type: string; score: number; date: string }>;
  };
}

export interface JournalCoachResponse {
  empathy: string;
  reframe: string;
  actions: Array<{
    title: string;
    steps: string[];
    duration_mins: number;
    category?: string;
  }>;
  risk: 'none' | 'low' | 'med' | 'high';
}

export interface CopingRequest {
  goal: string;
  time_avail_mins?: number;
  constraints?: string[];
  environment?: string;
}

export interface CopingResponse {
  actions: Array<{
    title: string;
    steps: string[];
    duration_mins: number;
    category: string;
  }>;
}

export interface WeeklySummaryRequest {
  with_audio?: boolean;
  from_date?: string;
  to_date?: string;
}

export interface WeeklySummaryResponse {
  summary_text: string;
  audio_url?: string;
  metaphor?: string;
  period: {
    from: string;
    to: string;
  };
}

export interface KindnessRequest {
  journal_ids?: string[];
  days_back?: number;
}

export interface KindnessResponse {
  positives: Array<{
    text: string;
    source_date: string;
    journal_id: string;
  }>;
  caption: string;
}

export interface DistressCheckRequest {
  text: string;
  context?: string;
}

export interface DistressCheckResponse {
  risk: 'none' | 'low' | 'med' | 'high';
  reasons: string[];
  helplines: Array<{
    name: string;
    phone: string;
    available: string;
  }>;
  suggest_next_step: string;
}

export interface TestRequest {
  answers: number[];
  taken_at?: Date;
}

export interface TestResponse {
  id: string;
  score: number;
  severity_band: string;
  explanation: string;
  suggestion: string;
}

export interface TestInsightsResponse {
  trends: Array<{
    date: string;
    phq9?: number;
    gad7?: number;
  }>;
  correlations: Array<{
    note: string;
    strength?: 'weak' | 'moderate' | 'strong';
  }>;
}

export interface MoodDailyRequest {
  date: string;
  valence: number;
  arousal: number;
}

export interface MoodAtlasResponse {
  clusters: Array<{
    id: number;
    center: {
      valence: number;
      arousal: number;
    };
    days: string[];
    color?: string;
  }>;
  highlights: string[];
  period: {
    from: string;
    to: string;
  };
}

export interface ShareRequest {
  scopes?: string[];
  window_days?: number;
  expires_mins?: number;
}

export interface ShareResponse {
  id: string;
  token: string;
  url: string;
  expires_at: Date;
}

export interface ClinicianSummaryResponse {
  patient_alias: string;
  period: {
    from: string;
    to: string;
  };
  summary: {
    soap_text: string;
    scores: {
      phq9?: Array<{ score: number; date: string }>;
      gad7?: Array<{ score: number; date: string }>;
    };
    trends: {
      mood_pattern: string;
      risk_indicators: string[];
    };
  };
  generated_at: Date;
  access_count: number;
}