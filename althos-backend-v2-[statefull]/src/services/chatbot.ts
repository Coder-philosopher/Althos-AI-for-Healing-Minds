// services/chatbot.ts
import config from '../config' // contains geminiApiKey
import db from '../db'
import { v4 as uuidv4 } from 'uuid'

export async function answerUserQuery(userId: string, query: string): Promise<string> {
  try {
    // 1. Gather context
    let journals, tests, moods
    try {
      journals = await db.journals.findByUser(userId, 50)
      tests = await db.tests.getInsights(userId)
      moods = await db.moods.findByUser(userId)
    } catch (err) {
      console.error('[answerUserQuery] Error fetching context data:', err)
      throw err
    }

    const context =
      'Recent journal entries:\n' + journals.map(j => j.content).join('\n').slice(0, 2000) + '\n\n' +
      'Recent mood entries:\n' + JSON.stringify(moods).slice(0, 1000) + '\n\n' +
      'Test insights:\n' + JSON.stringify(tests).slice(0, 1000)

    // 2. Get context embedding
    let embedding: number[] = []
    try {
      embedding = await embedContentGemini(context)
      await db.userEmbeddings.upsert(userId, embedding)
    } catch (err) {
      console.warn('[answerUserQuery] Embedding step failed, continuing without embeddings:', err)
    }

    // 3. Try cache lookup
    try {
      const cached = await db.chatCache.findAnswer(userId, query)
      if (cached) return cached.answer
    } catch (err) {
      console.error('[answerUserQuery] Error accessing chat cache:', err)
    }

    // 4. Compose prompt and call Gemini LLM
    const answer = await callGeminiLLM(query, context)

    // 5. Save to cache
    try {
      await db.chatCache.saveAnswer({
        id: uuidv4(),
        user_id: userId,
        query,
        answer,
        tags: [],
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[answerUserQuery] Failed to cache answer:', err)
    }

    return answer
  } catch (err) {
    console.error('[answerUserQuery] Fatal error handling user query:', err)
    throw err
  }
}

// --- Gemini Embedding ---

async function embedContentGemini(text: string, dimension: number = 768): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${config.geminiApiKey}`
  const payload = {
    content: { parts: [{ text }] },
    output_dimensionality: dimension,
  }

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[embedContentGemini] Network or fetch error:', err)
    throw err
  }

  if (!res.ok) {
    let errContent
    try { errContent = await res.json() } catch { errContent = await res.text() }
    console.error('[embedContentGemini] Gemini API error:', { status: res.status, body: errContent })
    throw new Error('Gemini embedding API call failed')
  }

  let data
  try {
    data = await res.json()
  } catch (err) {
    console.error('[embedContentGemini] Failed to parse embedding response JSON:', err)
    throw err
  }

  if (!data.embedding?.values) {
    console.error('[embedContentGemini] Unexpected response format:', data)
    throw new Error('No embedding returned')
  }

  return data.embedding.values
}

// --- Gemini Chat (LLM) ---

async function callGeminiLLM(userQuery: string, userContext: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`

  const chatPrompt = `
You are Althos-Bot, a quirky and positive Indian mental health support chatbot for students.
Your job:
- Always reply warmly, really short and simple.
- No hyphen or em-dashes in reply.
- Add relevant emojis.
- Never answer in markdown we just want a simple reply.
- Use cheerful language with a touch of Hinglish (casual Hindi in English alphabet). A dash of safe humor is welcome.
- Structure answer in ~3 tidy lines:
  1. Quick friendly greeting, make user smile and validate
  2. Cheery, practical advice/reframe (fun twist allowed)
  3. End with a light nudge, casual support, or friendly joke (use Hinglish if possible!)
- Don't say anything negative, don't use big/harsh words, no markdown/bold/em-dash/asterisk, no lists, no hyphens.

Example: "Oye, tension mat le! You’re doing better than you think. Try listening to your fav song. Chill karo, mast sab hoga! 😄"

Student’s background for context:
${userContext}

User’s question: "${userQuery}"
`

  const payload = {
    contents: [{ parts: [{ text: chatPrompt }] }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 256,
    },
  }

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[callGeminiLLM] Network or fetch error:', err)
    throw err
  }

  if (!res.ok) {
    let errContent
    try { errContent = await res.json() } catch { errContent = await res.text() }
    console.error('[callGeminiLLM] Gemini LLM API error:', { status: res.status, body: errContent })
    throw new Error('Gemini LLM API call failed')
  }

  let data
  try {
    data = await res.json()
  } catch (err) {
    console.error('[callGeminiLLM] Failed to parse LLM response JSON:', err)
    throw err
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.warn('[callGeminiLLM] No text returned from Gemini response:', data)
    return 'Oops! Aaj kuch nahi mila, try again? 😅'
  }

  return text
}
