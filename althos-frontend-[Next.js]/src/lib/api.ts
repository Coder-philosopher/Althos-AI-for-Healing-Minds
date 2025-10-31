const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://althos-ai-for-healing-minds-ivory.vercel.app'



import crypto from 'crypto';
const sec ="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
const KEY = Buffer.from(sec, 'hex'); // 32 bytes hex string
const ALGO = 'aes-256-gcm';

class APIError extends Error {
  constructor(public status: number, message: string, public endpoint?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// -------- Encryption / Decryption Helpers --------
function encrypt(data: any) {
  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();
  return {
    encrypted,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

function decrypt(data: any) {
  const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(data.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(data.tag, 'base64'));
  let decrypted = decipher.update(data.encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// -------- API Call Wrapper --------
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const body = options.body ? encrypt(JSON.parse(options.body.toString())) : undefined;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new APIError(response.status, data?.message || 'Request failed', endpoint);
  }

  // Decrypt response if encrypted
  if (data?.encrypted && data?.iv && data?.tag) {
    return decrypt(data);
  }

  return data;
}





// api.ts


export const getOrgAnalytics = async (orgCode: string) => {
  return apiCall('/orgs/analytics', {
    method: 'POST',
    body: JSON.stringify({ org_code: orgCode }),
  });
};



export async function fetchFriends(userId:string) {
  const res = await fetch('/api/friends', {
    headers: { 'X-User-Id': userId }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchMessages(conversationId:string) {
  const res = await fetch(`/api/messages/${conversationId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function sendMessage(conversationId:string, sender:string, receiver:string, text:string) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, sender, receiver, text }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return true;
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

export const login = async (credentials: { name: string; email: string }) => {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
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

export const generateJournalAudio = async (
  userId: string, 
  journalId: string, 
  language: string
) => {
  return apiCall('/ai/journal-audio', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ journal_id: journalId, language }),
  })
}

export const getSupportedLanguagesAudio = async () => {
  return apiCall('/ai/supported-languages', {
    method: 'GET',
  })
}


export const getJournalCoaching = async (userId: string, journalId: string) => {
  return apiCall('/ai/journal-coach', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ journal_id: journalId }),
  })
}

export async function generateAIMusic(userId: string, payload: { mood_text: string; mood_label: string }) {
  return await apiCall('/ai/music', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(payload),
  })
}



export const getJournalById = async (userId: string, journalId: string) => {
  return apiCall(`/journal/${journalId}`, {
    headers: { 'X-User-Id': userId },
  })
}

export const updateJournal = async (userId: string, journalId: string, data: any) => {
  return apiCall(`/journal/${journalId}`, {
    method: 'PUT',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  })
}

export const deleteJournal = async (userId: string, journalId: string) => {
  return apiCall(`/journal/${journalId}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': userId },
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

export const postChatQuery = async (userId: string, query: string) => {
  return apiCall('/chat/query', {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify({ query }),
  })
}



