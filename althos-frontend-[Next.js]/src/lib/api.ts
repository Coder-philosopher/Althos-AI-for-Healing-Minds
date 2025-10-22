const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://althos-ai-for-healing-minds-ivory.vercel.app'

class APIError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message)
    this.name = 'APIError'
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    let data: any
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new APIError(response.status, data?.message || 'Request failed', endpoint)
    }

    return data
  } catch (err) {
    throw err
  }
}

// -----------------------
// Auth & Profile
// -----------------------
export const register = async (userData: any) => {
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const getProfile = async (userId: string) => {
  return apiCall('/profile', {
    headers: { 'X-User-Id': userId },
  })
}

export const updateProfile = async (userId: string, updates: any) => {
  return apiCall('/profile', {
    method: 'PUT',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(updates),
  })
}

// -----------------------
// Journal
// -----------------------
export const createJournal = async (userId: string, data: any) => {
  return apiCall('/journal', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const getJournals = async (userId: string, limit = 20, offset = 0) => {
  return apiCall(`/journal?limit=${limit}&offset=${offset}`, {
    headers: { 'X-User-Id': userId },
  })
}

export const getJournalCoaching = async (userId: string, data: any) => {
  return apiCall('/ai/journal-coach', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

// -----------------------
// Tests
// -----------------------
export const submitPHQ9 = async (userId: string, data: { answers: number[] }) => {
  return apiCall('/tests/phq9', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const submitGAD7 = async (userId: string, data: { answers: number[] }) => {
  return apiCall('/tests/gad7', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const getTestInsights = async (userId: string, days = 30) => {
  return apiCall(`/tests/insights?days=${days}`, {
    headers: { 'X-User-Id': userId },
  })
}

// -----------------------
// Mood
// -----------------------
export const recordDailyMood = async (userId: string, data: any) => {
  return apiCall('/mood/daily', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const getMoodAtlas = async (userId: string, fromDate?: string, toDate?: string) => {
  let url = '/mood/atlas'
  const params = new URLSearchParams()
  if (fromDate) params.append('from', fromDate)
  if (toDate) params.append('to', toDate)
  if (params.toString()) url += `?${params.toString()}`

  return apiCall(url, {
    headers: { 'X-User-Id': userId },
  })
}

// -----------------------
// Wellness
// -----------------------
export const getWeeklySummary = async (userId: string, withAudio = false) => {
  return apiCall('/ai/weekly-summary', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ with_audio: withAudio }),
  })
}

export const checkDistress = async (userId: string, text: string) => {
  return apiCall('/ai/distress-check', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ text }),
  })
}

// -----------------------
// Sharing
// -----------------------
export const createShare = async (userId: string, options: any = {}) => {
  return apiCall('/shares/new', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(options),
  })
}

export const getClinicianSummary = async (token: string) => {
  return apiCall(`/shares/${token}/summary`)
}

export const getShareList = async (userId: string) => {
  return apiCall('/shares/list', {
    headers: { 'X-User-Id': userId },
  })
}

export const revokeShare = async (userId: string, shareId: string) => {
  return apiCall(`/shares/${shareId}/revoke`, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
  })
}

export const getShareAnalytics = async (userId: string, shareId: string) => {
  return apiCall(`/shares/${shareId}/analytics`, {
    headers: { 'X-User-Id': userId },
  })
}

// -----------------------
// Translation
// -----------------------
// -----------------------
// Translation
// -----------------------
export const translateText = async (
  text: string | string[], 
  targetLanguage: string,
  sourceLanguage: string = 'en'
) => {
  // This will call http://localhost:8080/api/translate
  return apiCall('/api/translate', {
    method: 'POST',
    body: JSON.stringify({
      text,
      targetLanguage,
      sourceLanguage,
    }),
  })
}

export const getSupportedLanguages = async () => {
  return apiCall('/api/languages')
}

