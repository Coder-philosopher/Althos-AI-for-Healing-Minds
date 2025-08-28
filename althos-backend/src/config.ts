export const config = {
  // Database Configuration (Neon)
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/althos',
  
  // Google Cloud Configuration
  gcpProjectId: process.env.GCP_PROJECT_ID || '',
  gcpLocation: process.env.GCP_LOCATION || 'us-central1',
  
  // Vertex AI Configuration
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  geminiLocation: process.env.GEMINI_LOCATION || 'us-central1',
  
  // Text-to-Speech Configuration
  ttsVoice: process.env.TTS_VOICE || 'en-IN-Wavenet-A',
  
  // Environment Settings
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Demo Configuration
  demoUserId: process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000',
  
  // Feature Flags
  enableTTS: process.env.ENABLE_TTS !== 'false',
  enableRealAI: process.env.ENABLE_REAL_AI !== 'false',
  
  // CORS Configuration (for Vercel frontend)
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['https://*.vercel.app', 'http://localhost:3000'],
  
  // Serverless Database Pool Settings
  dbPool: {
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    max: parseInt(process.env.DB_POOL_MAX || '5', 10), // Lower for serverless
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: 5000, // Shorter timeout for functions
  },
  
  // Rate Limiting (per function invocation)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
} as const;

// Validation
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (config.enableRealAI && !config.gcpProjectId) {
  console.warn('Warning: GCP_PROJECT_ID not set, AI features will use mock responses');
}

export default config;