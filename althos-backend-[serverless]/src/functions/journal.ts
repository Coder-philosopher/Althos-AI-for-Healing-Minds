import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import db from '../db';
import { 
  CreateJournalRequest, 
  CreateJournalResponse,
  Journal 
} from '../types';
import { formatDate, AppError } from '../utils';

// CORS helper for all functions
const setCorsHeaders = (res: any, origin?: string) => {
  const allowedOrigins = ['https://althos.nitrr.in', 'http://localhost:3000'];
  const requestOrigin = origin || '';
  
  if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
  }
  
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  res.set('Access-Control-Max-Age', '3600');
};

// Helper to get user ID from request
const getUserId = (req: any): string => {
  return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};

// Helper to handle errors consistently
const handleError = (res: any, error: any) => {
  console.error('Function error:', error);
  
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

// Journal Operations Cloud Function
export const journal: HttpFunction = async (req, res) => {
  setCorsHeaders(res, req.headers.origin);
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  try {
    const userId = getUserId(req);

    if (req.method === 'POST') {
      // Create journal entry
      const data: CreateJournalRequest = req.body;

      if (!data.content || data.content.trim().length === 0) {
        throw new AppError('Journal content is required', 400);
      }

      const journal = await db.journals.create(userId, {
        title: data.title,
        content: data.content,
        mood_valence: data.mood?.valence,
        mood_arousal: data.mood?.arousal,
        tags: data.tags
      });

      // If mood data provided, also create/update daily mood entry
      if (data.mood) {
        const today = formatDate(new Date());
        await db.moods.upsertDaily(userId, {
          date: today,
          valence: data.mood.valence,
          arousal: data.mood.arousal,
          source: 'journal'
        });
      }

      // Log the activity
      await db.accessLogs.create({
        user_id: userId,
        actor: 'user',
        action: 'create',
        resource: 'journal',
        ip_address: req.ip
      });

      const response: CreateJournalResponse = {
        id: journal.id,
        created_at: journal.created_at
      };

      return res.json({
        success: true,
        data: response
      });

    } else if (req.method === 'GET') {
      // Get journal entries
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

      const journals = await db.journals.findByUser(userId, limit, offset);

      return res.json({
        success: true,
        data: journals,
        pagination: {
          limit,
          offset,
          has_more: journals.length === limit
        }
      });

    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

  } catch (error) {
    return handleError(res, error);
  }
};

// Get journal by ID (separate function for better caching)
export const journalById: HttpFunction = async (req, res) => {
  setCorsHeaders(res, req.headers.origin);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  try {
    const userId = getUserId(req);
    const journalId = req.params?.id || req.query.id as string;

    if (!journalId) {
      throw new AppError('Journal ID is required', 400);
    }

    const journal = await db.getOne<Journal>(
      'SELECT * FROM journals WHERE id = $1 AND user_id = $2',
      [journalId, userId]
    );

    if (!journal) {
      throw new AppError('Journal not found', 404);
    }

    return res.json({
      success: true,
      data: journal
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Get recent journals for AI context
export const journalRecent: HttpFunction = async (req, res) => {
  setCorsHeaders(res, req.headers.origin);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  try {
    const userId = getUserId(req);
    const days = Math.min(parseInt(req.query.days as string) || 7, 30);

    const journals = await db.journals.findRecent(userId, days);

    return res.json({
      success: true,
      data: journals,
      period: {
        days_back: days,
        count: journals.length
      }
    });

  } catch (error) {
    return handleError(res, error);
  }
};