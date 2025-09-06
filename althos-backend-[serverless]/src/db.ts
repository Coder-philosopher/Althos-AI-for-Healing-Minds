// db.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';
import config from './config';

// Serverless-safe pool (Cloud Functions): keep max small, lazy init
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on('error', (err) => console.error('pg pool error', err));
  }
  return pool!;
}

export const db = {
  async query<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const p = getPool();
    const res = await p.query<T>(text, params);
    return res;
  },

  async getOne<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T | null> {
    const r = await db.query<T>(text, params);
    return r.rows[0] ?? null;
  },

  async getMany<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T[]> {
    const r = await db.query<T>(text, params);
    return r.rows;
  },

  async insertOne<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T> {
    const r = await db.query<T>(text, params);
    if (!r.rows.length) throw new Error('Insert returned no rows');
    return r.rows[0];
  },

  async healthCheck(): Promise<boolean> {
    try {
      const r = await db.query('SELECT NOW()');
      return r.rows.length > 0;
    } catch {
      return false;
    }
  },

  users: {
    findById(id: string) {
      return db.getOne('SELECT * FROM users WHERE id = $1', [id]);
    },
    create(data: { display_name?: string; locale?: string }) {
      return db.insertOne(
        `INSERT INTO users (display_name, locale) VALUES ($1,$2) RETURNING *`,
        [data.display_name, data.locale],
      );
    },
  },

  journals: {
    create(
      userId: string,
      data: { title?: string; content: string; mood_valence?: number; mood_arousal?: number; tags?: string[] },
    ) {
      return db.insertOne(
        `INSERT INTO journals (user_id, title, content, mood_valence, mood_arousal, tags)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [userId, data.title, data.content, data.mood_valence, data.mood_arousal, data.tags],
      );
    },
    findByUser(userId: string, limit = 20, offset = 0) {
      return db.getMany(
        `SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset],
      );
    },
    findRecent(userId: string, days = 7) {
      return db.getMany(
        `SELECT * FROM journals WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
         ORDER BY created_at DESC`,
        [userId],
      );
    },
  },

  tests: {
    create(userId: string, data: { type: 'phq9' | 'gad7'; score: number; answers: number[]; severity_band?: string }) {
      return db.insertOne(
        `INSERT INTO tests (user_id, type, score, answers, severity_band)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [userId, data.type, data.score, JSON.stringify(data.answers), data.severity_band],
      );
    },
    findByUser(userId: string, type?: string, limit = 10) {
      const sql = type
        ? `SELECT * FROM tests WHERE user_id = $1 AND type = $2 ORDER BY taken_at DESC LIMIT $3`
        : `SELECT * FROM tests WHERE user_id = $1 ORDER BY taken_at DESC LIMIT $2`;
      const params = type ? [userId, type, limit] : [userId, limit];
      return db.getMany(sql, params);
    },
    async getInsights(userId: string, days = 30) {
      const trends = await db.getMany<{ date: string; type: 'phq9' | 'gad7'; score: number }>(
        `SELECT DATE(taken_at) as date, type, score
         FROM tests
         WHERE user_id = $1 AND taken_at >= NOW() - INTERVAL '${days} days'
         ORDER BY taken_at`,
        [userId],
      );
      return { trends };
    },
  },

  moods: {
    upsertDaily(userId: string, data: { date: string; valence: number; arousal: number; source?: string }) {
      return db.insertOne(
        `INSERT INTO moods_daily (user_id, date, valence, arousal, source)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, date) DO UPDATE
           SET valence = EXCLUDED.valence, arousal = EXCLUDED.arousal, source = EXCLUDED.source
         RETURNING *`,
        [userId, data.date, data.valence, data.arousal, data.source || 'self'],
      );
    },
    findByUser(userId: string, fromDate?: string, toDate?: string) {
      let sql = 'SELECT * FROM moods_daily WHERE user_id = $1';
      const params: any[] = [userId];
      if (fromDate) {
        sql += ' AND date >= $2';
        params.push(fromDate);
      }
      if (toDate) {
        sql += ` AND date <= $${params.length + 1}`;
        params.push(toDate);
      }
      sql += ' ORDER BY date';
      return db.getMany(sql, params);
    },
  },

  copingTasks: {
    create(
      userId: string,
      data: { journal_id?: string; title: string; steps: string[]; duration_mins?: number; category?: string },
    ) {
      return db.insertOne(
        `INSERT INTO coping_tasks (user_id, journal_id, title, steps, duration_mins, category)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [userId, data.journal_id, data.title, JSON.stringify(data.steps), data.duration_mins, data.category],
      );
    },
  },

  weeklySummaries: {
    create(
      userId: string,
      data: { from_date: string; to_date: string; summary_text: string; audio_url?: string; metaphor?: string },
    ) {
      return db.insertOne(
        `INSERT INTO weekly_summaries (user_id, from_date, to_date, summary_text, audio_url, metaphor)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [userId, data.from_date, data.to_date, data.summary_text, data.audio_url, data.metaphor],
      );
    },
  },

  shares: {
    create(userId: string, data: { token: string; scopes: string[]; window_days: number; expires_at: Date }) {
      return db.insertOne(
        `INSERT INTO shares (user_id, token, scopes, window_days, expires_at)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [userId, data.token, data.scopes, data.window_days, data.expires_at],
      );
    },
    findByToken(token: string) {
      return db.getOne(
        `SELECT * FROM shares WHERE token = $1 AND expires_at > NOW() AND revoked = FALSE`,
        [token],
      );
    },
    incrementAccess(id: string) {
      return db.query(`UPDATE shares SET access_count = access_count + 1 WHERE id = $1`, [id]);
    },
  },

  accessLogs: {
    create(data: {
      user_id?: string;
      actor: string;
      action: string;
      resource: string;
      token?: string;
      ip_address?: string;
      user_agent?: string;
      success?: boolean;
    }) {
      return db.insertOne(
        `INSERT INTO access_logs (user_id, actor, action, resource, token, ip_address, user_agent, success)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          data.user_id,
          data.actor,
          data.action,
          data.resource,
          data.token,
          data.ip_address,
          data.user_agent,
          data.success ?? true,
        ],
      );
    },
  },

  alerts: {
    create(
      userId: string,
      data: { risk_level: 'none' | 'low' | 'med' | 'high'; reasons?: string[]; context_text?: string },
    ) {
      return db.insertOne(
        `INSERT INTO alerts (user_id, risk_level, reasons, context_text)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [userId, data.risk_level, JSON.stringify(data.reasons || []), data.context_text],
      );
    },
  },
};

export default db;
