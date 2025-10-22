import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  
  // Google Cloud
   geminiApiKey: process.env.GEMINI_API_KEY || '',
  gcpProjectId: process.env.GCP_PROJECT_ID || '',
  gcpLocation: process.env.GCP_LOCATION || 'us-central1',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  ttsVoice: process.env.TTS_VOICE || 'en-IN-Wavenet-A',
  
  // Features
  enableAI: process.env.ENABLE_AI !== 'false',
  enableTTS: process.env.ENABLE_TTS !== 'false',
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || '',
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
    bucketName: process.env.GCS_BUCKET_NAME || 'althos-journal-audio',
  }
};

// Validation
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export default config;
