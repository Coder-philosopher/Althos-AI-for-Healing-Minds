"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testHistory = exports.testInsights = exports.testGAD7 = exports.testPHQ9 = void 0;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
const copy_1 = require("../copy");
function setCors(res, origin) {
    const allowed = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
    const o = origin || '';
    if (allowed.some(a => o.includes(a.replace('*', ''))))
        res.set('Access-Control-Allow-Origin', o);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
    res.set('Access-Control-Max-Age', '3600');
}
const userIdFrom = (req) => req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
function mapBandToStrength(avg) {
    if (avg < 5)
        return 'strong';
    if (avg < 10)
        return 'moderate';
    return 'weak';
}
const testPHQ9 = async (req, res) => {
    setCors(res, req.headers.origin);
    if (req.method === 'OPTIONS')
        return res.status(200).send('');
    if (req.method !== 'POST')
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    try {
        const userId = userIdFrom(req);
        const { answers } = req.body;
        if (!(0, utils_1.isValidTestAnswers)(answers, 'phq9'))
            throw new utils_1.AppError('PHQ-9 needs 9 answers (0–3)', 400);
        const { score, severity } = (0, utils_1.scorePHQ9)(answers);
        const explain = copy_1.testExplanations.phq9;
        const created = await db_1.default.tests.create(userId, {
            type: 'phq9',
            score,
            answers,
            severity_band: severity,
        });
        const suggestion = severity === 'minimal'
            ? 'Keep up healthy routines and supportive connections.'
            : severity === 'mild'
                ? 'Try stress-management (breathing, walks) and talk to someone you trust.'
                : 'Consider speaking with a mental health professional.';
        const resp = {
            id: created.id,
            score,
            severity_band: severity,
            explanation: `Your PHQ-9 score is ${score}, suggesting ${explain.severityBands[severity]?.description || severity}. ${explain.disclaimer}`,
            suggestion,
        };
        return res.json({ success: true, data: resp });
    }
    catch (e) {
        const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
        return res.status(code).json({ success: false, message: e?.message || 'Error' });
    }
};
exports.testPHQ9 = testPHQ9;
const testGAD7 = async (req, res) => {
    setCors(res, req.headers.origin);
    if (req.method === 'OPTIONS')
        return res.status(200).send('');
    if (req.method !== 'POST')
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    try {
        const userId = userIdFrom(req);
        const { answers } = req.body;
        if (!(0, utils_1.isValidTestAnswers)(answers, 'gad7'))
            throw new utils_1.AppError('GAD-7 needs 7 answers (0–3)', 400);
        const { score, severity } = (0, utils_1.scoreGAD7)(answers);
        const explain = copy_1.testExplanations.gad7;
        const created = await db_1.default.tests.create(userId, {
            type: 'gad7',
            score,
            answers,
            severity_band: severity,
        });
        const suggestion = severity === 'minimal'
            ? 'Anxiety seems manageable—continue current coping strategies.'
            : severity === 'mild'
                ? 'Try relaxation (breathing, mindfulness) and short movement breaks.'
                : 'Consider speaking with a counselor about anxiety management.';
        const resp = {
            id: created.id,
            score,
            severity_band: severity,
            explanation: `Your GAD-7 score is ${score}, suggesting ${explain.severityBands[severity]?.description || severity}. ${explain.disclaimer}`,
            suggestion,
        };
        return res.json({ success: true, data: resp });
    }
    catch (e) {
        const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
        return res.status(code).json({ success: false, message: e?.message || 'Error' });
    }
};
exports.testGAD7 = testGAD7;
const testInsights = async (req, res) => {
    setCors(res, req.headers.origin);
    if (req.method === 'OPTIONS')
        return res.status(200).send('');
    if (req.method !== 'GET')
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    try {
        const userId = userIdFrom(req);
        const days = Math.min(parseInt(req.query.days || '30', 10), 90);
        const insights = await db_1.default.tests.getInsights(userId, days);
        const correlations = [];
        if (insights.trends.length >= 2) {
            const phq9 = insights.trends.filter(t => t.type === 'phq9');
            const gad7 = insights.trends.filter(t => t.type === 'gad7');
            if (phq9.length >= 2) {
                const avg = phq9.reduce((s, t) => s + t.score, 0) / phq9.length;
                correlations.push({
                    note: `Average PHQ-9 over ${days} days: ${avg.toFixed(1)}`,
                    strength: mapBandToStrength(avg),
                });
            }
            if (gad7.length >= 2) {
                const avg = gad7.reduce((s, t) => s + t.score, 0) / gad7.length;
                correlations.push({
                    note: `Average GAD-7 over ${days} days: ${avg.toFixed(1)}`,
                    strength: mapBandToStrength(avg),
                });
            }
        }
        const resp = {
            trends: insights.trends.map(t => ({ date: t.date, ...(t.type === 'phq9' ? { phq9: t.score } : { gad7: t.score }) })),
            correlations,
        };
        return res.json({ success: true, data: resp });
    }
    catch (e) {
        const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
        return res.status(code).json({ success: false, message: e?.message || 'Error' });
    }
};
exports.testInsights = testInsights;
const testHistory = async (req, res) => {
    setCors(res, req.headers.origin);
    if (req.method === 'OPTIONS')
        return res.status(200).send('');
    if (req.method !== 'GET')
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    try {
        const userId = userIdFrom(req);
        const type = req.query.type || undefined;
        const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
        const tests = await db_1.default.tests.findByUser(userId, type, limit);
        return res.json({ success: true, data: tests, filters: { type: type || 'all', limit } });
    }
    catch (e) {
        const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
        return res.status(code).json({ success: false, message: e?.message || 'Error' });
    }
};
exports.testHistory = testHistory;
