"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '8080', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    // Database
    databaseUrl: process.env.DATABASE_URL,
    // Google Cloud
    gcpProjectId: process.env.GCP_PROJECT_ID || '',
    gcpLocation: process.env.GCP_LOCATION || 'us-central1',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    ttsVoice: process.env.TTS_VOICE || 'en-IN-Wavenet-A',
    // Features
    enableAI: process.env.ENABLE_AI !== 'false',
    enableTTS: process.env.ENABLE_TTS !== 'false',
};
// Validation
if (!exports.config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
}
exports.default = exports.config;
