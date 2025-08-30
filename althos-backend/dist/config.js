"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/althos',
    gcpProjectId: process.env.GCP_PROJECT_ID || '',
    gcpLocation: process.env.GCP_LOCATION || 'us-central1',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    geminiLocation: process.env.GEMINI_LOCATION || 'us-central1',
    ttsVoice: process.env.TTS_VOICE || 'en-IN-Wavenet-A',
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    demoUserId: process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000',
    enableTTS: process.env.ENABLE_TTS !== 'false',
    enableRealAI: process.env.ENABLE_REAL_AI !== 'false',
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['https://*.vercel.app', 'http://localhost:3000'],
    dbPool: {
        min: parseInt(process.env.DB_POOL_MIN || '0', 10),
        max: parseInt(process.env.DB_POOL_MAX || '5', 10),
        idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
        connectionTimeoutMillis: 5000,
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 100,
    },
};
if (!exports.config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
}
if (exports.config.enableRealAI && !exports.config.gcpProjectId) {
    console.warn('Warning: GCP_PROJECT_ID not set, AI features will use mock responses');
}
exports.default = exports.config;
