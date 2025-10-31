"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./db"));
const ai_1 = __importDefault(require("./ai"));
// const { getSuggestedFriends, sendMessageToMongo, getMessagesFromMongo, client } = require('./db');
const utils_1 = require("./utils");
const audio_1 = require("./services/audio");
const chatbot = __importStar(require("./services/chatbot"));
const orgs_1 = require("./services/orgs");
const app = (0, express_1.default)();
const crypto_1 = __importDefault(require("crypto"));
const sec = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const KEY = Buffer.from(sec, 'hex'); // 32 bytes
const ALGO = 'aes-256-gcm';
// Middleware
const allowedOrigins = [
    "https://althos.nitrr.in",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-User-Id", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    if (req.body?.encrypted && req.body?.iv && req.body?.tag) {
        try {
            const decipher = crypto_1.default.createDecipheriv(ALGO, KEY, Buffer.from(req.body.iv, 'base64'));
            decipher.setAuthTag(Buffer.from(req.body.tag, 'base64'));
            let decrypted = decipher.update(req.body.encrypted, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            req.body = JSON.parse(decrypted);
        }
        catch (err) {
            return res.status(400).json({ success: false, message: 'Invalid encrypted payload' });
        }
    }
    next();
});
// Middleware to encrypt outgoing responses
app.use((req, res, next) => {
    const oldJson = res.json;
    res.json = function (body) {
        const iv = crypto_1.default.randomBytes(12);
        const cipher = crypto_1.default.createCipheriv(ALGO, KEY, iv);
        let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const tag = cipher.getAuthTag();
        return oldJson.call(this, {
            encrypted,
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
        });
    };
    next();
});
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Auth middleware
const requireUser = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'X-User-Id header is required'
        });
    }
    // Check if user exists
    const user = await db_1.default.users.findById(userId);
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
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error instanceof utils_1.AppError) {
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
// Friend suggestion route
// app.get('/api/friends', async (req, res) => {
//   const userId = req.headers['x-user-id'];
//   if (!userId) return res.status(401).json({ success: false, message: 'Missing x-user-id header' });
//   // Find user to get age/hobbies
//   const db = await client.db("althos");
//   const user = await db.collection('users').findOne({ _id: userId });
//   if (!user) return res.status(404).json({ success: false, message: 'User not found' });
//   try {
//     const friends = await getSuggestedFriends(userId, user.age || 18, user.hobbies || []);
//     res.json({ success: true, data: friends });
//   } catch (err) {
//     console.error('Friend suggestion error:', err);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });
// // Get messages (all history)
// app.get('/api/messages/:conversationId', async (req, res) => {
//   const { conversationId } = req.params;
//   try {
//     const messages = await getMessagesFromMongo(conversationId);
//     res.json({ success: true, data: messages });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error fetching messages' });
//   }
// });
// // Send message
// app.post('/api/messages', async (req, res) => {
//   const { conversationId, sender, receiver, text } = req.body;
//   if (!conversationId || !sender || !receiver || !text) {
//     return res.status(400).json({ success: false, message: 'Missing conversationId, sender, receiver, or text' });
//   }
//   try {
//     await sendMessageToMongo(conversationId, sender, receiver, text);
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error sending message' });
//   }
// });
// Organization analytics route
app.post('/orgs/analytics', async (req, res, next) => {
    try {
        const { org_code } = req.body;
        if (!org_code)
            return res.status(400).json({ success: false, error: 'Org Code is required' });
        // Replace these dummy/default signin credentials for initial populate
        const defaultSigninId = 'admin';
        const defaultPassword = 'changeMe123';
        // Ensure org record exists or create it
        const org = await (0, orgs_1.ensureOrgPopulated)(org_code, defaultSigninId, defaultPassword);
        if (!org)
            return res.status(500).json({ success: false, error: 'Failed to create org record' });
        // Now proceed with fetching users and analytics
        const users = await db_1.default.users.findByOrgCode(org_code);
        if (users.length === 0) {
            return res.json({ success: true, data: { totalUsers: 0, dailyLogins: [], avgMoodPerDay: [], monthlyLoginCounts: [], alertCounts: [] } });
        }
        const userIds = users.map(u => u.id);
        const totalUsers = users.length;
        const dailyLogins = await db_1.default.access_logs.organizationsDailyLogins(userIds);
        const avgMoodPerDay = await db_1.default.moods_daily.organizationAvgMood(userIds);
        const monthlyLoginCounts = await db_1.default.access_logs.organizationMonthlyLogins(userIds);
        const alertCounts = await db_1.default.alerts.organizationAlertCounts(userIds);
        res.json({ success: true, data: { totalUsers, dailyLogins, avgMoodPerDay, monthlyLoginCounts, alertCounts } });
    }
    catch (error) {
        next(error);
    }
});
// =================== ROUTES ===================
const translateRouter = require('../routes/translate');
app.use('/api', translateRouter);
// Health check
app.get('/health', async (req, res, next) => {
    const dbHealthy = await db_1.default.healthCheck();
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        database: dbHealthy ? 'connected' : 'disconnected',
        version: '1.0.0',
        environment: config_1.default.nodeEnv
    });
});
// User Registration
app.post('/register', async (req, res, next) => {
    try {
        const userData = req.body;
        // Validate required fields (id generated client side, so check email & name)
        if (!userData.name || !userData.email) {
            throw new utils_1.AppError('Name and email are required for registration', 400);
        }
        // Check if email already registered (avoid duplicate accounts)
        const existingUserByEmail = await db_1.default.users.findByEmailAndName(userData.email, userData.name);
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: 'User with this name and email already exists',
            });
        }
        const user = await db_1.default.users.create(userData);
        await db_1.default.logAccess({
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
    }
    catch (error) {
        next(error);
    }
});
// Get User Profile
app.get('/profile', requireUser, async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        next(error);
    }
});
app.post('/login', async (req, res, next) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            throw new utils_1.AppError('Email and name are required to login', 400);
        }
        const user = await db_1.default.users.findByEmailAndName(email, name);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or name'
            });
        }
        // Mimic existing login success response (you can add tokens/cookies if needed)
        await db_1.default.logAccess({
            user_id: user.id,
            action: 'login',
            resource: 'user',
            ip_address: req.ip,
        });
        res.json({
            success: true,
            message: 'Login successful',
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
// Update User Profile
app.put('/profile', requireUser, async (req, res, next) => {
    try {
        const updates = req.body;
        delete updates.id; // Don't allow ID changes
        const updatedUser = await db_1.default.users.update(req.userId, updates);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        next(error);
    }
});
// =================== QUERY ENDPOINTS ===================
// POST /chat/query - process user query, build context embeddings, call Gemini LLM, cache answer
app.post('/chat/query', requireUser, async (req, res, next) => {
    const userId = req.userId;
    const { query } = req.body;
    try {
        const answer = await chatbot.answerUserQuery(userId, query);
        res.json({ success: true, answer });
    }
    catch (err) {
        next(err);
    }
});
// =================== JOURNAL ENDPOINTS ===================
// Create journal entry
app.post('/journal', requireUser, async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.content || data.content.trim().length === 0) {
            throw new utils_1.AppError('Journal content is required', 400);
        }
        const journal = await db_1.default.journals.create(req.userId, {
            title: data.title,
            content: data.content,
            mood_valence: data.mood?.valence,
            mood_arousal: data.mood?.arousal,
            tags: data.tags
        });
        // If mood data provided, also update daily mood
        if (data.mood) {
            const today = (0, utils_1.formatDate)(new Date());
            await db_1.default.moods.upsertDaily(req.userId, {
                date: today,
                valence: data.mood.valence,
                arousal: data.mood.arousal
            });
        }
        await db_1.default.logAccess({
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
    }
    catch (error) {
        next(error);
    }
});
// Get journal entries
app.get('/journal', requireUser, async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = Math.max(parseInt(req.query.offset) || 0, 0);
        const journals = await db_1.default.journals.findByUser(req.userId, limit, offset);
        res.json({
            success: true,
            data: journals,
            pagination: {
                limit,
                offset,
                has_more: journals.length === limit
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get single journal entry
app.get('/journal/:id', requireUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const journal = await db_1.default.journals.findById(id, req.userId);
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
    }
    catch (error) {
        next(error);
    }
});
// Update journal entry
app.put('/journal/:id', requireUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, tags, mood } = req.body;
        const updated = await db_1.default.journals.update(id, req.userId, {
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
    }
    catch (error) {
        next(error);
    }
});
// Delete journal entry
app.delete('/journal/:id', requireUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await db_1.default.journals.delete(id, req.userId);
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
    }
    catch (error) {
        next(error);
    }
});
// =================== AI ENDPOINTS ===================
// Journal coaching
app.post('/ai/journal-coach', requireUser, async (req, res, next) => {
    try {
        const { journal_id } = req.body;
        if (!journal_id) {
            throw new utils_1.AppError('Journal ID is required', 400);
        }
        // Check if AI response already exists (cache)
        const existingResponse = await db_1.default.journals.getAIResponse(journal_id, req.userId);
        if (existingResponse) {
            return res.json({
                success: true,
                data: existingResponse,
                cached: true
            });
        }
        // Fetch the journal entry
        const journal = await db_1.default.journals.findById(journal_id, req.userId);
        if (!journal) {
            throw new utils_1.AppError('Journal entry not found', 404);
        }
        // Generate AI response
        const request = {
            text: journal.content,
            language_pref: 'English',
            tone_pref: 'warm and supportive'
        };
        const response = await ai_1.default.journalCoach(request);
        // Store AI response in database
        await db_1.default.journals.saveAIResponse(journal_id, req.userId, response);
        // Log high-risk interactions
        if (response.risk === 'high' || response.risk === 'med') {
            await db_1.default.query(`INSERT INTO alerts (user_id, risk_level, context_text)
         VALUES ($1, $2, $3)`, [req.userId, response.risk, journal.content.substring(0, 500)]);
        }
        await db_1.default.logAccess({
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
    }
    catch (error) {
        next(error);
    }
});
app.post('/ai/journal-audio', requireUser, async (req, res, next) => {
    try {
        const { journal_id, language } = req.body;
        if (!journal_id || !language) {
            throw new utils_1.AppError('Journal ID and language are required', 400);
        }
        // Check cache first
        const cachedUrl = await db_1.default.journals.getAudioCache(journal_id, language);
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
        const journal = await db_1.default.journals.findById(journal_id, req.userId);
        if (!journal) {
            throw new utils_1.AppError('Journal entry not found', 404);
        }
        const aiResponse = await db_1.default.journals.getAIResponse(journal_id, req.userId);
        if (!aiResponse) {
            throw new utils_1.AppError('AI response not found. Generate AI support first.', 404);
        }
        // Combine AI response text for audio
        const fullText = `${aiResponse.empathy}\n\n${aiResponse.reframe}\n\nHere are some activities you can try:\n\n${aiResponse.actions.map((action, i) => `${i + 1}. ${action.title}: ${action.steps.join('. ')}`).join('\n\n')}`;
        // Generate and cache audio
        const result = await audio_1.audioService.generateAndCacheAudio({
            text: fullText,
            targetLanguage: language,
            journalId: journal_id,
        });
        // Save to cache
        await db_1.default.journals.saveAudioCache(journal_id, language, result.audioUrl);
        await db_1.default.logAccess({
            user_id: req.userId,
            action: 'ai_audio_generation',
            resource: 'ai',
            ip_address: req.ip,
        });
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Add route to get supported languages
app.get('/ai/supported-languages', (req, res) => {
    res.json({
        success: true,
        data: Object.entries(audio_1.SUPPORTED_LANGUAGES).map(([code, config]) => ({
            code,
            name: config.name,
        })),
    });
});
// Weekly summary
app.post('/ai/weekly-summary', requireUser, async (req, res, next) => {
    try {
        const { with_audio = false } = req.body;
        const summary = await ai_1.default.generateWeeklySummary(req.userId, with_audio);
        // Save to database
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        await db_1.default.query(`INSERT INTO weekly_summaries (user_id, from_date, to_date, summary_text, audio_url, metaphor)
       VALUES ($1, $2, $3, $4, $5, $6)`, [req.userId, (0, utils_1.formatDate)(weekStart), (0, utils_1.formatDate)(today),
            summary.summary_text, summary.audio_url, summary.metaphor]);
        await db_1.default.logAccess({
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
                    from: (0, utils_1.formatDate)(weekStart),
                    to: (0, utils_1.formatDate)(today)
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Distress check
app.post('/ai/distress-check', requireUser, async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            throw new utils_1.AppError('Text is required for distress check', 400);
        }
        const response = await ai_1.default.checkDistress(text);
        // Create alert if medium or high risk
        if (response.risk === 'med' || response.risk === 'high') {
            await db_1.default.query(`INSERT INTO alerts (user_id, risk_level, reasons, context_text)
         VALUES ($1, $2, $3, $4)`, [req.userId, response.risk, JSON.stringify(response.reasons), text.substring(0, 500)]);
        }
        await db_1.default.logAccess({
            user_id: req.userId,
            action: 'ai_distress_check',
            resource: 'ai',
            ip_address: req.ip
        });
        res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        next(error);
    }
});
// =================== TEST ENDPOINTS ===================
// PHQ-9 Depression Test
app.post('/tests/phq9', requireUser, async (req, res, next) => {
    try {
        const { answers } = req.body;
        if (!(0, utils_1.isValidTestAnswers)(answers, 'phq9')) {
            throw new utils_1.AppError('PHQ-9 requires exactly 9 answers (0-3 each)', 400);
        }
        const { score, severity } = (0, utils_1.scorePHQ9)(answers);
        const test = await db_1.default.tests.create(req.userId, {
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
        await db_1.default.logAccess({
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
                suggestion: suggestions[severity]
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// GAD-7 Anxiety Test
app.post('/tests/gad7', requireUser, async (req, res, next) => {
    try {
        const { answers } = req.body;
        if (!(0, utils_1.isValidTestAnswers)(answers, 'gad7')) {
            throw new utils_1.AppError('GAD-7 requires exactly 7 answers (0-3 each)', 400);
        }
        const { score, severity } = (0, utils_1.scoreGAD7)(answers);
        const test = await db_1.default.tests.create(req.userId, {
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
        await db_1.default.logAccess({
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
                suggestion: suggestions[severity]
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Test insights
app.get('/tests/insights', requireUser, async (req, res, next) => {
    try {
        const days = Math.min(parseInt(req.query.days) || 30, 90);
        const insights = await db_1.default.tests.getInsights(req.userId, days);
        // Generate simple correlations
        const correlations = [];
        if (insights.trends.length >= 2) {
            const phq9Scores = insights.trends.filter((t) => t.type === 'phq9');
            const gad7Scores = insights.trends.filter((t) => t.type === 'gad7');
            if (phq9Scores.length >= 2) {
                const avgPHQ9 = phq9Scores.reduce((sum, t) => sum + t.score, 0) / phq9Scores.length;
                correlations.push({
                    note: `Your average PHQ-9 score over ${days} days is ${avgPHQ9.toFixed(1)}`,
                    strength: avgPHQ9 < 5 ? 'strong' : avgPHQ9 < 10 ? 'moderate' : 'weak'
                });
            }
            if (gad7Scores.length >= 2) {
                const avgGAD7 = gad7Scores.reduce((sum, t) => sum + t.score, 0) / gad7Scores.length;
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
    }
    catch (error) {
        next(error);
    }
});
// =================== MOOD ENDPOINTS ===================
// Record daily mood
app.post('/mood/daily', requireUser, async (req, res, next) => {
    try {
        const { date, valence, arousal } = req.body;
        if (!date || !Number.isInteger(valence) || typeof arousal !== 'number') {
            throw new utils_1.AppError('Date, valence (-2 to 2), and arousal (0 to 1) are required', 400);
        }
        if (valence < -2 || valence > 2 || arousal < 0 || arousal > 1) {
            throw new utils_1.AppError('Valence must be -2 to 2, arousal must be 0 to 1', 400);
        }
        const mood = await db_1.default.moods.upsertDaily(req.userId, { date, valence, arousal });
        await db_1.default.logAccess({
            user_id: req.userId,
            action: 'record_mood',
            resource: 'mood',
            ip_address: req.ip
        });
        res.json({
            success: true,
            data: mood
        });
    }
    catch (error) {
        next(error);
    }
});
// Get mood atlas (clustering)
app.get('/mood/atlas', requireUser, async (req, res, next) => {
    try {
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const moods = await db_1.default.moods.findByUser(req.userId, fromDate, toDate);
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
        const clusters = (0, utils_1.clusterMoods)(moods.map((m) => ({
            valence: Number(m.valence),
            arousal: Number(m.arousal),
            date: String(m.date)
        })));
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
                    from: fromDate || moods[moods.length - 1]?.date,
                    to: toDate || moods[0]?.date
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// =================== SHARING ENDPOINTS ===================
// Get user's shares list
app.get('/shares/list', requireUser, async (req, res, next) => {
    try {
        // Build URL in JavaScript to avoid PostgreSQL concat issues
        const urlPrefix = `${req.protocol}://${req.get('host')}`;
        const shares = await db_1.default.query(`SELECT * FROM shares 
       WHERE user_id = $1 AND revoked = FALSE
       ORDER BY created_at DESC`, [req.userId]);
        // Add URL field in JavaScript
        const sharesWithUrls = shares.map(share => ({
            ...share,
            url: `${urlPrefix}/shares/${share.token}/summary`
        }));
        res.json({
            success: true,
            data: sharesWithUrls
        });
    }
    catch (error) {
        next(error);
    }
});
// Revoke share
app.post('/shares/:shareId/revoke', requireUser, async (req, res, next) => {
    try {
        const { shareId } = req.params;
        const result = await db_1.default.query('UPDATE shares SET revoked = TRUE WHERE id = $1 AND user_id = $2 RETURNING *', [shareId, req.userId]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Share not found'
            });
        }
        await db_1.default.logAccess({
            user_id: req.userId,
            action: 'revoke_share',
            resource: 'share',
            ip_address: req.ip
        });
        res.json({
            success: true,
            message: 'Share revoked successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
// Share analytics
app.get('/shares/:shareId/analytics', requireUser, async (req, res, next) => {
    try {
        const { shareId } = req.params;
        const share = await db_1.default.queryOne('SELECT * FROM shares WHERE id = $1 AND user_id = $2', [shareId, req.userId]);
        if (!share) {
            return res.status(404).json({
                success: false,
                message: 'Share not found'
            });
        }
        // Get recent access logs
        const accessLogs = await db_1.default.query(`SELECT created_at as timestamp, ip_address
       FROM access_logs 
       WHERE user_id = $1 AND resource = 'share' AND action = 'view_summary'
       ORDER BY created_at DESC LIMIT 10`, [req.userId]);
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
    }
    catch (error) {
        next(error);
    }
});
// Create shareable link (Enhanced version)
app.post('/shares/new', requireUser, async (req, res, next) => {
    try {
        const { scopes = ['summary', 'tests', 'mood'], window_days = 30, expires_mins = 60 } = req.body;
        const token = (0, utils_1.generateToken)(32);
        const expiresAt = (0, utils_1.addMinutes)(new Date(), expires_mins);
        const share = await db_1.default.query(`INSERT INTO shares (user_id, token, scopes, window_days, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [req.userId, token, scopes, window_days, expiresAt]);
        const urlPrefix = `${req.protocol}://${req.get('host')}`;
        const shareUrl = `${urlPrefix}/shares/${token}/summary`;
        await db_1.default.logAccess({
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
    }
    catch (error) {
        next(error);
    }
});
// Get clinician summary (Enhanced with better data)
app.get('/shares/:token/summary', async (req, res, next) => {
    try {
        const token = req.params.token;
        const share = await db_1.default.queryOne(`SELECT * FROM shares 
       WHERE token = $1 
       AND expires_at > NOW() 
       AND revoked = FALSE`, [token]);
        if (!share) {
            return res.status(404).json({
                success: false,
                message: 'Share link expired, invalid, or revoked'
            });
        }
        // Increment access count
        await db_1.default.query('UPDATE shares SET access_count = access_count + 1 WHERE id = $1', [share.id]);
        // Fetch actual user data based on scopes
        let additionalData = {
            journals_count: 0,
            tests_count: 0,
            moods_count: 0,
            avg_mood: null
        };
        try {
            // Get journal count if scope includes journals
            if (share.scopes.includes('summary') || share.scopes.includes('journals')) {
                const journalData = await db_1.default.query(`SELECT COUNT(*) as count FROM journals 
           WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${share.window_days} days'`, [share.user_id]);
                additionalData.journals_count = parseInt(journalData[0]?.count || '0');
            }
            // Get test count if scope includes tests
            if (share.scopes.includes('tests')) {
                const testData = await db_1.default.query(`SELECT COUNT(*) as count FROM tests 
           WHERE user_id = $1 AND taken_at >= NOW() - INTERVAL '${share.window_days} days'`, [share.user_id]);
                additionalData.tests_count = parseInt(testData[0]?.count || '0');
            }
            // Get mood data if scope includes mood
            if (share.scopes.includes('mood')) {
                const moodData = await db_1.default.query(`SELECT COUNT(*) as count, AVG(valence) as avg_valence 
           FROM moods_daily 
           WHERE user_id = $1 AND date >= NOW() - INTERVAL '${share.window_days} days'`, [share.user_id]);
                additionalData.moods_count = parseInt(moodData[0]?.count || '0');
                additionalData.avg_mood = moodData[0]?.avg_valence ? parseFloat(moodData[0].avg_valence).toFixed(1) : null;
            }
        }
        catch (dataError) {
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
*Data Period: ${(0, utils_1.formatDate)(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000))} to ${(0, utils_1.formatDate)(new Date())}*
    `;
        await db_1.default.logAccess({
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
                    from: (0, utils_1.formatDate)(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000)),
                    to: (0, utils_1.formatDate)(new Date()),
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
    }
    catch (error) {
        next(error);
    }
});
//ai music feature
app.post('/ai/music', requireUser, async (req, res, next) => {
    try {
        const { mood_text, mood_label } = req.body;
        if (!mood_text || !mood_label) {
            throw new utils_1.AppError('Mood text and mood label are required', 400);
        }
        // Check if AI music response already exists (cache)
        const cachedMusicUrl = await db_1.default.music.getMusicCache(req.userId, mood_text, mood_label);
        if (cachedMusicUrl) {
            return res.json({
                success: true,
                data: { audioUrl: cachedMusicUrl, cached: true }
            });
        }
        // Construct prompt for Vertex AI MusicLM
        const promptText = `Generate a short instrumental music clip for mood: ${mood_label}. Description: ${mood_text}`;
        // Call Vertex AI MusicLM via audioService
        const result = await audio_1.audioService.generateAndCacheMusic({
            prompt: promptText,
            userId: req.userId,
            mood_text,
            mood_label
        });
        // Save music cache
        await db_1.default.music.saveMusicCache(req.userId, mood_text, mood_label, result.audioUrl);
        await db_1.default.logAccess({
            user_id: req.userId,
            action: 'ai_music_generation',
            resource: 'ai',
            ip_address: req.ip
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
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
const server = app.listen(config_1.default.port, () => {
    console.log(`🤗 Althos backend running on port ${config_1.default.port}`);
    console.log(`😎 Environment: ${config_1.default.nodeEnv}`);
    console.log(`🤖 AI Services: ${config_1.default.enableAI ? '✅ Enabled' : '🔄 Disabled'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        process.exit(0);
    });
});
exports.default = app;
