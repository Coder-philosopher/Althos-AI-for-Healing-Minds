"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalRecent = exports.journalById = exports.journal = void 0;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
const setCorsHeaders = (res, origin) => {
    const allowedOrigins = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
    const requestOrigin = origin || '';
    if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
    res.set('Access-Control-Max-Age', '3600');
};
const getUserId = (req) => {
    return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};
const handleError = (res, error) => {
    console.error('Function error:', error);
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
const journal = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    try {
        const userId = getUserId(req);
        if (req.method === 'POST') {
            const data = req.body;
            if (!data.content || data.content.trim().length === 0) {
                throw new utils_1.AppError('Journal content is required', 400);
            }
            const journal = await db_1.default.journals.create(userId, {
                title: data.title,
                content: data.content,
                mood_valence: data.mood?.valence,
                mood_arousal: data.mood?.arousal,
                tags: data.tags
            });
            if (data.mood) {
                const today = (0, utils_1.formatDate)(new Date());
                await db_1.default.moods.upsertDaily(userId, {
                    date: today,
                    valence: data.mood.valence,
                    arousal: data.mood.arousal,
                    source: 'journal'
                });
            }
            await db_1.default.accessLogs.create({
                user_id: userId,
                actor: 'user',
                action: 'create',
                resource: 'journal',
                ip_address: req.ip
            });
            const response = {
                id: journal.id,
                created_at: journal.created_at
            };
            return res.json({
                success: true,
                data: response
            });
        }
        else if (req.method === 'GET') {
            const limit = Math.min(parseInt(req.query.limit) || 20, 100);
            const offset = Math.max(parseInt(req.query.offset) || 0, 0);
            const journals = await db_1.default.journals.findByUser(userId, limit, offset);
            return res.json({
                success: true,
                data: journals,
                pagination: {
                    limit,
                    offset,
                    has_more: journals.length === limit
                }
            });
        }
        else {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed'
            });
        }
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.journal = journal;
const journalById = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    try {
        const userId = getUserId(req);
        const journalId = req.params?.id || req.query.id;
        if (!journalId) {
            throw new utils_1.AppError('Journal ID is required', 400);
        }
        const journal = await db_1.default.getOne('SELECT * FROM journals WHERE id = $1 AND user_id = $2', [journalId, userId]);
        if (!journal) {
            throw new utils_1.AppError('Journal not found', 404);
        }
        return res.json({
            success: true,
            data: journal
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.journalById = journalById;
const journalRecent = async (req, res) => {
    setCorsHeaders(res, req.headers.origin);
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }
    try {
        const userId = getUserId(req);
        const days = Math.min(parseInt(req.query.days) || 7, 30);
        const journals = await db_1.default.journals.findRecent(userId, days);
        return res.json({
            success: true,
            data: journals,
            period: {
                days_back: days,
                count: journals.length
            }
        });
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.journalRecent = journalRecent;
