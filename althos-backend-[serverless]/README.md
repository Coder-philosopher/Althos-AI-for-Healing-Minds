# Althos Backend - Serverless Cloud Functions

This is the complete serverless backend implementation for the Althos mental wellness platform using Google Cloud Functions.

## Architecture Overview

Frontend (Vercel + Next.js)
    ↓ HTTPS
Google Cloud Functions (Serverless)
    ↓ Connection Pooling
NeonDB (PostgreSQL)
    ↓ AI Services
Vertex AI + Cloud TTS

## Project Structure

althos-backend-serverless/
├── package.json
├── .env.example
├── tsconfig.json
├── sql/
│   └── init.sql                 # Database schema
├── src/
│   ├── config.ts               # Environment configuration
│   ├── db.ts                   # Database connection with pooling
│   ├── ai.ts                   # Vertex AI services
│   ├── copy.ts                 # Static content
│   ├── types.ts                # TypeScript definitions
│   ├── utils.ts                # Utility functions
│   └── functions/              # Individual Cloud Functions
│       ├── journal.ts          # Journal operations
│       ├── ai-coach.ts         # AI coaching endpoints
│       ├── tests.ts            # Mental health tests
│       ├── mood.ts             # Mood tracking
│       ├── shares.ts           # Clinician sharing
│       ├── health.ts           # Health check
│       └── index.ts            # Function exports
├── cloudbuild.yaml             # CI/CD configuration
└── README.md

## Deployment Commands

```bash
# Install dependencies
npm install

# Deploy all functions
npm run deploy

# Deploy specific function
gcloud functions deploy journal --runtime nodejs18 --trigger-http

# Local development
npm run serve
```

## Key Changes for Serverless

- **Stateless Functions**: Each endpoint is an independent Cloud Function
- **Connection Pooling**: Optimized for serverless with connection limits
- **Cold Start Optimization**: Minimal imports and lazy initialization
- **Environment Variables**: Managed through Cloud Functions configuration
- **CORS Handling**: Built into each function for Vercel frontend
- **Error Handling**: Structured for Cloud Functions runtime
