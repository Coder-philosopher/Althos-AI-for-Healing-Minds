-- Althos Database Schema
-- Run this with: psql $DATABASE_URL -f sql/init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name TEXT,
    locale TEXT DEFAULT 'en-IN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journals table
CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood_valence SMALLINT CHECK (mood_valence >= -2 AND mood_valence <= 2),
    mood_arousal REAL CHECK (mood_arousal >= 0 AND mood_arousal <= 1),
    tags TEXT[],
    pii_redacted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily moods table
CREATE TABLE IF NOT EXISTS moods_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    valence SMALLINT CHECK (valence >= -2 AND valence <= 2),
    arousal REAL CHECK (arousal >= 0 AND arousal <= 1),
    source TEXT DEFAULT 'self' CHECK (source IN ('self', 'journal', 'derived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Mental health tests table
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('phq9', 'gad7')),
    score INTEGER NOT NULL,
    answers JSONB NOT NULL,
    severity_band TEXT,
    taken_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coping tasks table
CREATE TABLE IF NOT EXISTS coping_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES journals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    steps JSONB NOT NULL,
    duration_mins INTEGER,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'skipped')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Weekly summaries table
CREATE TABLE IF NOT EXISTS weekly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    summary_text TEXT NOT NULL,
    audio_url TEXT,
    metaphor TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shares table (for clinician QR codes)
CREATE TABLE IF NOT EXISTS shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['summary','tests','mood'],
    window_days INTEGER DEFAULT 30,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table (for distress detection)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('none', 'low', 'med', 'high')),
    reasons JSONB,
    context_text TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access logs table
CREATE TABLE IF NOT EXISTS access_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor TEXT DEFAULT 'user' CHECK (actor IN ('user', 'clinician', 'system')),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    token TEXT,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kindness highlights table (for personal positives)
CREATE TABLE IF NOT EXISTS kindness_highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
    highlight_text TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_journals_user_created ON journals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tests_user_taken ON tests(user_id, taken_at DESC);
CREATE INDEX IF NOT EXISTS idx_moods_user_date ON moods_daily(user_id, date);
CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(token);
CREATE INDEX IF NOT EXISTS idx_alerts_user_created ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_created ON access_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coping_tasks_user_status ON coping_tasks(user_id, status);

-- Insert demo user for development
INSERT INTO users (id, display_name, locale) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'en-IN')
ON CONFLICT (id) DO NOTHING;

-- Sample data for testing (optional)
INSERT INTO journals (user_id, title, content, mood_valence, mood_arousal, tags) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Exam Stress', 'Feeling overwhelmed with upcoming exams. So much pressure from family and society.', -1, 0.7, ARRAY['exam', 'stress', 'family']),
('550e8400-e29b-41d4-a716-446655440000', 'Better Day', 'Had a good study session today. Feeling more confident about tomorrow.', 1, 0.3, ARRAY['study', 'confidence'])
ON CONFLICT DO NOTHING;

INSERT INTO moods_daily (user_id, date, valence, arousal, source) VALUES
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', -1, 0.7, 'journal'),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 1, 0.3, 'self')
ON CONFLICT (user_id, date) DO NOTHING;