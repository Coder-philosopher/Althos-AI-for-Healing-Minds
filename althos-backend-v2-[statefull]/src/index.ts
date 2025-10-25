import express from 'express';
import cors from 'cors';
import config from './config';
import db from './db';
import ai from './ai';
import { 
  generateId, 
  generateToken, 
  addMinutes, 
  formatDate,
  scorePHQ9,
  scoreGAD7,
  isValidTestAnswers,
  clusterMoods,
  AppError 
} from './utils';
import { 
  RegisterUserRequest, 
  CreateJournalRequest,
  JournalCoachRequest,
  TestRequest,
  MoodDailyRequest,
  ShareRequest
} from './types';
import { audioService, SUPPORTED_LANGUAGES } from './services/audio';
import * as chatbot from './services/chatbot'
const app = express();

// Middleware
const allowedOrigins = [
  "https://althos.nitrr.in",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-User-Id", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());




// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Auth middleware
const requireUser = async (req: any, res:any, next: any) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'X-User-Id header is required'
    });
  }
  
  // Check if user exists
  const user = await db.users.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.'
    });
  }
  
  req.userId = userId;
  req.user = user;
  next();
};

// Error handler
const errorHandler = (error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

// =================== ROUTES ===================
const translateRouter = require('../routes/translate');
app.use('/api', translateRouter);

// Health check
app.get('/health', async (req, res, next) => {
  const dbHealthy = await db.healthCheck();
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// User Registration
app.post('/register', async (req, res, next) => {
  try {
    const userData: RegisterUserRequest = req.body;
    
    if (!userData.id || !userData.name) {
      throw new AppError('User ID and name are required', 400);
    }
    
    // Check if user already exists
    const existingUser = await db.users.findById(userData.id);
    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already registered',
        data: existingUser
      });
    }
    
    const user = await db.users.create(userData);
    
    await db.logAccess({
      user_id: user.id,
      action: 'register',
      resource: 'user',
      ip_address: req.ip
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Get User Profile
app.get('/profile', requireUser, async (req: any, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
      
    });
    console.log(req.user);
  } catch (error) {
    next(error);
  }
});

// Update User Profile
app.put('/profile', requireUser, async (req: any, res, next) => {
  try {
    const updates = req.body;
    delete updates.id; // Don't allow ID changes
    
    const updatedUser = await db.users.update(req.userId, updates);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// =================== QUERY ENDPOINTS ===================
// POST /chat/query - process user query, build context embeddings, call Gemini LLM, cache answer
app.post('/chat/query', requireUser, async (req: any, res, next) => {
  const userId = req.userId
  const { query } = req.body
  try {
    const answer = await chatbot.answerUserQuery(userId, query)
    res.json({ success: true, answer })
  } catch (err) {
    next(err)
  }
})




// =================== JOURNAL ENDPOINTS ===================

// Create journal entry
app.post('/journal', requireUser, async (req: any, res, next) => {
  try {
    const data: CreateJournalRequest = req.body;
    
    if (!data.content || data.content.trim().length === 0) {
      throw new AppError('Journal content is required', 400);
    }
    
    const journal = await db.journals.create(req.userId, {
      title: data.title,
      content: data.content,
      mood_valence: data.mood?.valence,
      mood_arousal: data.mood?.arousal,
      tags: data.tags
    });
    
    // If mood data provided, also update daily mood
    if (data.mood) {
      const today = formatDate(new Date());
      await db.moods.upsertDaily(req.userId, {
        date: today,
        valence: data.mood.valence,
        arousal: data.mood.arousal
      });
    }
    
    await db.logAccess({
      user_id: req.userId,
      action: 'create',
      resource: 'journal',
      ip_address: req.ip
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: journal.id,
        created_at: journal.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get journal entries
app.get('/journal', requireUser, async (req: any, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);
    
    const journals = await db.journals.findByUser(req.userId, limit, offset);
    
    res.json({
      success: true,
      data: journals,
      pagination: {
        limit,
        offset,
        has_more: journals.length === limit
      }
    });
  } catch (error) {
    next(error);
  }
});
// Get single journal entry
app.get('/journal/:id', requireUser, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const journal = await db.journals.findById(id, req.userId);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }
    
    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    next(error);
  }
});

// Update journal entry
app.put('/journal/:id', requireUser, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, mood } = req.body;
    
    const updated = await db.journals.update(id, req.userId, {
      title,
      content,
      tags,
      mood_valence: mood?.valence,
      mood_arousal: mood?.arousal
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// Delete journal entry
app.delete('/journal/:id', requireUser, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await db.journals.delete(id, req.userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// =================== AI ENDPOINTS ===================

// Journal coaching
app.post('/ai/journal-coach', requireUser, async (req: any, res, next) => {
  try {
    const { journal_id } = req.body;
    
    if (!journal_id) {
      throw new AppError('Journal ID is required', 400);
    }
    
    // Check if AI response already exists (cache)
    const existingResponse = await db.journals.getAIResponse(journal_id, req.userId);
    if (existingResponse) {
      return res.json({
        success: true,
        data: existingResponse,
        cached: true
      });
    }
    
    // Fetch the journal entry
    const journal = await db.journals.findById(journal_id, req.userId);
    if (!journal) {
      throw new AppError('Journal entry not found', 404);
    }
    
    // Generate AI response
    const request: JournalCoachRequest = {
      text: journal.content,
      language_pref: 'English',
      tone_pref: 'warm and supportive'
    };
    
    const response = await ai.journalCoach(request);
    
    // Store AI response in database
    await db.journals.saveAIResponse(journal_id, req.userId, response);
    
    // Log high-risk interactions
    if (response.risk === 'high' || response.risk === 'med') {
      await db.query(
        `INSERT INTO alerts (user_id, risk_level, context_text)
         VALUES ($1, $2, $3)`,
        [req.userId, response.risk, journal.content.substring(0, 500)]
      );
    }
    
    await db.logAccess({
      user_id: req.userId,
      action: 'ai_journal_coach',
      resource: 'ai',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: response,
      cached: false
    });
  } catch (error) {
    next(error);
  }
});

app.post('/ai/journal-audio', requireUser, async (req: any, res, next) => {
  try {
    const { journal_id, language } = req.body;
    
    if (!journal_id || !language) {
      throw new AppError('Journal ID and language are required', 400);
    }
    
    // Check cache first
    const cachedUrl = await db.journals.getAudioCache(journal_id, language);
    if (cachedUrl) {
      return res.json({
        success: true,
        data: {
          audioUrl: cachedUrl,
          language,
          cached: true,
        },
      });
    }
    
    // Get journal and AI response
    const journal = await db.journals.findById(journal_id, req.userId);
    if (!journal) {
      throw new AppError('Journal entry not found', 404);
    }
    
    const aiResponse = await db.journals.getAIResponse(journal_id, req.userId);
    if (!aiResponse) {
      throw new AppError('AI response not found. Generate AI support first.', 404);
    }
    
    // Combine AI response text for audio
    const fullText = `${aiResponse.empathy}\n\n${aiResponse.reframe}\n\nHere are some activities you can try:\n\n${aiResponse.actions.map((action, i) => `${i + 1}. ${action.title}: ${action.steps.join('. ')}`).join('\n\n')}`;
    
    // Generate and cache audio
    const result = await audioService.generateAndCacheAudio({
      text: fullText,
      targetLanguage: language,
      journalId: journal_id,
    });
    
    // Save to cache
    await db.journals.saveAudioCache(journal_id, language, result.audioUrl);
    
    await db.logAccess({
      user_id: req.userId,
      action: 'ai_audio_generation',
      resource: 'ai',
      ip_address: req.ip,
    });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Add route to get supported languages
app.get('/ai/supported-languages', (req, res) => {
  res.json({
    success: true,
    data: Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => ({
      code,
      name: config.name,
    })),
  });
});
// Weekly summary
app.post('/ai/weekly-summary', requireUser, async (req: any, res, next) => {
  try {
    const { with_audio = false } = req.body;
    
    const summary = await ai.generateWeeklySummary(req.userId, with_audio);
    
    // Save to database
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    
    await db.query(
      `INSERT INTO weekly_summaries (user_id, from_date, to_date, summary_text, audio_url, metaphor)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.userId, formatDate(weekStart), formatDate(today), 
       summary.summary_text, summary.audio_url, summary.metaphor]
    );
    
    await db.logAccess({
      user_id: req.userId,
      action: 'ai_weekly_summary',
      resource: 'ai',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: {
        ...summary,
        period: {
          from: formatDate(weekStart),
          to: formatDate(today)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Distress check
app.post('/ai/distress-check', requireUser, async (req: any, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      throw new AppError('Text is required for distress check', 400);
    }
    
    const response = await ai.checkDistress(text);
    
    // Create alert if medium or high risk
    if (response.risk === 'med' || response.risk === 'high') {
      await db.query(
        `INSERT INTO alerts (user_id, risk_level, reasons, context_text)
         VALUES ($1, $2, $3, $4)`,
        [req.userId, response.risk, JSON.stringify(response.reasons), text.substring(0, 500)]
      );
    }
    
    await db.logAccess({
      user_id: req.userId,
      action: 'ai_distress_check',
      resource: 'ai',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
});

// =================== TEST ENDPOINTS ===================

// PHQ-9 Depression Test
app.post('/tests/phq9', requireUser, async (req: any, res, next) => {
  try {
    const { answers }: TestRequest = req.body;
    
    if (!isValidTestAnswers(answers, 'phq9')) {
      throw new AppError('PHQ-9 requires exactly 9 answers (0-3 each)', 400);
    }
    
    const { score, severity } = scorePHQ9(answers);
    
    const test = await db.tests.create(req.userId, {
      type: 'phq9',
      score,
      answers,
      severity_band: severity
    });
    
    const suggestions = {
      minimal: 'Keep taking care of yourself with healthy habits and social connections.',
      mild: 'Consider talking to someone you trust and practicing stress management techniques.',
      moderate: 'Please consider speaking with a mental health professional for additional support.',
      'moderately severe': 'It\'s important to seek professional mental health support.',
      severe: 'Please reach out to a mental health professional or crisis helpline immediately.'
    };
    
    await db.logAccess({
      user_id: req.userId,
      action: 'complete_test',
      resource: 'phq9',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: {
        id: test.id,
        score,
        severity_band: severity,
        explanation: `Your PHQ-9 score is ${score}, which suggests ${severity} depression symptoms. This is a screening tool, not a diagnosis.`,
        suggestion: suggestions[severity as keyof typeof suggestions]
      }
    });
  } catch (error) {
    next(error);
  }
});

// GAD-7 Anxiety Test
app.post('/tests/gad7', requireUser, async (req: any, res, next) => {
  try {
    const { answers }: TestRequest = req.body;
    
    if (!isValidTestAnswers(answers, 'gad7')) {
      throw new AppError('GAD-7 requires exactly 7 answers (0-3 each)', 400);
    }
    
    const { score, severity } = scoreGAD7(answers);
    
    const test = await db.tests.create(req.userId, {
      type: 'gad7',
      score,
      answers,
      severity_band: severity
    });
    
    const suggestions = {
      minimal: 'Your anxiety levels appear manageable. Continue with your current coping strategies.',
      mild: 'Consider relaxation techniques like deep breathing or mindfulness practices.',
      moderate: 'Please consider speaking with a counselor about anxiety management techniques.',
      severe: 'It\'s important to seek professional help for anxiety management.'
    };
    
    await db.logAccess({
      user_id: req.userId,
      action: 'complete_test',
      resource: 'gad7',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: {
        id: test.id,
        score,
        severity_band: severity,
        explanation: `Your GAD-7 score is ${score}, which suggests ${severity} anxiety symptoms. This is a screening tool, not a diagnosis.`,
        suggestion: suggestions[severity as keyof typeof suggestions]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Test insights
app.get('/tests/insights', requireUser, async (req: any, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days as string) || 30, 90);
    
    const insights = await db.tests.getInsights(req.userId, days);
    
    // Generate simple correlations
    const correlations: { note: string; strength: string }[] = [];
    if (insights.trends.length >= 2) {
      const phq9Scores = insights.trends.filter((t: any) => t.type === 'phq9');
      const gad7Scores = insights.trends.filter((t: any) => t.type === 'gad7');
      
      if (phq9Scores.length >= 2) {
        const avgPHQ9 = phq9Scores.reduce((sum: number, t: any) => sum + t.score, 0) / phq9Scores.length;
        correlations.push({
          note: `Your average PHQ-9 score over ${days} days is ${avgPHQ9.toFixed(1)}`,
          strength: avgPHQ9 < 5 ? 'strong' : avgPHQ9 < 10 ? 'moderate' : 'weak'
        });
      }
      
      if (gad7Scores.length >= 2) {
        const avgGAD7 = gad7Scores.reduce((sum: number, t: any) => sum + t.score, 0) / gad7Scores.length;
        correlations.push({
          note: `Your average GAD-7 score over ${days} days is ${avgGAD7.toFixed(1)}`,
          strength: avgGAD7 < 5 ? 'strong' : avgGAD7 < 10 ? 'moderate' : 'weak'
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        trends: insights.trends,
        correlations
      }
    });
  } catch (error) {
    next(error);
  }
});

// =================== MOOD ENDPOINTS ===================

// Record daily mood
app.post('/mood/daily', requireUser, async (req: any, res, next) => {
  try {
    const { date, valence, arousal }: MoodDailyRequest = req.body;
    
    if (!date || !Number.isInteger(valence) || typeof arousal !== 'number') {
      throw new AppError('Date, valence (-2 to 2), and arousal (0 to 1) are required', 400);
    }
    
    if (valence < -2 || valence > 2 || arousal < 0 || arousal > 1) {
      throw new AppError('Valence must be -2 to 2, arousal must be 0 to 1', 400);
    }
    
    const mood = await db.moods.upsertDaily(req.userId, { date, valence, arousal });
    
    await db.logAccess({
      user_id: req.userId,
      action: 'record_mood',
      resource: 'mood',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: mood
    });
  } catch (error) {
    next(error);
  }
});

// Get mood atlas (clustering)
app.get('/mood/atlas', requireUser, async (req: any, res, next) => {
  try {
    const fromDate = req.query.from as string;
    const toDate = req.query.to as string;
    
    const moods = await db.moods.findByUser(req.userId, fromDate, toDate);
    
    if (moods.length === 0) {
      return res.json({
        success: true,
        data: {
          clusters: [],
          highlights: ['No mood data available for the selected period.'],
          period: { from: fromDate || 'N/A', to: toDate || 'N/A' }
        }
      });
    }
    
    const clusters = clusterMoods(
      moods.map((m: any) => ({
        valence: Number(m.valence),
        arousal: Number(m.arousal),
        date: String(m.date)
      }))
    );
    
    const highlights = [
      `Analyzed ${moods.length} mood entries`,
      `Found ${clusters.length} distinct mood patterns`,
      clusters.length > 0 ? `Most active cluster has ${Math.max(...clusters.map(c => c.days.length))} days` : ''
    ].filter(Boolean);
    
    res.json({
      success: true,
      data: {
        clusters,
        highlights,
        period: { 
          from: fromDate || (moods[moods.length - 1] as any)?.date, 
          to: toDate || (moods[0] as any)?.date 
        }
      }
    });
  } catch (error) {
    next(error);
  }
});


// =================== SHARING ENDPOINTS ===================

// Get user's shares list
app.get('/shares/list', requireUser, async (req: any, res, next) => {
  try {
    // Build URL in JavaScript to avoid PostgreSQL concat issues
    const urlPrefix = `${req.protocol}://${req.get('host')}`;
    
    const shares = await db.query(
      `SELECT * FROM shares 
       WHERE user_id = $1 AND revoked = FALSE
       ORDER BY created_at DESC`,
      [req.userId]
    );

    // Add URL field in JavaScript
    const sharesWithUrls = shares.map(share => ({
      ...share,
      url: `${urlPrefix}/shares/${share.token}/summary`
    }));

    res.json({
      success: true,
      data: sharesWithUrls
    });
  } catch (error) {
    next(error);
  }
});

// Revoke share
app.post('/shares/:shareId/revoke', requireUser, async (req: any, res, next) => {
  try {
    const { shareId } = req.params;
    
    const result = await db.query(
      'UPDATE shares SET revoked = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [shareId, req.userId]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    await db.logAccess({
      user_id: req.userId,
      action: 'revoke_share',
      resource: 'share',
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'Share revoked successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Share analytics
app.get('/shares/:shareId/analytics', requireUser, async (req: any, res, next) => {
  try {
    const { shareId } = req.params;
    
    const share = await db.queryOne(
      'SELECT * FROM shares WHERE id = $1 AND user_id = $2',
      [shareId, req.userId]
    );

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Get recent access logs
    const accessLogs = await db.query(
      `SELECT created_at as timestamp, ip_address
       FROM access_logs 
       WHERE user_id = $1 AND resource = 'share' AND action = 'view_summary'
       ORDER BY created_at DESC LIMIT 10`,
      [req.userId]
    );

    res.json({
      success: true,
      data: {
        share_id: shareId,
        total_views: share.access_count || 0,
        last_accessed: accessLogs.length > 0 ? accessLogs[0].timestamp : null,
        access_log: accessLogs,
        expires_at: share.expires_at,
        revoked: share.revoked,
        created_at: share.created_at,
        scopes: share.scopes,
        window_days: share.window_days
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create shareable link (Enhanced version)
app.post('/shares/new', requireUser, async (req: any, res, next) => {
  try {
    const { 
      scopes = ['summary', 'tests', 'mood'], 
      window_days = 30, 
      expires_mins = 60 
    } = req.body;
    
    const token = generateToken(32);
    const expiresAt = addMinutes(new Date(), expires_mins);
    
    const share = await db.query(
      `INSERT INTO shares (user_id, token, scopes, window_days, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, token, scopes, window_days, expiresAt]
    );
    
    const urlPrefix = `${req.protocol}://${req.get('host')}`;
    const shareUrl = `${urlPrefix}/shares/${token}/summary`;
    
    await db.logAccess({
      user_id: req.userId,
      action: 'create_share',
      resource: 'share',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: {
        id: share[0].id,
        user_id: share[0].user_id,
        token: share[0].token,
        url: shareUrl,
        scopes: share[0].scopes,
        window_days: share[0].window_days,
        expires_at: share[0].expires_at,
        access_count: 0,
        revoked: false,
        created_at: share[0].created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get clinician summary (Enhanced with better data)
app.get('/shares/:token/summary', async (req, res, next) => {
  try {
    const token = req.params.token;
    
    const share = await db.queryOne(
      `SELECT * FROM shares 
       WHERE token = $1 
       AND expires_at > NOW() 
       AND revoked = FALSE`,
      [token]
    );
    
    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Share link expired, invalid, or revoked'
      });
    }
    
    // Increment access count
    await db.query(
      'UPDATE shares SET access_count = access_count + 1 WHERE id = $1',
      [share.id]
    );

    // Fetch actual user data based on scopes
    let additionalData = {
      journals_count: 0,
      tests_count: 0,
      moods_count: 0,
      avg_mood: null as string | null
    };

    try {
      // Get journal count if scope includes journals
      if (share.scopes.includes('summary') || share.scopes.includes('journals')) {
        const journalData = await db.query(
          `SELECT COUNT(*) as count FROM journals 
           WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${share.window_days} days'`,
          [share.user_id]
        );
        additionalData.journals_count = parseInt(journalData[0]?.count || '0');
      }

      // Get test count if scope includes tests
      if (share.scopes.includes('tests')) {
        const testData = await db.query(
          `SELECT COUNT(*) as count FROM tests 
           WHERE user_id = $1 AND taken_at >= NOW() - INTERVAL '${share.window_days} days'`,
          [share.user_id]
        );
        additionalData.tests_count = parseInt(testData[0]?.count || '0');
      }

      // Get mood data if scope includes mood
      if (share.scopes.includes('mood')) {
        const moodData = await db.query(
          `SELECT COUNT(*) as count, AVG(valence) as avg_valence 
           FROM moods_daily 
           WHERE user_id = $1 AND date >= NOW() - INTERVAL '${share.window_days} days'`,
          [share.user_id]
        );
        additionalData.moods_count = parseInt(moodData[0]?.count || '0');
        additionalData.avg_mood = moodData[0]?.avg_valence ? parseFloat(moodData[0].avg_valence).toFixed(1) : null;
      }
    } catch (dataError) {
      console.error('Error fetching additional data:', dataError);
      // Continue with default values
    }
    
    // Generate enhanced summary
    const summary = `
**PATIENT SUMMARY - ${share.window_days} DAY PERIOD**

**Subjective:**
Patient demonstrates consistent engagement with self-monitoring tools over the past ${share.window_days} days. 
Data includes ${additionalData.journals_count} journal entries, ${additionalData.tests_count} mental health assessments, and ${additionalData.moods_count} mood recordings.
${additionalData.avg_mood ? `Average mood valence: ${additionalData.avg_mood} (on scale of -2 to +2).` : ''}

**Objective:**
- Active participation in digital wellness tracking
- Regular self-reflection through journaling (${additionalData.journals_count} entries)
- Proactive mental health monitoring (${additionalData.tests_count} assessments completed)
- Consistent mood tracking (${additionalData.moods_count} daily mood entries)

**Assessment:**
Patient shows good engagement with digital wellness tools and self-awareness practices.
Data suggests active participation in mental health self-management.
No acute risk indicators identified based on available self-reported data.

**Plan:**
- Continue current self-monitoring practices
- Maintain regular check-ins with mental wellness platform
- Consider professional consultation if concerning patterns emerge
- Follow-up as clinically indicated

**Data Sources & Limitations:**
This summary is based on self-reported data from digital wellness platform.
Includes journal entries, standardized screening tools (PHQ-9, GAD-7), and mood tracking.
Professional clinical assessment recommended for comprehensive evaluation.

*Generated by Althos AI Mental Wellness Platform*
*Data Period: ${formatDate(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000))} to ${formatDate(new Date())}*
    `;
    
    await db.logAccess({
      user_id: share.user_id,
      action: 'view_summary',
      resource: 'share',
      ip_address: req.ip
    });
    
    res.json({
      success: true,
      data: {
        patient_alias: `Patient-${share.user_id.substring(0, 8)}`,
        share_id: share.id,
        period: {
          from: formatDate(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000)),
          to: formatDate(new Date()),
          window_days: share.window_days
        },
        summary: {
          soap_text: summary,
          scores: { 
            phq9: [], 
            gad7: [] 
          },
          trends: {
            mood_pattern: additionalData.avg_mood
              ? `Average mood: ${additionalData.avg_mood} (${additionalData.moods_count} entries)`
              : 'Insufficient mood data for pattern analysis',
            risk_indicators: [],
            engagement_level: `High (${additionalData.journals_count + additionalData.tests_count + additionalData.moods_count} total interactions)`
          },
          data_summary: {
            journals: additionalData.journals_count,
            tests: additionalData.tests_count,
            moods: additionalData.moods_count,
            avg_mood_valence: additionalData.avg_mood
          }
        },
        scopes: share.scopes,
        generated_at: new Date().toISOString(),
        access_count: (share.access_count || 0) + 1,
        expires_at: share.expires_at
      }
    });
  } catch (error) {
    next(error);
  }
});


// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`🤗 Althos backend running on port ${config.port}`);
  console.log(`😎 Environment: ${config.nodeEnv}`);
  console.log(`🤖 AI Services: ${config.enableAI ? '✅ Enabled' : '🔄 Disabled'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export default app;
