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
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    gcpProjectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0242961376',
    gcpLocation: process.env.GCP_LOCATION || 'us-central1',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    ttsVoice: process.env.TTS_VOICE || 'en-IN-Wavenet-A',
    // Features
    enableAI: process.env.ENABLE_AI !== 'false',
    enableTTS: process.env.ENABLE_TTS !== 'false',
    // Hardcoded GCP credentials (for private repo use only)
    gcp: {
        projectId: 'gen-lang-client-0242961376',
        bucketName: process.env.GCS_BUCKET_NAME || 'althos-journal-audio',
        credentials: {
            type: 'service_account',
            project_id: 'gen-lang-client-0242961376',
            private_key_id: '0749b42a22fbd3f30f0dcddfaafa0affc125b742',
            private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyz4VS/NUMtS5+
vWPgQxqWa1hkvb04ke8WBCzlS4NC6tZZDKlgoQbsh2svGa6N8HUI/BRgv5fMFCxM
7GCpQnwteO8ewLUxMMGccs4WONV/8+Am3fezVHlMMcKBWZAJWflrG8mhGOd/46M6
lb9IUs+Bvf25DIKncXW3ihRcAHaHIkPqJwOtttd5ntjDkd8jqh8OpUKjLNTsj+/t
IeGox9JozQcWfUVDvbS5zjepox2zkb3wC7CEqWCFp55lxtQmNMoU0EiCIMrOoxj8
p3erRqR9ly0UsGCs8Alwek2Jn80FrloVIgEuvhl4Wjml4IC67l1kWi+NFLVTD/kz
hzJHs3T7AgMBAAECggEABbT2hgndvt8VfHliSP5l8yu6kX82HSpt3V+wEyK62MA9
VnA/WP8qr705YDJ1+L/A7H18elitvpdc5pjwviuKDRAmtEOQROFP0e90FmTP+O/O
qqQ7oJ9Ek82kGJQZiG2KYVnCBgCRJZVyreRToOT2YdIE2WAbLL7unoyrTlhmxV9L
6Dgu53ptoNfDa2NRxo79ye7ZUyPcyQ2xrbRKgcgJqqkcbXHsC4wzLGe5Bt3E+BDR
6Sfc0ggzmhTgaAAVm3EPD+qPujptoqOKDmqLEaO8EYWR5sJ2zxDTGKC/Nd8ZwRWB
J6dLGuKHpxupZlfh3eUu6Qp7MlWKcba1C6cGxyopmQKBgQDkweo/FDi5Nz8X91rt
P7kiR21HH7EXra3wmDiorJjPlszYoBcQvB/4qbs4FZ2mkDN6gqqRZTZ4m+THuIn/
F+7HHYHQnriIJgPCl0vBwHRLWhh55eP+1EtsvZmX4e7fCsqgOkXEDKt3eI04YTTP
EVXu4pjkem36gaXs13riWnJSjwKBgQDIGuLBS7F35cIVBkzqEoTfx+pv3hH2VKaB
9IMKoYxMnizX3Ulsm9JGNVWbg1xCpyB/+QOJXuKckUu72PPanw+7IDsiKL4nhUVg
hNyRtUeNaKYjs2zEOWBW1wr+r+9QHVTJF/W5vtvbxWHPdGjC8l7ulNdA7+I9F4aD
XFMqFbD81QKBgHjWgmG90dTs/RQw4sQuhCI6btxCPm8OnLJaBpv7SGFn/F91+Zkq
dw0Iw8/1gyioRbkyat2RBHwjhW+G6MZqowRlbtx/62RoCFZzS15WxlfDiOhjatOC
2zDe2tKjU2ZYsf5/qbjNJIpgkOC2YIn9U1J0OmV+0regYsDAdrY5Jui7AoGAFr23
d3A6wv2BiRImO5PPNf9qTTxXnj8QjURUgCjL4Qk4329uoME0rHXzPLE5EvobX2/V
Tw9Rgamhib+mNvpMt196WO94bNVghQ+UYZrQfumduAD0I3jB0hyuSzODZv9uW0w1
yN4/7kIIU6NPJJiW4VZZADBC7d52kwczDF1at+ECgYAFGnHVQ+PJxGcFd314I5dq
P4kTWAI7iQiztENMsa2N+tMkV3IoxDYvVSck9hqd4KaMg29Bu5zbmnF4ZQU+pPa3
8rDKWMw2ON8zWe13b51vmGcsR52BroS+7jGkxgAi/CWwdlPvjv7nd8xpFMJtrsvr
AemcgjriOz1pUEqR6V9Eqg==
-----END PRIVATE KEY-----`,
            client_email: 'althos-translator@gen-lang-client-0242961376.iam.gserviceaccount.com',
            client_id: '113473854680046543047',
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/althos-translator%40gen-lang-client-0242961376.iam.gserviceaccount.com',
            universe_domain: 'googleapis.com'
        }
    },
    gcp2: {
        credentials: require('./cred/gcp2.json'), // your new key
        projectId: 'gen-lang-client-0242961376',
        bucketName: 'althos-music-bucket',
    },
};
// Validation
if (!exports.config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
}
exports.default = exports.config;
