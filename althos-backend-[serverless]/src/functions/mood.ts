import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import db from '../db';
import {
  MoodDailyRequest,
  MoodAtlasResponse
} from '../types';
import { 
  clusterMoods,
  isValidMoodValue,
  AppError 
} from '../utils';

// CORS helper
const setCorsHeaders = (res: any, origin?: string) => {
  const allowedOrigins = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
  const requestOrigin = origin || '';
  
  if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
  }
  
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  res.set('Access-Control-Max-Age', '3600');
};

const getUserId = (req: any): string => {
  return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};

const handleError = (res: any, error: any) => {
  console.error('Mood Function error:', error);
  
  if (error instanceof AppError) {
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

// Record Daily Mood Function
export const moodDaily: HttpFunction = async (req, res) => {
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
    const { date, valence, arousal }: MoodDailyRequest = req.body;

    if (!date || !Number.isInteger(valence) || typeof arousal !== 'number') {
      throw new AppError('Date, valence (-2 to 2), and arousal (0 to 1) are required', 400);
    }

    if (!isValidMoodValue(valence, 'valence') || !isValidMoodValue(arousal, 'arousal')) {
      throw new AppError('Valence must be -2 to 2, arousal must be 0 to 1', 400);
    }

    const mood = await db.moods.upsertDaily(userId, {
      date,
      valence,
      arousal,
      source: 'self'
    });

    await db.accessLogs.create({
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

  } catch (error) {
    return handleError(res, error);
  }
};

// Get Mood Atlas (Clustering) Function
export const moodAtlas: HttpFunction = async (req, res) => {
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
    const fromDate = req.query.from as string;
    const toDate = req.query.to as string;

    const moods = await db.moods.findByUser(userId, fromDate, toDate);
    
    if (moods.length === 0) {
      const response: MoodAtlasResponse = {
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

    const clusters = clusterMoods(moodPoints, 3);
    
    const highlights = [
      `Analyzed ${moods.length} mood entries`,
      `Found ${clusters.length} distinct mood patterns`,
      clusters.length > 0 ? `Most common mood cluster has ${Math.max(...clusters.map(c => c.days.length))} days` : ''
    ].filter(Boolean);

    const response: MoodAtlasResponse = {
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

  } catch (error) {
    return handleError(res, error);
  }
};

// Get Mood History Function
export const moodHistory: HttpFunction = async (req, res) => {
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
    const fromDate = req.query.from as string;
    const toDate = req.query.to as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 90);

    let moods;
    if (fromDate || toDate) {
      moods = await db.moods.findByUser(userId, fromDate, toDate);
    } else {
      // Get recent moods if no date range specified
      moods = await db.getMany(
        `SELECT * FROM moods_daily 
         WHERE user_id = $1 
         ORDER BY date DESC 
         LIMIT $2`,
        [userId, limit]
      );
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

  } catch (error) {
    return handleError(res, error);
  }
};

// Get Mood Trends Function
export const moodTrends: HttpFunction = async (req, res) => {
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
    const days = Math.min(parseInt(req.query.days as string) || 30, 90);

    // Get mood trends with moving averages
    const trends = await db.getMany(
      `SELECT 
         date,
         valence,
         arousal,
         AVG(valence) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as valence_7day_avg,
         AVG(arousal) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as arousal_7day_avg
       FROM moods_daily 
       WHERE user_id = $1 
       AND date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY date`,
      [userId]
    );

    // Calculate simple statistics
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

  } catch (error) {
    return handleError(res, error);
  }
};