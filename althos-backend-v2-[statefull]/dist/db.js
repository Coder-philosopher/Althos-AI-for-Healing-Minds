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
            ssl: config_1.default.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
        });
        pool.on('error', (err) => {
            console.error('Database pool error:', err);
        });
    }
    return pool;
}
exports.db = {
    async query(text, params) {
        const client = getPool();
        const result = await client.query(text, params);
        return result.rows;
    },
    async queryOne(text, params) {
        const rows = await exports.db.query(text, params);
        return rows[0] || null;
    },
    async healthCheck() {
        try {
            await exports.db.query('SELECT NOW()');
            return true;
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    },
    // User operations
    users: {
        async create(userData) {
            const result = await exports.db.query(`INSERT INTO users (id, name, age, sex, profession, hobbies, locale)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [userData.id, userData.name, userData.age, userData.sex,
                userData.profession, userData.hobbies, userData.locale]);
            return result[0];
        },
        async findById(id) {
            return exports.db.queryOne('SELECT * FROM users WHERE id = $1', [id]);
        },
        async update(id, updates) {
            const fields = Object.keys(updates).filter(k => k !== 'id');
            if (fields.length === 0)
                return null;
            const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
            const values = [id, ...fields.map(f => updates[f])];
            const result = await exports.db.query(`UPDATE users SET ${setClause}, updated_at = NOW() 
         WHERE id = $1 RETURNING *`, values);
            return result[0] || null;
        }
    },
    // Journal operations
    journals: {
        async create(userId, data) {
            const result = await exports.db.query(`INSERT INTO journals (user_id, title, content, mood_valence, mood_arousal, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, [userId, data.title, data.content, data.mood_valence, data.mood_arousal, data.tags]);
            return result[0];
        },
        async findByUser(userId, limit = 20, offset = 0) {
            return exports.db.query(`SELECT * FROM journals 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        }
    },
    // Test operations
    tests: {
        async create(userId, data) {
            const result = await exports.db.query(`INSERT INTO tests (user_id, type, score, answers, severity_band)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`, [userId, data.type, data.score, data.answers, data.severity_band]);
            return result[0];
        },
        async getInsights(userId, days = 30) {
            const trends = await exports.db.query(`SELECT DATE(taken_at) as date, type, score
         FROM tests 
         WHERE user_id = $1 
         AND taken_at >= NOW() - INTERVAL '${days} days'
         ORDER BY taken_at`, [userId]);
            return { trends };
        }
    },
    // Mood operations
    moods: {
        async upsertDaily(userId, data) {
            const result = await exports.db.query(`INSERT INTO moods_daily (user_id, date, valence, arousal)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, date) 
         DO UPDATE SET valence = EXCLUDED.valence, arousal = EXCLUDED.arousal
         RETURNING *`, [userId, data.date, data.valence, data.arousal]);
            return result[0];
        },
        async findByUser(userId, fromDate, toDate) {
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
            return exports.db.query(sql, params);
        }
    },
    // Access logging
    async logAccess(data) {
        await exports.db.query(`INSERT INTO access_logs (user_id, action, resource, ip_address, success)
       VALUES ($1, $2, $3, $4, $5)`, [data.user_id, data.action, data.resource, data.ip_address, data.success ?? true]);
    }
};
exports.default = exports.db;
