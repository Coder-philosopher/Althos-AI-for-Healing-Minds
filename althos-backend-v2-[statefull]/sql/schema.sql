-- Users table with extended profile
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    sex VARCHAR(20),
    profession VARCHAR(255),
    hobbies TEXT[],
    locale VARCHAR(10) DEFAULT 'en-IN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journals
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT NOT NULL,
    mood_valence SMALLINT CHECK (mood_valence >= -2 AND mood_valence <= 2),
    mood_arousal REAL CHECK (mood_arousal >= 0 AND mood_arousal <= 1),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mental health tests
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('phq9', 'gad7')),
    score INTEGER NOT NULL,
    answers INTEGER[] NOT NULL,
    severity_band VARCHAR(50),
    taken_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily moods
CREATE TABLE moods_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    valence SMALLINT CHECK (valence >= -2 AND valence <= 2),
    arousal REAL CHECK (arousal >= 0 AND arousal <= 1),
    source VARCHAR(20) DEFAULT 'self',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Coping tasks
CREATE TABLE coping_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES journals(id),
    title VARCHAR(255) NOT NULL,
    steps JSONB NOT NULL,
    duration_mins INTEGER,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'skipped')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Weekly summaries
CREATE TABLE weekly_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    summary_text TEXT NOT NULL,
    audio_url TEXT,
    metaphor TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinician shares
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['summary','tests','mood'],
    window_days INTEGER DEFAULT 30,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_level VARCHAR(10) CHECK (risk_level IN ('none', 'low', 'med', 'high')),
    reasons JSONB,
    context_text TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access logs
CREATE TABLE access_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    actor VARCHAR(20) DEFAULT 'user',
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    ip_address INET,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journals_user_created ON journals(user_id, created_at DESC);
CREATE INDEX idx_tests_user_taken ON tests(user_id, taken_at DESC);
CREATE INDEX idx_moods_user_date ON moods_daily(user_id, date);
CREATE INDEX idx_shares_token ON shares(token);
CREATE INDEX idx_alerts_user_created ON alerts(user_id, created_at DESC);
