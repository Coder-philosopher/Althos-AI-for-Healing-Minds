"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareAnalytics = exports.shareRevoke = exports.shareList = exports.shareSummary = exports.shareCreate = void 0;
const ai_1 = require("../ai");
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
    console.error('Shares Function error:', error);
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
const shareCreate = async (req, res) => {
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
        const { scopes = ['summary', 'tests', 'mood'], window_days = 30, expires_mins = 60 } = req.body;
        const token = (0, utils_1.generateToken)(32);
        const expiresAt = (0, utils_1.addMinutes)(new Date(), expires_mins);
        const share = await db_1.default.shares.create(userId, {
            token,
            scopes,
            window_days,
            expires_at: expiresAt
        });
        const shareUrl = `${req.get('x-forwarded-proto') || 'https'}://${req.get('host')}/share/${token}`;
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'user',
            action: 'create_share',
            resource: 'share',
            token,
            ip_address: req.ip
        });
        const response = {
            id: share.id,
            token,
            url: shareUrl,
            expires_at: expiresAt
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
exports.shareCreate = shareCreate;
const shareSummary = async (req, res) => {
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
        const token = req.query.token || req.params?.token;
        if (!token) {
            throw new utils_1.AppError('Share token is required', 400);
        }
        const share = await db_1.default.shares.findByToken(token);
        if (!share) {
            throw new utils_1.AppError('Share link expired or invalid', 404);
        }
        await db_1.default.shares.incrementAccess(share.id);
        const summary = await ai_1.ai.generateClinicianSummary(share.user_id, share.window_days);
        await db_1.default.accessLogs.create({
            user_id: share.user_id,
            actor: 'clinician',
            action: 'view_summary',
            resource: 'share',
            token,
            ip_address: req.ip
        });
        const response = {
            patient_alias: `Patient-${share.user_id.substring(0, 8)}`,
            period: {
                from: (0, utils_1.formatDate)(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000)),
                to: (0, utils_1.formatDate)(new Date())
            },
            summary: {
                soap_text: summary,
                scores: { phq9: [], gad7: [] },
                trends: {
                    mood_pattern: 'Variable with stress-related fluctuations',
                    risk_indicators: []
                }
            },
            generated_at: new Date(),
            access_count: share.access_count + 1
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
exports.shareSummary = shareSummary;
const shareList = async (req, res) => {
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
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const includeExpired = req.query.include_expired === 'true';
        let sql = `
      SELECT id, token, scopes, window_days, expires_at, revoked, access_count, created_at
      FROM shares 
      WHERE user_id = $1
    `;
        if (!includeExpired) {
            sql += ' AND expires_at > NOW() AND revoked = FALSE';
        }
        sql += ' ORDER BY created_at DESC LIMIT $2';
        const shares = await db_1.default.getMany(sql, [userId, limit]);
        return res.json({
            success: true,
            data: shares,
            filters: {
                limit,
                include_expired: includeExpired
            }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.shareList = shareList;
const shareRevoke = async (req, res) => {
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
        const { share_id } = req.body;
        if (!share_id) {
            throw new utils_1.AppError('Share ID is required', 400);
        }
        const share = await db_1.default.getOne('SELECT id FROM shares WHERE id = $1 AND user_id = $2', [share_id, userId]);
        if (!share) {
            throw new utils_1.AppError('Share not found or access denied', 404);
        }
        await db_1.default.query('UPDATE shares SET revoked = TRUE WHERE id = $1', [share_id]);
        await db_1.default.accessLogs.create({
            user_id: userId,
            actor: 'user',
            action: 'revoke_share',
            resource: 'share',
            ip_address: req.ip
        });
        return res.json({
            success: true,
            data: { revoked: true }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.shareRevoke = shareRevoke;
const shareAnalytics = async (req, res) => {
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
        const shareId = req.query.share_id;
        if (!shareId) {
            throw new utils_1.AppError('Share ID is required', 400);
        }
        const share = await db_1.default.getOne('SELECT token FROM shares WHERE id = $1 AND user_id = $2', [shareId, userId]);
        if (!share) {
            throw new utils_1.AppError('Share not found or access denied', 404);
        }
        const accessLogs = await db_1.default.getMany(`SELECT actor, action, ip_address, created_at
       FROM access_logs 
       WHERE user_id = $1 AND token = $2 
       ORDER BY created_at DESC 
       LIMIT 20`, [userId, share.token]);
        return res.json({
            success: true,
            data: {
                share_id: shareId,
                access_logs: accessLogs,
                total_accesses: accessLogs.length
            }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.shareAnalytics = shareAnalytics;
