export interface User {
  id: string;
  name: string;
  age?: number;
  sex?: string;
  profession?: string;
  hobbies?: string[];
  locale?: string;
  created_at: Date;
  updated_at: Date;
}
export interface JournalCoachRequest {
  text: string
  language_pref?: string
  tone_pref?: string
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


export interface RegisterUserRequest {
  id: string;
  name: string;
  age?: number;
  sex?: string;
  profession?: string;
  hobbies?: string[];
  locale?: string;
}

export interface Journal {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood_valence?: number;
  mood_arousal?: number;
  tags?: string[];
  created_at: Date;
}

export interface CreateJournalRequest {
  title?: string;
  content: string;
  mood?: {
    valence: number;
    arousal: number;
  };
  tags?: string[];
}

export interface JournalCoachRequest {
  text: string;
  language_pref?: string;
  tone_pref?: string;
}

export interface JournalCoachResponse {
  empathy: string;
  reframe: string;
  actions: Array<{
    title: string;
    steps: string[];
    duration_mins: number;
    category: string;
  }>;
  risk: 'none' | 'low' | 'med' | 'high';
}

export interface TestRequest {
  answers: number[];
}

export interface TestResponse {
  id: string;
  score: number;
  severity_band: string;
  explanation: string;
  suggestion: string;
}

export interface MoodDailyRequest {
  date: string;
  valence: number;
  arousal: number;
}

export interface ShareRequest {
  scopes?: string[];
  window_days?: number;
  expires_mins?: number;
}

export interface AppError extends Error {
  statusCode: number;
}

export type UserEmbedding = {
  user_id: string;
  embedding: number[]; // array of floats
}

export type ChatCacheEntry = {
  id: string;
  user_id: string;
  query: string;
  answer: string;
  tags: string[];
  created_at: string;
}
