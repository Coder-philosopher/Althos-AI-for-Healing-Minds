import { Pool, QueryResultRow } from 'pg';
import config from './config';
import { User, Journal, RegisterUserRequest,JournalCoachResponse } from './types';

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
    },
    async findById(id: string, userId: string): Promise<Journal | null> {
    const result = await db.query<Journal>(
      `SELECT * FROM journals 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    )
    return result[0] || null
  },

  async update(
  id: string,
  userId: string,
  data: Partial<{
    title: string
    content: string
    tags: string[]
    mood_valence: number
    mood_arousal: number
  }>
): Promise<Journal | null> {
  const result = await db.query<Journal>(
    `UPDATE journals 
     SET title = $1, content = $2, tags = $3,
         mood_valence = $4, mood_arousal = $5
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [
      data.title,
      data.content,
      data.tags,
      data.mood_valence,
      data.mood_arousal,
      id,
      userId,
    ]
  )
  return result[0] || null
},


  async delete(id: string, userId: string): Promise<{ id: string } | null> {
    const result = await db.query<{ id: string }>(
      `DELETE FROM journals 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    )
    return result[0] || null
  },
   async getAIResponse(journalId: string, userId: string): Promise<JournalCoachResponse | null> {
    const result = await db.queryOne<{
      empathy: string;
      reframe: string;
      actions: any;
      risk: string;
    }>(
      `SELECT empathy, reframe, actions, risk 
       FROM journal_ai_responses 
       WHERE journal_id = $1 AND user_id = $2`,
      [journalId, userId]
    );
    
    if (!result) return null;
    
    return {
      empathy: result.empathy,
      reframe: result.reframe,
      actions: result.actions,
      risk: result.risk as 'none' | 'low' | 'med' | 'high'
    };
    
  },
  
  async saveAIResponse(
    journalId: string, 
    userId: string, 
    response: JournalCoachResponse
  ): Promise<void> {
    await db.query(
      `INSERT INTO journal_ai_responses (journal_id, user_id, empathy, reframe, actions, risk)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (journal_id) 
       DO UPDATE SET empathy = EXCLUDED.empathy, 
                     reframe = EXCLUDED.reframe,
                     actions = EXCLUDED.actions,
                     risk = EXCLUDED.risk`,
      [journalId, userId, response.empathy, response.reframe, 
       JSON.stringify(response.actions), response.risk]
    );
  },
   async getAudioCache(journalId: string, language: string): Promise<string | null> {
    const result = await db.queryOne<{ audio_cache: any }>(
      `SELECT audio_cache FROM journal_ai_responses 
       WHERE journal_id = $1`,
      [journalId]
    );
    
    if (!result || !result.audio_cache) return null;
    
    return result.audio_cache[language] || null;
  },
  
async saveAudioCache(
  journalId: string,
  language: string,
  audioUrl: string
): Promise<void> {
  await db.query(
    `UPDATE journal_ai_responses 
     SET audio_cache = COALESCE(audio_cache, '{}'::jsonb) || jsonb_build_object($2::text, $3::text)
     WHERE journal_id = $1`,
    [journalId, language, audioUrl]
  );
},


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
