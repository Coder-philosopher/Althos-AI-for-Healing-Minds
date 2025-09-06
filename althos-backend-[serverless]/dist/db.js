"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config"));
let pool = null;
function getPool() {
    if (!pool) {
        pool = new pg_1.Pool({
            connectionString: config_1.default.databaseUrl,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
        pool.on('error', (err) => console.error('pg pool error', err));
    }
    return pool;
}
exports.db = {
    async query(text, params) {
        const p = getPool();
        const res = await p.query(text, params);
        return res;
    },
    async getOne(text, params) {
        const r = await exports.db.query(text, params);
        return r.rows[0] ?? null;
    },
    async getMany(text, params) {
        const r = await exports.db.query(text, params);
        return r.rows;
    },
    async insertOne(text, params) {
        const r = await exports.db.query(text, params);
        if (!r.rows.length)
            throw new Error('Insert returned no rows');
        return r.rows[0];
    },
    async healthCheck() {
        try {
            const r = await exports.db.query('SELECT NOW()');
            return r.rows.length > 0;
        }
        catch {
            return false;
        }
    },
    users: {
        findById(id) {
            return exports.db.getOne('SELECT * FROM users WHERE id = $1', [id]);
        },
        create(data) {
            return exports.db.insertOne(`INSERT INTO users (display_name, locale) VALUES ($1,$2) RETURNING *`, [data.display_name, data.locale]);
        },
    },
    journals: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO journals (user_id, title, content, mood_valence, mood_arousal, tags)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [userId, data.title, data.content, data.mood_valence, data.mood_arousal, data.tags]);
        },
        findByUser(userId, limit = 20, offset = 0) {
            return exports.db.getMany(`SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        },
        findRecent(userId, days = 7) {
            return exports.db.getMany(`SELECT * FROM journals WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
         ORDER BY created_at DESC`, [userId]);
        },
    },
    tests: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO tests (user_id, type, score, answers, severity_band)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`, [userId, data.type, data.score, JSON.stringify(data.answers), data.severity_band]);
        },
        findByUser(userId, type, limit = 10) {
            const sql = type
                ? `SELECT * FROM tests WHERE user_id = $1 AND type = $2 ORDER BY taken_at DESC LIMIT $3`
                : `SELECT * FROM tests WHERE user_id = $1 ORDER BY taken_at DESC LIMIT $2`;
            const params = type ? [userId, type, limit] : [userId, limit];
            return exports.db.getMany(sql, params);
        },
        async getInsights(userId, days = 30) {
            const trends = await exports.db.getMany(`SELECT DATE(taken_at) as date, type, score
         FROM tests
         WHERE user_id = $1 AND taken_at >= NOW() - INTERVAL '${days} days'
         ORDER BY taken_at`, [userId]);
            return { trends };
        },
    },
    moods: {
        upsertDaily(userId, data) {
            return exports.db.insertOne(`INSERT INTO moods_daily (user_id, date, valence, arousal, source)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, date) DO UPDATE
           SET valence = EXCLUDED.valence, arousal = EXCLUDED.arousal, source = EXCLUDED.source
         RETURNING *`, [userId, data.date, data.valence, data.arousal, data.source || 'self']);
        },
        findByUser(userId, fromDate, toDate) {
            let sql = 'SELECT * FROM moods_daily WHERE user_id = $1';
            const params = [userId];
            if (fromDate) {
                sql += ' AND date >= $2';
                params.push(fromDate);
            }
            if (toDate) {
                sql += ` AND date <= $${params.length + 1}`;
                params.push(toDate);
            }
            sql += ' ORDER BY date';
            return exports.db.getMany(sql, params);
        },
    },
    copingTasks: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO coping_tasks (user_id, journal_id, title, steps, duration_mins, category)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [userId, data.journal_id, data.title, JSON.stringify(data.steps), data.duration_mins, data.category]);
        },
    },
    weeklySummaries: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO weekly_summaries (user_id, from_date, to_date, summary_text, audio_url, metaphor)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [userId, data.from_date, data.to_date, data.summary_text, data.audio_url, data.metaphor]);
        },
    },
    shares: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO shares (user_id, token, scopes, window_days, expires_at)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`, [userId, data.token, data.scopes, data.window_days, data.expires_at]);
        },
        findByToken(token) {
            return exports.db.getOne(`SELECT * FROM shares WHERE token = $1 AND expires_at > NOW() AND revoked = FALSE`, [token]);
        },
        incrementAccess(id) {
            return exports.db.query(`UPDATE shares SET access_count = access_count + 1 WHERE id = $1`, [id]);
        },
    },
    accessLogs: {
        create(data) {
            return exports.db.insertOne(`INSERT INTO access_logs (user_id, actor, action, resource, token, ip_address, user_agent, success)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [
                data.user_id,
                data.actor,
                data.action,
                data.resource,
                data.token,
                data.ip_address,
                data.user_agent,
                data.success ?? true,
            ]);
        },
    },
    alerts: {
        create(userId, data) {
            return exports.db.insertOne(`INSERT INTO alerts (user_id, risk_level, reasons, context_text)
         VALUES ($1,$2,$3,$4) RETURNING *`, [userId, data.risk_level, JSON.stringify(data.reasons || []), data.context_text]);
        },
    },
};
exports.default = exports.db;
