import { Pool, QueryResultRow } from 'pg';
import config from './config';
import { User, Journal, RegisterUserRequest } from './types';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
    });
    
    pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
  }
  return pool;
}

export const db = {
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string, 
    params?: any[]
  ): Promise<T[]> {
    const client = getPool();
    const result = await client.query<T>(text, params);
    return result.rows;
  },

  async queryOne<T extends QueryResultRow = QueryResultRow>(
    text: string, 
    params?: any[]
  ): Promise<T | null> {
    const rows = await db.query<T>(text, params);
    return rows[0] || null;
  },

  async healthCheck(): Promise<boolean> {
    try {
      await db.query('SELECT NOW()');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  },

  // User operations
  users: {
    async create(userData: RegisterUserRequest): Promise<User> {
      const result = await db.query<User>(
        `INSERT INTO users (id, name, age, sex, profession, hobbies, locale)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userData.id, userData.name, userData.age, userData.sex, 
         userData.profession, userData.hobbies, userData.locale]
      );
      return result[0];
    },

    async findById(id: string): Promise<User | null> {
      return db.queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
    },

    async update(id: string, updates: Partial<User>): Promise<User | null> {
      const fields = Object.keys(updates).filter(k => k !== 'id');
      if (fields.length === 0) return null;

      const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
      const values = [id, ...fields.map(f => updates[f as keyof User])];

      const result = await db.query<User>(
        `UPDATE users SET ${setClause}, updated_at = NOW() 
         WHERE id = $1 RETURNING *`,
        values
      );
      return result[0] || null;
    }
  },

  // Journal operations
  journals: {
    async create(userId: string, data: {
      title?: string;
      content: string;
      mood_valence?: number;
      mood_arousal?: number;
      tags?: string[];
    }): Promise<Journal> {
      const result = await db.query<Journal>(
        `INSERT INTO journals (user_id, title, content, mood_valence, mood_arousal, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, data.title, data.content, data.mood_valence, data.mood_arousal, data.tags]
      );
      return result[0];
    },

    async findByUser(userId: string, limit = 20, offset = 0): Promise<Journal[]> {
      return db.query<Journal>(
        `SELECT * FROM journals 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
    }
  },

  // Test operations
  tests: {
    async create(userId: string, data: {
      type: 'phq9' | 'gad7';
      score: number;
      answers: number[];
      severity_band: string;
    }) {
      const result = await db.query(
        `INSERT INTO tests (user_id, type, score, answers, severity_band)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, data.type, data.score, data.answers, data.severity_band]
      );
      return result[0];
    },

    async getInsights(userId: string, days = 30) {
      const trends = await db.query(
        `SELECT DATE(taken_at) as date, type, score
         FROM tests 
         WHERE user_id = $1 
         AND taken_at >= NOW() - INTERVAL '${days} days'
         ORDER BY taken_at`,
        [userId]
      );
      return { trends };
    }
  },

  // Mood operations
  moods: {
    async upsertDaily(userId: string, data: {
      date: string;
      valence: number;
      arousal: number;
    }) {
      const result = await db.query(
        `INSERT INTO moods_daily (user_id, date, valence, arousal)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, date) 
         DO UPDATE SET valence = EXCLUDED.valence, arousal = EXCLUDED.arousal
         RETURNING *`,
        [userId, data.date, data.valence, data.arousal]
      );
      return result[0];
    },

    async findByUser(userId: string, fromDate?: string, toDate?: string) {
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
      return db.query(sql, params);
    }
  },

  // Access logging
  async logAccess(data: {
    user_id?: string;
    action: string;
    resource: string;
    ip_address?: string;
    success?: boolean;
  }) {
    await db.query(
      `INSERT INTO access_logs (user_id, action, resource, ip_address, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.user_id, data.action, data.resource, data.ip_address, data.success ?? true]
    );
  }
};

export default db;
