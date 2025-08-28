import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { ai } from '../ai';
import db from '../db';
import {
  ShareRequest,
  ShareResponse,
  ClinicianSummaryResponse
} from '../types';
import { 
  generateToken,
  addMinutes,
  formatDate,
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
  console.error('Shares Function error:', error);
  
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

// Create Shareable Link Function
export const shareCreate: HttpFunction = async (req, res) => {
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
    const { 
      scopes = ['summary', 'tests', 'mood'], 
      window_days = 30, 
      expires_mins = 60 
    }: ShareRequest = req.body;

    const token = generateToken(32);
    const expiresAt = addMinutes(new Date(), expires_mins);

    const share = await db.shares.create(userId, {
      token,
      scopes,
      window_days,
      expires_at: expiresAt
    });

    const shareUrl = `${req.get('x-forwarded-proto') || 'https'}://${req.get('host')}/share/${token}`;

    await db.accessLogs.create({
      user_id: userId,
      actor: 'user',
      action: 'create_share',
      resource: 'share',
      token,
      ip_address: req.ip
    });

    const response: ShareResponse = {
      id: share.id,
      token,
      url: shareUrl,
      expires_at: expiresAt
    };

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Get Clinician Summary Function (Public - uses token auth)
export const shareSummary: HttpFunction = async (req, res) => {
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
    const token = req.query.token as string || req.params?.token;
    
    if (!token) {
      throw new AppError('Share token is required', 400);
    }

    const share = await db.shares.findByToken(token);
    if (!share) {
      throw new AppError('Share link expired or invalid', 404);
    }

    // Increment access count
    await db.shares.incrementAccess(share.id);

    // Generate summary
    const summary = await ai.generateClinicianSummary(share.user_id, share.window_days);

    await db.accessLogs.create({
      user_id: share.user_id,
      actor: 'clinician',
      action: 'view_summary',
      resource: 'share',
      token,
      ip_address: req.ip
    });

    const response: ClinicianSummaryResponse = {
      patient_alias: `Patient-${share.user_id.substring(0, 8)}`,
      period: {
        from: formatDate(new Date(Date.now() - share.window_days * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date())
      },
      summary: {
        soap_text: summary,
        scores: { phq9: [], gad7: [] }, // In production, would fetch actual scores
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

  } catch (error) {
    return handleError(res, error);
  }
};

// List User's Shares Function
export const shareList: HttpFunction = async (req, res) => {
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
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
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

    const shares = await db.getMany(sql, [userId, limit]);

    return res.json({
      success: true,
      data: shares,
      filters: {
        limit,
        include_expired: includeExpired
      }
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Revoke Share Function
export const shareRevoke: HttpFunction = async (req, res) => {
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
      throw new AppError('Share ID is required', 400);
    }

    // Verify ownership before revoking
    const share = await db.getOne(
      'SELECT id FROM shares WHERE id = $1 AND user_id = $2',
      [share_id, userId]
    );

    if (!share) {
      throw new AppError('Share not found or access denied', 404);
    }

    await db.query(
      'UPDATE shares SET revoked = TRUE WHERE id = $1',
      [share_id]
    );

    await db.accessLogs.create({
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

  } catch (error) {
    return handleError(res, error);
  }
};

// Share Analytics Function (for user to see access logs)
export const shareAnalytics: HttpFunction = async (req, res) => {
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
    const shareId = req.query.share_id as string;

    if (!shareId) {
      throw new AppError('Share ID is required', 400);
    }

    // Verify ownership
    const share = await db.getOne(
      'SELECT token FROM shares WHERE id = $1 AND user_id = $2',
      [shareId, userId]
    );

    if (!share) {
      throw new AppError('Share not found or access denied', 404);
    }

    // Get access logs for this share
    const accessLogs = await db.getMany(
      `SELECT actor, action, ip_address, created_at
       FROM access_logs 
       WHERE user_id = $1 AND token = $2 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId, share.token]
    );

    return res.json({
      success: true,
      data: {
        share_id: shareId,
        access_logs: accessLogs,
        total_accesses: accessLogs.length
      }
    });

  } catch (error) {
    return handleError(res, error);
  }
};