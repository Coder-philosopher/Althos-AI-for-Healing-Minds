import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import db from '../db';

// CORS helper
const setCorsHeaders = (res: any, origin?: string) => {
  const allowedOrigins = ['https://your-frontend.vercel.app', 'http://localhost:3000'];
  const requestOrigin = origin || '';
  
  if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
  }
  
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  res.set('Access-Control-Max-Age', '3600');
};

const getUserId = (req: any): string => {
  return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};

// Health Check Function
export const healthCheck: HttpFunction = async (req, res) => {
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
    const dbHealth = await db.healthCheck();
    const timestamp = new Date().toISOString();

    return res.json({
      success: true,
      timestamp,
      database: dbHealth ? 'connected' : 'disconnected',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      function_name: 'health-check'
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      database: 'error',
      version: '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// User Info Function
export const whoami: HttpFunction = async (req, res) => {
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
    let user = await db.users.findById(userId);
    
    // If user doesn't exist, create demo user
    if (!user) {
      await db.users.create({
        display_name: 'Demo User',
        locale: 'en-IN'
      });
      user = await db.users.findById(userId) || {
        id: userId,
        display_name: 'Demo User',
        locale: 'en-IN',
        created_at: new Date(),
        updated_at: new Date()
      };
    }

    return res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Whoami error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
};

// System Status Function (more detailed than health check)
export const systemStatus: HttpFunction = async (req, res) => {
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
    const dbHealth = await db.healthCheck();
    const timestamp = new Date().toISOString();

    // Get some basic stats
    let stats = null;
    try {
      const userCount = await db.getOne('SELECT COUNT(*) as count FROM users');
      const journalCount = await db.getOne('SELECT COUNT(*) as count FROM journals');
      const testCount = await db.getOne('SELECT COUNT(*) as count FROM tests');
      
      stats = {
        total_users: parseInt(userCount?.count || '0'),
        total_journals: parseInt(journalCount?.count || '0'),
        total_tests: parseInt(testCount?.count || '0')
      };
    } catch (statsError) {
      console.error('Stats collection error:', statsError);
    }

    return res.json({
      success: true,
      timestamp,
      database: {
        status: dbHealth ? 'connected' : 'disconnected',
        stats
      },
      services: {
        ai: process.env.ENABLE_REAL_AI === 'true' ? 'enabled' : 'mock',
        tts: process.env.ENABLE_TTS === 'true' ? 'enabled' : 'disabled'
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      region: process.env.GCP_LOCATION || 'unknown'
    });

  } catch (error) {
    console.error('System status error:', error);
    
    return res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'System status check failed'
    });
  }
};