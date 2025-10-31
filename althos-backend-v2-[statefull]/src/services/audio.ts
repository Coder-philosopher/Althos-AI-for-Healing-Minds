import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { Storage } from '@google-cloud/storage';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';

export interface MusicGenerationRequest {
  prompt: string;
  userId: string;
  mood_text: string;
  mood_label: string;
}

export interface MusicGenerationResponse {
  audioUrl: string;
  cached: boolean;
}
const musicStorage = new Storage({
  credentials: config.gcp2.credentials,
  projectId: config.gcp2.projectId,
})
const musicBucket = musicStorage.bucket(config.gcp2.bucketName)

const ttsClient = new TextToSpeechClient({
  credentials: config.gcp.credentials,
  projectId: config.gcp.projectId,
});

const translateClient = new TranslationServiceClient({
  credentials: config.gcp.credentials,
  projectId: config.gcp.projectId,
});

const storage = new Storage({
  credentials: config.gcp.credentials,
  projectId: config.gcp.projectId,
});

const bucket = storage.bucket(config.gcp.bucketName);

// Supported Indian languages with voice configurations
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', voiceName: 'en-IN-Neural2-D', languageCode: 'en-IN' },
  hi: { name: 'हिन्दी (Hindi)', voiceName: 'hi-IN-Neural2-D', languageCode: 'hi-IN' },
  ta: { name: 'தமிழ் (Tamil)', voiceName: 'ta-IN-Standard-A', languageCode: 'ta-IN' },
  te: { name: 'తెలుగు (Telugu)', voiceName: 'te-IN-Standard-A', languageCode: 'te-IN' },
  bn: { name: 'বাংলা (Bengali)', voiceName: 'bn-IN-Standard-A', languageCode: 'bn-IN' },
  ml: { name: 'മലയാളം (Malayalam)', voiceName: 'ml-IN-Standard-A', languageCode: 'ml-IN' },
  mr: { name: 'मराठी (Marathi)', voiceName: 'mr-IN-Standard-A', languageCode: 'mr-IN' },
  gu: { name: 'ગુજરાતી (Gujarati)', voiceName: 'gu-IN-Standard-A', languageCode: 'gu-IN' },
  kn: { name: 'ಕನ್ನಡ (Kannada)', voiceName: 'kn-IN-Standard-A', languageCode: 'kn-IN' },
  pa: { name: 'ਪੰਜਾਬੀ (Punjabi)', voiceName: 'pa-IN-Standard-A', languageCode: 'pa-IN' },
};

export interface AudioGenerationRequest {
  text: string;
  targetLanguage: string;
  journalId: string;
}

export interface AudioGenerationResponse {
  audioUrl: string;
  language: string;
  translatedText?: string;
  cached: boolean;
}

const geminiApiKey = 'AIzaSyDJlVWRytYefvEqJCdJDTi1xdDQuKb2MnU';

async function sanitizePromptWithLLM(userPrompt: string): Promise<string> {
 const systemPrompt = `
You are a professional input sanitization assistant for a text-to-music generator.

Your task is to transform user requests into safe, clear, and positive descriptions suitable for Google MusicLM or Lyra models.

Follow these strict rules:

1. **Always Positive and Uplifting:**  
   - Never include negative, sad, disturbing, violent, or uncomfortable emotions.  
   - Avoid references to failure, stress, anxiety, or any unpleasant experiences.  
   - Convert any negative feelings into positive, motivating, or hopeful expressions.

2. **Professional and Descriptive:**  
   - Rewrite the input into a concise, professional, and detailed description of the desired music.  
   - Include mood, tone, tempo, and key musical elements in a neutral or positive framing.  
   - Avoid unnecessary filler words, slang, or casual language.

3. **No Direct Repetition:**  
   - Never return the same text as the input.  
   - Always rewrite or rephrase creatively to make it original and refined.

4. **Safe and Compliant Content:**  
   - Never include any personal, sensitive, or explicit content.  
   - Avoid references to sadness, illness, loss, or any negative context.  
   - Ensure the text cannot trigger recitation, emotional distress, or content filters.

5. **Output Format:**  
   - Return **only** the sanitized prompt text — no explanations, comments, or metadata.

Example Conversion:
Input: "Generate a short instrumental for feeling low because I did bad in exams."
Output: "A short, uplifting instrumental track with a calm and encouraging mood, featuring gentle melodies and soft rhythms that inspire confidence and positivity."

Now, sanitize the following user input accordingly.`


  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input: ${userPrompt}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  // Extract sanitized text: the first part of the first candidate
  return data.candidates[0].content.parts[0].text.trim();
}

async function generateMusicViaVertexAI(originalPrompt: string): Promise<Buffer> {
  const location = 'us-central1'
  const projectId = config.gcp2.projectId
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/lyria-002:predict`

  console.log('[MusicLM] Starting request to endpoint:', endpoint)
  console.log('[MusicLM] Original Prompt:', originalPrompt)

  // Sanitize prompt but ignore for now - use hardcoded prompt or originalPrompt as desired
  const prompt = await sanitizePromptWithLLM(originalPrompt)
  console.log('[MusicLM] Sanitized Prompt:', prompt)

  // Hardcoded positive prompt to avoid filter blocks (adjust as needed)

  const { GoogleAuth } = await import('google-auth-library')
  const auth = new GoogleAuth({
    credentials: config.gcp2.credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
  const client = await auth.getClient()
  const access_token = await client.getAccessToken()

  console.log('[MusicLM] Obtained access token')

  // Construct request body per official spec
  const requestBody = {
    instances: [
      {
        prompt: prompt,
        negative_prompt: '',   // optional, put empty or user input
        sample_count: 1,
        // seed: 123,           // optional seed if needed
      }
    ],
    parameters: {}
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token.token ?? access_token}`,
    },
    body: JSON.stringify(requestBody),
  })

  console.log('[MusicLM] Response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Vertex AI MusicLM API error: ${errorText}`)
  }

  const data = await response.json()
  // console.log('[MusicLM] Response JSON:', JSON.stringify(data, null, 2))

  // Correctly extract base64 audio from response predictions
  const prediction = data.predictions?.[0]
  if (!prediction || !prediction.bytesBase64Encoded) {
    console.error('[MusicLM] Missing bytesBase64Encoded in prediction:', JSON.stringify(prediction))
    throw new Error('No audio content received from Lyria model')
  }

  const audioBase64 = prediction.bytesBase64Encoded
  return Buffer.from(audioBase64, 'base64')
}






export const audioService = {
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') return text;

    const request = {
      parent: `projects/${config.gcp.projectId}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translateClient.translateText(request);
    return response.translations?.[0]?.translatedText || text;
  },

  async generateAudio(text: string, languageCode: string): Promise<Buffer> {
    const langConfig = SUPPORTED_LANGUAGES[languageCode as keyof typeof SUPPORTED_LANGUAGES];
  
    if (!langConfig) {
      throw new Error(`Unsupported language: ${languageCode}`);
    }

    const request = {
      input: { text },
      voice: {
        languageCode: langConfig.languageCode,
        name: langConfig.voiceName,
        ssmlGender: 'FEMALE' as const,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: 0.95,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    return Buffer.from(response.audioContent as Uint8Array);
  },

  async uploadToGCS(audioBuffer: Buffer, journalId: string, language: string): Promise<string> {
    const fileName = `audio/${journalId}/${language}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioBuffer, {
      contentType: 'audio/mpeg',
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    await file.makePublic();

    return `https://storage.googleapis.com/${config.gcp.bucketName}/${fileName}`;
  },

  async generateAndCacheAudio(
    request: AudioGenerationRequest
  ): Promise<AudioGenerationResponse> {
    const { text, targetLanguage, journalId } = request;

    const translatedText = await this.translateText(text, targetLanguage);
    const audioBuffer = await this.generateAudio(translatedText, targetLanguage);
    const audioUrl = await this.uploadToGCS(audioBuffer, journalId, targetLanguage);

    return {
      audioUrl,
      language: targetLanguage,
      translatedText: targetLanguage !== 'en' ? translatedText : undefined,
      cached: false,
    };
  },
  async generateAndCacheMusic(request: MusicGenerationRequest): Promise<MusicGenerationResponse> {

    try {
      const audioBuffer = await generateMusicViaVertexAI(request.prompt)
      console.log('[audioService] Received audio buffer, length:', audioBuffer.length)

      const fileName = `music/${request.userId}/${Date.now()}_${uuidv4()}.mp3`
      const file = musicBucket.file(fileName)

      await file.save(audioBuffer, {
        contentType: 'audio/mpeg',
        metadata: { cacheControl: 'public, max-age=31536000' },
      })
      

      const audioUrl = `https://storage.googleapis.com/${config.gcp2.bucketName}/${fileName}`
      console.log('[audioService] Uploaded audio URL:', audioUrl)

      return { audioUrl, cached: false }
    } catch (error) {
      console.log('[audioService] Error in generateAndCacheMusic:', error)
      throw error
    }
  },


};
