"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioService = exports.SUPPORTED_LANGUAGES = void 0;
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const translate_1 = require("@google-cloud/translate");
const storage_1 = require("@google-cloud/storage");
const config_1 = __importDefault(require("../config"));
const ttsClient = new text_to_speech_1.TextToSpeechClient({
    keyFilename: config_1.default.gcp.credentials,
});
const translateClient = new translate_1.TranslationServiceClient({
    keyFilename: config_1.default.gcp.credentials,
});
const storage = new storage_1.Storage({
    keyFilename: config_1.default.gcp.credentials,
});
const bucket = storage.bucket(config_1.default.gcp.bucketName);
// Supported Indian languages with voice configurations
exports.SUPPORTED_LANGUAGES = {
    'en': { name: 'English', voiceName: 'en-IN-Neural2-D', languageCode: 'en-IN' },
    'hi': { name: 'हिन्दी (Hindi)', voiceName: 'hi-IN-Neural2-D', languageCode: 'hi-IN' },
    'ta': { name: 'தமிழ் (Tamil)', voiceName: 'ta-IN-Standard-A', languageCode: 'ta-IN' },
    'te': { name: 'తెలుగు (Telugu)', voiceName: 'te-IN-Standard-A', languageCode: 'te-IN' },
    'bn': { name: 'বাংলা (Bengali)', voiceName: 'bn-IN-Standard-A', languageCode: 'bn-IN' },
    'ml': { name: 'മലയാളം (Malayalam)', voiceName: 'ml-IN-Standard-A', languageCode: 'ml-IN' },
    'mr': { name: 'मराठी (Marathi)', voiceName: 'mr-IN-Standard-A', languageCode: 'mr-IN' },
    'gu': { name: 'ગુજરાતી (Gujarati)', voiceName: 'gu-IN-Standard-A', languageCode: 'gu-IN' },
    'kn': { name: 'ಕನ್ನಡ (Kannada)', voiceName: 'kn-IN-Standard-A', languageCode: 'kn-IN' },
    'pa': { name: 'ਪੰਜਾਬੀ (Punjabi)', voiceName: 'pa-IN-Standard-A', languageCode: 'pa-IN' },
};
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
                ssmlGender: 'FEMALE', // Changed from 'NEUTRAL' to 'FEMALE'
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
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        });
        await file.makePublic();
        return `https://storage.googleapis.com/${config_1.default.gcp.bucketName}/${fileName}`;
    },
    async generateAndCacheAudio(request) {
        const { text, targetLanguage, journalId } = request;
        // Translate text if needed
        const translatedText = await this.translateText(text, targetLanguage);
        // Generate audio
        const audioBuffer = await this.generateAudio(translatedText, targetLanguage);
        // Upload to GCS
        const audioUrl = await this.uploadToGCS(audioBuffer, journalId, targetLanguage);
        return {
            audioUrl,
            language: targetLanguage,
            translatedText: targetLanguage !== 'en' ? translatedText : undefined,
            cached: false,
        };
    },
};
