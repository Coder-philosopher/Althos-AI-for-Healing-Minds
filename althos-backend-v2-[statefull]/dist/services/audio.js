"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioService = exports.SUPPORTED_LANGUAGES = void 0;
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const translate_1 = require("@google-cloud/translate");
const storage_1 = require("@google-cloud/storage");
const config_1 = __importDefault(require("../config"));
const uuid_1 = require("uuid");
const musicStorage = new storage_1.Storage({
    credentials: config_1.default.gcp2.credentials,
    projectId: config_1.default.gcp2.projectId,
});
const musicBucket = musicStorage.bucket(config_1.default.gcp2.bucketName);
const ttsClient = new text_to_speech_1.TextToSpeechClient({
    credentials: config_1.default.gcp.credentials,
    projectId: config_1.default.gcp.projectId,
});
const translateClient = new translate_1.TranslationServiceClient({
    credentials: config_1.default.gcp.credentials,
    projectId: config_1.default.gcp.projectId,
});
const storage = new storage_1.Storage({
    credentials: config_1.default.gcp.credentials,
    projectId: config_1.default.gcp.projectId,
});
const bucket = storage.bucket(config_1.default.gcp.bucketName);
// Supported Indian languages with voice configurations
exports.SUPPORTED_LANGUAGES = {
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
const geminiApiKey = 'AIzaSyDJlVWRytYefvEqJCdJDTi1xdDQuKb2MnU';
async function sanitizePromptWithLLM(userPrompt) {
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

Now, sanitize the following user input accordingly.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input: ${userPrompt}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
        }),
    });
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
async function generateMusicViaVertexAI(originalPrompt) {
    const location = 'us-central1';
    const projectId = config_1.default.gcp2.projectId;
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/lyria-002:predict`;
    console.log('[MusicLM] Starting request to endpoint:', endpoint);
    console.log('[MusicLM] Original Prompt:', originalPrompt);
    // Sanitize prompt but ignore for now - use hardcoded prompt or originalPrompt as desired
    const prompt = await sanitizePromptWithLLM(originalPrompt);
    console.log('[MusicLM] Sanitized Prompt:', prompt);
    // Hardcoded positive prompt to avoid filter blocks (adjust as needed)
    const { GoogleAuth } = await Promise.resolve().then(() => __importStar(require('google-auth-library')));
    const auth = new GoogleAuth({
        credentials: config_1.default.gcp2.credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const access_token = await client.getAccessToken();
    console.log('[MusicLM] Obtained access token');
    // Construct request body per official spec
    const requestBody = {
        instances: [
            {
                prompt: prompt,
                negative_prompt: '', // optional, put empty or user input
                sample_count: 1,
                // seed: 123,           // optional seed if needed
            }
        ],
        parameters: {}
    };
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token.token ?? access_token}`,
        },
        body: JSON.stringify(requestBody),
    });
    console.log('[MusicLM] Response status:', response.status);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vertex AI MusicLM API error: ${errorText}`);
    }
    const data = await response.json();
    // console.log('[MusicLM] Response JSON:', JSON.stringify(data, null, 2))
    // Correctly extract base64 audio from response predictions
    const prediction = data.predictions?.[0];
    if (!prediction || !prediction.bytesBase64Encoded) {
        console.error('[MusicLM] Missing bytesBase64Encoded in prediction:', JSON.stringify(prediction));
        throw new Error('No audio content received from Lyria model');
    }
    const audioBase64 = prediction.bytesBase64Encoded;
    return Buffer.from(audioBase64, 'base64');
}
exports.audioService = {
    async translateText(text, targetLanguage) {
        if (targetLanguage === 'en')
            return text;
        const request = {
            parent: `projects/${config_1.default.gcp.projectId}/locations/global`,
            contents: [text],
            mimeType: 'text/plain',
            targetLanguageCode: targetLanguage,
        };
        const [response] = await translateClient.translateText(request);
        return response.translations?.[0]?.translatedText || text;
    },
    async generateAudio(text, languageCode) {
        const langConfig = exports.SUPPORTED_LANGUAGES[languageCode];
        if (!langConfig) {
            throw new Error(`Unsupported language: ${languageCode}`);
        }
        const request = {
            input: { text },
            voice: {
                languageCode: langConfig.languageCode,
                name: langConfig.voiceName,
                ssmlGender: 'FEMALE',
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.95,
                pitch: 0.0,
                volumeGainDb: 0.0,
            },
        };
        const [response] = await ttsClient.synthesizeSpeech(request);
        return Buffer.from(response.audioContent);
    },
    async uploadToGCS(audioBuffer, journalId, language) {
        const fileName = `audio/${journalId}/${language}.mp3`;
        const file = bucket.file(fileName);
        await file.save(audioBuffer, {
            contentType: 'audio/mpeg',
            metadata: { cacheControl: 'public, max-age=31536000' },
        });
        await file.makePublic();
        return `https://storage.googleapis.com/${config_1.default.gcp.bucketName}/${fileName}`;
    },
    async generateAndCacheAudio(request) {
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
    async generateAndCacheMusic(request) {
        try {
            const audioBuffer = await generateMusicViaVertexAI(request.prompt);
            console.log('[audioService] Received audio buffer, length:', audioBuffer.length);
            const fileName = `music/${request.userId}/${Date.now()}_${(0, uuid_1.v4)()}.mp3`;
            const file = musicBucket.file(fileName);
            await file.save(audioBuffer, {
                contentType: 'audio/mpeg',
                metadata: { cacheControl: 'public, max-age=31536000' },
            });
            const audioUrl = `https://storage.googleapis.com/${config_1.default.gcp2.bucketName}/${fileName}`;
            console.log('[audioService] Uploaded audio URL:', audioUrl);
            return { audioUrl, cached: false };
        }
        catch (error) {
            console.log('[audioService] Error in generateAndCacheMusic:', error);
            throw error;
        }
    },
};
