import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { Storage } from '@google-cloud/storage';
import config from '../config';
import { v4 as uuidv4 } from 'uuid';

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
};
