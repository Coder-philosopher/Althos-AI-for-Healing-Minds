"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiDistressCheck = exports.aiGrounding = exports.aiKindness = exports.aiWeeklySummary = exports.aiCoping = exports.aiJournalCoach = void 0;
const ai_1 = require("../ai");
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
const setCorsHeaders = (res, origin) => {
    const allowedOrigins = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
    const requestOrigin = origin || '';
    if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
    res.set('Access-Control-Max-Age', '3600');
};
const getUserId = (req) => {
    return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};
const handleError = (res, error) => {
    console.error('AI Function error:', error);
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
const aiJournalCoach = async (req, res) => {
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
        const request = req.body;
        if (!request.text || request.text.trim().length === 0) {
            throw new utils_1.AppError('Text is required for coaching', 400);
        }
        const response = await ai_1.ai.journalCoach(request);
        if (response.risk === 'high' || response.risk === 'med') {
            await db_1.default.alerts.create(userId, {
                risk_level: response.risk,
                context_text: request.text.substring(0, 500)
            });
        }
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_journal_coach',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiJournalCoach = aiJournalCoach;
const aiCoping = async (req, res) => {
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
        const request = req.body;
        if (!request.goal || request.goal.trim().length === 0) {
            throw new utils_1.AppError('Goal is required for coping strategies', 400);
        }
        const response = await ai_1.ai.generateCoping(request);
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_coping',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiCoping = aiCoping;
const aiWeeklySummary = async (req, res) => {
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
        const request = req.body;
        const { start, end } = (0, utils_1.getWeekBounds)();
        const weeklyRequest = {
            ...request,
            from_date: request.from_date || start,
            to_date: request.to_date || end
        };
        const response = await ai_1.ai.generateWeeklySummary(weeklyRequest);
        await db_1.default.weeklySummaries.create(userId, {
            from_date: response.period.from,
            to_date: response.period.to,
            summary_text: response.summary_text,
            audio_url: response.audio_url,
            metaphor: response.metaphor
        });
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_weekly_summary',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiWeeklySummary = aiWeeklySummary;
const aiKindness = async (req, res) => {
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
        const request = req.body;
        const response = await ai_1.ai.extractKindness(request);
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_kindness',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiKindness = aiKindness;
const aiGrounding = async (req, res) => {
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
        const { duration_secs = 60, context = 'general' } = req.body;
        const response = {
            script: `Let's take ${Math.floor(duration_secs / 60)} minutes to ground yourself and return to the present moment.`,
            steps: [
                { ts: 0, text: 'Find a comfortable position, sitting or standing' },
                { ts: 10, text: 'Take three slow, deep breaths, feeling your body settle' },
                { ts: 25, text: 'Notice 5 things you can see around you right now' },
                { ts: 35, text: 'Notice 4 things you can physically touch or feel' },
                { ts: 45, text: 'Notice 3 sounds you can hear in your environment' },
                { ts: 55, text: 'Take one more deep breath and gently return your attention to the present' }
            ]
        };
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_grounding',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiGrounding = aiGrounding;
const aiDistressCheck = async (req, res) => {
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
        const request = req.body;
        if (!request.text || request.text.trim().length === 0) {
            throw new utils_1.AppError('Text is required for distress check', 400);
        }
        const response = await ai_1.ai.checkDistress(request);
        if (response.risk === 'med' || response.risk === 'high') {
            await db_1.default.alerts.create(userId, {
                risk_level: response.risk,
                reasons: response.reasons,
                context_text: request.text.substring(0, 500)
            });
        }
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'system',
            action: 'ai_distress_check',
            resource: 'ai',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.aiDistressCheck = aiDistressCheck;
