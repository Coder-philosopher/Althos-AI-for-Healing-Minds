import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { ai } from '../ai';
import db from '../db';
import {
  JournalCoachRequest,
  JournalCoachResponse,
  CopingRequest,
  CopingResponse,
  WeeklySummaryRequest,
  WeeklySummaryResponse,
  KindnessRequest,
  KindnessResponse,
  DistressCheckRequest,
  DistressCheckResponse
} from '../types';
import { AppError, getWeekBounds } from '../utils';

// CORS helper
const setCorsHeaders = (res: any, origin?: string) => {
  const allowedOrigins = ['https://althos.nitrr.in', 'http://localhost:3000'];
  const requestOrigin = origin || '';
  
  if (allowedOrigins.some(allowed => requestOrigin.includes(allowed.replace('*', '')))) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
  }
  
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  res.set('Access-Control-Max-Age', '3600');
};

const getUserId = (req: any): string => {
  return req.headers['x-user-id'] || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
};

const handleError = (res: any, error: any) => {
  console.error('AI Function error:', error);
  
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

// Journal Coaching AI Function
export const aiJournalCoach: HttpFunction = async (req, res) => {
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
    const request: JournalCoachRequest = req.body;

    if (!request.text || request.text.trim().length === 0) {
      throw new AppError('Text is required for coaching', 400);
    }

    const response = await ai.journalCoach(request);

    // Log high-risk interactions
    if (response.risk === 'high' || response.risk === 'med') {
      await db.alerts.create(userId, {
        risk_level: response.risk,
        context_text: request.text.substring(0, 500)
      });
    }

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_journal_coach',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Coping Strategies Generator Function
export const aiCoping: HttpFunction = async (req, res) => {
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
    const request: CopingRequest = req.body;

    if (!request.goal || request.goal.trim().length === 0) {
      throw new AppError('Goal is required for coping strategies', 400);
    }

    const response = await ai.generateCoping(request);

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_coping',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Weekly Summary Generator Function
export const aiWeeklySummary: HttpFunction = async (req, res) => {
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
    const request: WeeklySummaryRequest = req.body;

    const { start, end } = getWeekBounds();
    const weeklyRequest = {
      ...request,
      from_date: request.from_date || start,
      to_date: request.to_date || end
    };

    const response = await ai.generateWeeklySummary(weeklyRequest);

    // Save to database
    await db.weeklySummaries.create(userId, {
      from_date: response.period.from,
      to_date: response.period.to,
      summary_text: response.summary_text,
      audio_url: response.audio_url,
      metaphor: response.metaphor
    });

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_weekly_summary',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Kindness Highlights Extractor Function
export const aiKindness: HttpFunction = async (req, res) => {
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
    const request: KindnessRequest = req.body;

    const response = await ai.extractKindness(request);

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_kindness',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Grounding Exercises Generator Function
export const aiGrounding: HttpFunction = async (req, res) => {
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
    const { duration_secs = 60, context = 'general' } = req.body;

    const response = {
      script: `Let's take ${Math.floor(duration_secs / 60)} minutes to ground yourself and return to the present moment.`,
      steps: [
        { ts: 0, text: 'Find a comfortable position, sitting or standing' },
        { ts: 10, text: 'Take three slow, deep breaths, feeling your body settle' },
        { ts: 25, text: 'Notice 5 things you can see around you right now' },
        { ts: 35, text: 'Notice 4 things you can physically touch or feel' },
        { ts: 45, text: 'Notice 3 sounds you can hear in your environment' },
        { ts: 55, text: 'Take one more deep breath and gently return your attention to the present' }
      ]
    };

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_grounding',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};

// Distress Detection Function
export const aiDistressCheck: HttpFunction = async (req, res) => {
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
    const request: DistressCheckRequest = req.body;

    if (!request.text || request.text.trim().length === 0) {
      throw new AppError('Text is required for distress check', 400);
    }

    const response = await ai.checkDistress(request);

    // Create alert if medium or high risk
    if (response.risk === 'med' || response.risk === 'high') {
      await db.alerts.create(userId, {
        risk_level: response.risk,
        reasons: response.reasons,
        context_text: request.text.substring(0, 500)
      });
    }

    await db.accessLogs.create({
      user_id: userId,
      actor: 'system',
      action: 'ai_distress_check',
      resource: 'ai',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      data: response
    });

  } catch (error) {
    return handleError(res, error);
  }
};