
# Althos: AI-Powered Mental Wellness Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

---

## About Althos

Althos is an AI-powered digital mental wellness platform built for Indian youth. It combines journaling, mood tracking, standardized assessments, and AI-driven insights to support emotional well-being and resilience.

### Mission
To democratize mental health support for Indian youth by providing accessible, culturally-sensitive, and AI-enhanced tools for emotional wellness, self-reflection, and professional care coordination.

### Key Highlights
- AI-powered empathetic responses and coping strategies
- Cultural sensitivity tailored for Indian youth
- Secure clinical data sharing with QR codes
- Privacy-first approach with end-to-end encryption
- Evidence-based standardized assessments (PHQ-9, GAD-7)

---

## Features

### Backend (Node.js + Express)
- RESTful API architecture
- PostgreSQL database (Neon) with optimized queries
- Google Vertex AI integration for intelligent coaching and summaries
- Secure authentication and authorization
- Mental health assessments with automated scoring
- Clinical sharing with QR codes and access tracking
- Comprehensive logging and error handling

### Frontend (Next.js 14 + React)
- App Router architecture with server-side rendering
- Responsive design using Tailwind CSS and shadcn/ui
- WCAG 2.1 accessibility compliance
- Journaling with rich text editing and mood integration
- Mood tracking with atlas visualization and trend analysis
- AI-powered weekly summaries and recommendations
- QR code generation for clinical sharing
- Progressive Web App for mobile

### AI & Analytics
- Empathetic response generation (Google Vertex AI - Gemini)
- Personalized coping strategies
- Risk assessment and crisis support
- Weekly growth summaries with metaphorical insights
- Mood pattern recognition with clustering
- Text-to-speech integration for accessibility

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v8+ (or yarn)
- PostgreSQL (Neon recommended)
- Google Cloud account with Vertex AI enabled
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Coder-philosopher/Althos-AI-for-Healing-Minds.git
cd althos
````

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
nano .env
npm run db:init
npm run build
npm run dev    # Development
npm start      # Production
```

### Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
nano .env
npm run dev    # Development
npm run build
npm start      # Production
```

### Access

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8080](http://localhost:8080)
* API Health Check: [http://localhost:8080/health](http://localhost:8080/health)

---

## Configuration

### Backend Environment Variables (.env)

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
GEMINI_MODEL=gemini-1.5-pro
TTS_VOICE=en-IN-Wavenet-A
ENABLE_AI=true
ENABLE_TTS=true
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_USER_ID=550e8400-e29b-41d4-a716-446655440000
```

---

## Project Structure

```
althos/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── db.ts
│   │   ├── ai.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── copy.ts
│   ├── sql/schema.sql
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── dashboard/
│   │   ├── share/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── docs/
├── LICENSE
└── README.md
```

---

## API Endpoints

### Authentication & User

* `POST /register`
* `GET /profile`
* `PUT /profile`

### Journaling

* `POST /journal`
* `GET /journal`
* `POST /ai/journal-coach`

### Assessments

* `POST /tests/phq9`
* `POST /tests/gad7`
* `GET /tests/insights`

### Mood Tracking

* `POST /mood/daily`
* `GET /mood/atlas`
* `GET /mood/trends`

### AI Wellness

* `POST /ai/weekly-summary`
* `POST /ai/kindness`
* `POST /ai/distress-check`

### Clinical Sharing

* `POST /shares/new`
* `GET /shares/list`
* `POST /shares/:id/revoke`
* `GET /shares/:token/summary`

---

## Testing

### Backend

```bash
cd althos-backend-v2-[statefull]
npm test
npm run test:integration
npm run test:coverage
```

### Frontend

```bash
cd althos-frontend-[Next.js]
npm test
npm run test:e2e
npm run test:a11y
```

---

## Deployment

### Backend (Google Cloud)

```bash
npm run build
gcloud functions deploy althos-backend --runtime nodejs18
gcloud run deploy althos-backend --source .
```

---

## Security & Privacy

* End-to-end encryption
* GDPR-compliant data control
* Role-based access with audit logs
* Time-limited clinical sharing
* No personally identifiable information stored
* JWT-based secure authentication

---

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Open Pull Request

Development Guidelines:

* Strict TypeScript mode
* Comprehensive tests
* Conventional commit messages
* Accessibility compliance
* Update documentation

---

## License

MIT License
Copyright (c) 2025 Althos Team

Permission is granted to use, copy, modify, and distribute this software under MIT terms.
Provided "AS IS", without warranty of any kind.

---



## Acknowledgments

* Google Cloud Vertex AI
* Neon PostgreSQL
* shadcn/ui
* Mental health professionals
* Indian youth community testers

---

Made for mental wellness
Althos - Empowering Indian youth with AI-driven mental health support


