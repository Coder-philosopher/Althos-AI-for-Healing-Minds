
# Althos API Endpoints

**Base URL:** `http://localhost:8080`

---

## Authentication

All endpoints except `/health`, `/register`, and `/shares/:token/summary` require:

- Header:

X-User-Id: `user-uuid`

---

## Health & Registration

### `GET /health`

**Description:** Health check and database connectivity  
**Response:**
{ "success": true, "database": "connected", "version": "1.0.0" }

### `POST /register`

**Description:** Register a new user
**Body:**

```json
{ "id": "string", "name": "string", "age": 0, "sex": "string", "profession": "string", "hobbies": ["string"] }
```

**Response:**

```json
{ "success": true, "data": { /* User */ } }
```

### `GET /profile`

**Description:** Get user profile
**Response:**

```json
{ "success": true, "data": { /* User */ } }
```

### `PUT /profile`

**Description:** Update user profile
**Body:**

```json
{ "name": "string", "age": 0, "sex": "string", "profession": "string", "hobbies": ["string"] }
```

**Response:**

```json
{ "success": true, "data": { /* User */ } }
```

---

## Journaling

### `POST /journal`

**Description:** Create journal entry
**Body:**

```json
{ "title": "string", "content": "string", "mood": { "valence": 0, "arousal": 0 }, "tags": ["string"] }
```

**Response:**

```json
{ "success": true, "data": { "id": "string", "created_at": "Date" } }
```

### `GET /journal?limit=20&offset=0`

**Description:** List journal entries
**Response:**

```json
{ "success": true, "data": [ /* Journal */ ], "pagination": { /* ... */ } }
```

---

## AI Services

### `POST /ai/journal-coach`

**Description:** Get empathetic response + coping actions
**Body:**

```json
{ "text": "string", "language_pref": "string", "tone_pref": "string" }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "empathy": "string",
    "reframe": "string",
    "actions": [ /* Action */ ],
    "risk": "string"
  }
}
```

### `POST /ai/weekly-summary`

**Description:** Generate weekly growth summary
**Body:**

```json
{ "with_audio": true }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "summary_text": "string",
    "audio_url": "string",
    "metaphor": "string"
  }
}
```

### `POST /ai/distress-check`

**Description:** Check for distress signals
**Body:**

```json
{ "text": "string" }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "risk": "string",
    "reasons": ["string"],
    "helplines": [ /* Helpline */ ],
    "suggest_next_step": "string"
  }
}
```

---

## Mental Health Tests

### `POST /tests/phq9`

**Description:** Submit PHQ-9 depression screening
**Body:**

```json
{ "answers": [0,0,0,0,0,0,0,0,0] }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "score": 0,
    "severity_band": "string",
    "explanation": "string",
    "suggestion": "string"
  }
}
```

### `POST /tests/gad7`

**Description:** Submit GAD-7 anxiety screening
**Body:**

```json
{ "answers": [0,0,0,0,0,0,0] }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "score": 0,
    "severity_band": "string",
    "explanation": "string",
    "suggestion": "string"
  }
}
```

### `GET /tests/insights?days=30`

**Description:** Get test trends and correlations
**Response:**

```json
{
  "success": true,
  "data": {
    "trends": [ /* Trend */ ],
    "correlations": [ /* Correlation */ ]
  }
}
```

---

## Mood Tracking

### `POST /mood/daily`

**Description:** Record daily mood
**Body:**

```json
{ "date": "YYYY-MM-DD", "valence": 0, "arousal": 0 }
```

**Response:**

```json
{ "success": true, "data": { /* MoodEntry */ } }
```

### `GET /mood/atlas?from=YYYY-MM-DD&to=YYYY-MM-DD`

**Description:** Get mood clustering visualization
**Response:**

```json
{
  "success": true,
  "data": {
    "clusters": [ /* Cluster */ ],
    "highlights": ["string"],
    "period": { /* ... */ }
  }
}
```

---

## Clinician Sharing

### `POST /shares/new`

**Description:** Create shareable link for clinicians
**Body:**

```json
{ "scopes": ["string"], "window_days": 0, "expires_mins": 0 }
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "token": "string",
    "url": "string",
    "expires_at": "Date"
  }
}
```

### `GET /shares/:token/summary`

**Description:** Get clinical summary (public endpoint)
**Response:**

```json
{
  "success": true,
  "data": {
    "patient_alias": "string",
    "summary": { /* ... */ },
    "access_count": 0
  }
}
```
