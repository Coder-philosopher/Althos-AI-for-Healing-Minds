"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodTrends = exports.moodHistory = exports.moodAtlas = exports.moodDaily = void 0;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
const setCorsHeaders = (res, origin) => {
    const allowedOrigins = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
    const requestOrigin = origin || '';
    if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
    res.set('Access-Control-Max-Age', '3600');
};
const getUserId = (req) => {
    return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};
const handleError = (res, error) => {
    console.error('Mood Function error:', error);
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
const moodDaily = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
    try {
        const userId = getUserId(req);
        const { date, valence, arousal } = req.body;
        if (!date || !Number.isInteger(valence) || typeof arousal !== 'number') {
            throw new utils_1.AppError('Date, valence (-2 to 2), and arousal (0 to 1) are required', 400);
        }
        if (!(0, utils_1.isValidMoodValue)(valence, 'valence') || !(0, utils_1.isValidMoodValue)(arousal, 'arousal')) {
            throw new utils_1.AppError('Valence must be -2 to 2, arousal must be 0 to 1', 400);
        }
        const mood = await db_1.default.moods.upsertDaily(userId, {
            date,
            valence,
            arousal,
            source: 'self'
        });
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'user',
            action: 'record_mood',
            resource: 'mood',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: mood
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.moodDaily = moodDaily;
const moodAtlas = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
    try {
        const userId = getUserId(req);
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const moods = await db_1.default.moods.findByUser(userId, fromDate, toDate);
        if (moods.length === 0) {
            const response = {
                clusters: [],
                highlights: ['No mood data available for the selected period.'],
                period: { from: fromDate || 'N/A', to: toDate || 'N/A' }
            };
            return res.json({
                success: true,
                data: response
            });
        }
        const moodPoints = moods.map(m => ({
            valence: m.valence,
            arousal: m.arousal,
            date: m.date
        }));
        const clusters = (0, utils_1.clusterMoods)(moodPoints, 3);
        const highlights = [
            `Analyzed ${moods.length} mood entries`,
            `Found ${clusters.length} distinct mood patterns`,
            clusters.length > 0 ? `Most common mood cluster has ${Math.max(...clusters.map(c => c.days.length))} days` : ''
        ].filter(Boolean);
        const response = {
            clusters,
            highlights,
            period: {
                from: fromDate || moods[moods.length - 1]?.date,
                to: toDate || moods[0]?.date
            }
        };
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.moodAtlas = moodAtlas;
const moodHistory = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
    try {
        const userId = getUserId(req);
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const limit = Math.min(parseInt(req.query.limit) || 30, 90);
        let moods;
        if (fromDate || toDate) {
            moods = await db_1.default.moods.findByUser(userId, fromDate, toDate);
        }
        else {
            moods = await db_1.default.getMany(`SELECT * FROM moods_daily 
         WHERE user_id = $1 
         ORDER BY date DESC 
         LIMIT $2`, [userId, limit]);
        }
        return res.json({
            success: true,
            data: moods,
            filters: {
                from: fromDate,
                to: toDate,
                limit: moods.length
            }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.moodHistory = moodHistory;
const moodTrends = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
    try {
        const userId = getUserId(req);
        const days = Math.min(parseInt(req.query.days) || 30, 90);
        const trends = await db_1.default.getMany(`SELECT 
         date,
         valence,
         arousal,
         AVG(valence) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as valence_7day_avg,
         AVG(arousal) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as arousal_7day_avg
       FROM moods_daily 
       WHERE user_id = $1 
       AND date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY date`, [userId]);
        let stats = null;
        if (trends.length > 0) {
            const valences = trends.map(t => t.valence);
            const arousals = trends.map(t => t.arousal);
            stats = {
                avg_valence: valences.reduce((a, b) => a + b, 0) / valences.length,
                avg_arousal: arousals.reduce((a, b) => a + b, 0) / arousals.length,
                min_valence: Math.min(...valences),
                max_valence: Math.max(...valences),
                min_arousal: Math.min(...arousals),
                max_arousal: Math.max(...arousals),
                total_entries: trends.length
            };
        }
        return res.json({
            success: true,
            data: {
                trends,
                stats,
                period_days: days
            }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.moodTrends = moodTrends;
