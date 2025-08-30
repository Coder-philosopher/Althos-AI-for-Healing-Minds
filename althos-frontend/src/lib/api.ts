const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://your-api-domain.com'

class APIError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message)
    this.name = 'APIError'
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`
  const start = performance.now()

  console.groupCollapsed(`[API Request] ${options.method || 'GET'} ${url}`)
  console.log('➡️ Endpoint:', endpoint)
  console.log('➡️ Full URL:', url)
  console.log('➡️ Options:', options)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const duration = (performance.now() - start).toFixed(2)

    console.log('⏱ Duration:', `${duration}ms`)
    console.log('⬅️ Status:', response.status, response.statusText)

    let data: any
    try {
      data = await response.json()
      console.log('⬅️ Response JSON:', data)
    } catch (err) {
      console.warn('⚠️ Failed to parse JSON, raw response will be returned')
      data = null
    }

    if (!response.ok) {
      console.error('❌ API Error:', data)
      throw new APIError(response.status, data?.message || 'Request failed', endpoint)
    }

    console.groupEnd()
    return data
  } catch (err) {
    console.error('💥 Fetch failed:', err)
    console.groupEnd()
    throw err
  }
}

// -----------------------
// Auth & Profile
// -----------------------
export const register = async (userData: any) => {
  console.info('[register] Sending user data:', userData)
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const getProfile = async (userId: string) => {
  console.info('[getProfile] Fetching profile for user:', userId)
  return apiCall('/profile', {
    headers: { 'X-User-Id': userId },
  })
}

export const updateProfile = async (userId: string, updates: any) => {
  console.info('[updateProfile] Updating profile for user:', userId, 'with:', updates)
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
  console.info('[createJournal] User:', userId, 'Data:', data)
  return apiCall('/journal', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const getJournals = async (userId: string, limit = 20, offset = 0) => {
  console.info('[getJournals] User:', userId, 'Limit:', limit, 'Offset:', offset)
  return apiCall(`/journal?limit=${limit}&offset=${offset}`, {
    headers: { 'X-User-Id': userId },
  })
}

export const getJournalCoaching = async (userId: string, data: any) => {
  console.info('[getJournalCoaching] User:', userId, 'Payload:', data)
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
  console.info('[submitPHQ9] User:', userId, 'Answers:', data)
  return apiCall('/tests/phq9', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const submitGAD7 = async (userId: string, data: { answers: number[] }) => {
  console.info('[submitGAD7] User:', userId, 'Answers:', data)
  return apiCall('/tests/gad7', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const getTestInsights = async (userId: string, days = 30) => {
  console.info('[getTestInsights] User:', userId, 'Days:', days)
  return apiCall(`/tests/insights?days=${days}`, {
    headers: { 'X-User-Id': userId },
  })
}

// -----------------------
// Mood
// -----------------------
export const recordDailyMood = async (userId: string, data: any) => {
  console.info('[recordDailyMood] User:', userId, 'Data:', data)
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
  console.info('[getMoodAtlas] User:', userId, 'From:', fromDate, 'To:', toDate)

  return apiCall(url, {
    headers: { 'X-User-Id': userId },
  })
}

// -----------------------
// Wellness
// -----------------------
export const getWeeklySummary = async (userId: string, withAudio = false) => {
  console.info('[getWeeklySummary] User:', userId, 'With audio:', withAudio)
  return apiCall('/ai/weekly-summary', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ with_audio: withAudio }),
  })
}

export const checkDistress = async (userId: string, text: string) => {
  console.info('[checkDistress] User:', userId, 'Text:', text)
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
  console.info('[createShare] User:', userId, 'Options:', options)
  return apiCall('/shares/new', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(options),
  })
}

export const getClinicianSummary = async (token: string) => {
  console.info('[getClinicianSummary] Token:', token)
  return apiCall(`/shares/${token}/summary`)
}

export const getShareList = async (userId: string) => {
  console.info('[getShareList] User:', userId)
  return apiCall('/shares/list', {
    headers: { 'X-User-Id': userId },
  })
}

export const revokeShare = async (userId: string, shareId: string) => {
  console.info('[revokeShare] User:', userId, 'Share ID:', shareId)
  return apiCall(`/shares/${shareId}/revoke`, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
  })
}

export const getShareAnalytics = async (userId: string, shareId: string) => {
  console.info('[getShareAnalytics] User:', userId, 'Share ID:', shareId)
  return apiCall(`/shares/${shareId}/analytics`, {
    headers: { 'X-User-Id': userId },
  })
}
