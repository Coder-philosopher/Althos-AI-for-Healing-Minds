// functions/tests.ts
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import db from '../db';
import { TestRequest, TestResponse, TestInsightsResponse } from '../types';
import { scorePHQ9, scoreGAD7, isValidTestAnswers, AppError } from '../utils';
import { testExplanations } from '../copy';

// CORS
function setCors(res: any, origin?: string) {
  const allowed = ['althos.nitrr.in', 'http://localhost:3000'];
  const o = origin || '';
  if (allowed.some(a => o.includes(a.replace('*', '')))) res.set('Access-Control-Allow-Origin', o);
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  res.set('Access-Control-Max-Age', '3600');
}
const userIdFrom = (req: any) =>
  (req.headers['x-user-id'] as string) || process.env.DEMO_USER_ID || '550e8400-e29b-41d4-a716-446655440000';

function mapBandToStrength(avg: number): 'weak' | 'moderate' | 'strong' {
  // Lower average scores → stronger (positive) signal
  if (avg < 5) return 'strong';
  if (avg < 10) return 'moderate';
  return 'weak';
}

export const testPHQ9: HttpFunction = async (req, res) => {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const userId = userIdFrom(req);
    const { answers }: TestRequest = req.body;
    if (!isValidTestAnswers(answers, 'phq9')) throw new AppError('PHQ-9 needs 9 answers (0–3)', 400);

    const { score, severity } = scorePHQ9(answers);
    const explain = testExplanations.phq9;

    const created = await db.tests.create(userId, {
      type: 'phq9',
      score,
      answers,
      severity_band: severity,
    });

    const suggestion =
      severity === 'minimal'
        ? 'Keep up healthy routines and supportive connections.'
        : severity === 'mild'
        ? 'Try stress-management (breathing, walks) and talk to someone you trust.'
        : 'Consider speaking with a mental health professional.';

    const resp: TestResponse = {
      id: created.id,
      score,
      severity_band: severity,
      explanation: `Your PHQ-9 score is ${score}, suggesting ${explain.severityBands[
        severity as keyof typeof explain.severityBands
      ]?.description || severity}. ${explain.disclaimer}`,
      suggestion,
    };
    return res.json({ success: true, data: resp });
  } catch (e: any) {
    const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
    return res.status(code).json({ success: false, message: e?.message || 'Error' });
  }
};

export const testGAD7: HttpFunction = async (req, res) => {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const userId = userIdFrom(req);
    const { answers }: TestRequest = req.body;
    if (!isValidTestAnswers(answers, 'gad7')) throw new AppError('GAD-7 needs 7 answers (0–3)', 400);

    const { score, severity } = scoreGAD7(answers);
    const explain = testExplanations.gad7;

    const created = await db.tests.create(userId, {
      type: 'gad7',
      score,
      answers,
      severity_band: severity,
    });

    const suggestion =
      severity === 'minimal'
        ? 'Anxiety seems manageable—continue current coping strategies.'
        : severity === 'mild'
        ? 'Try relaxation (breathing, mindfulness) and short movement breaks.'
        : 'Consider speaking with a counselor about anxiety management.';

    const resp: TestResponse = {
      id: created.id,
      score,
      severity_band: severity,
      explanation: `Your GAD-7 score is ${score}, suggesting ${explain.severityBands[
        severity as keyof typeof explain.severityBands
      ]?.description || severity}. ${explain.disclaimer}`,
      suggestion,
    };
    return res.json({ success: true, data: resp });
  } catch (e: any) {
    const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
    return res.status(code).json({ success: false, message: e?.message || 'Error' });
  }
};

export const testInsights: HttpFunction = async (req, res) => {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const userId = userIdFrom(req);
    const days = Math.min(parseInt((req.query.days as string) || '30', 10), 90);
    const insights = await db.tests.getInsights(userId, days);

    const correlations: TestInsightsResponse['correlations'] = [];
    if (insights.trends.length >= 2) {
      const phq9 = insights.trends.filter(t => t.type === 'phq9');
      const gad7 = insights.trends.filter(t => t.type === 'gad7');

      if (phq9.length >= 2) {
        const avg = phq9.reduce((s, t) => s + t.score, 0) / phq9.length;
        correlations.push({
          note: `Average PHQ-9 over ${days} days: ${avg.toFixed(1)}`,
          strength: mapBandToStrength(avg),
        });
      }
      if (gad7.length >= 2) {
        const avg = gad7.reduce((s, t) => s + t.score, 0) / gad7.length;
        correlations.push({
          note: `Average GAD-7 over ${days} days: ${avg.toFixed(1)}`,
          strength: mapBandToStrength(avg),
        });
      }
    }

    const resp: TestInsightsResponse = {
      trends: insights.trends.map(t => ({ date: t.date, ...(t.type === 'phq9' ? { phq9: t.score } : { gad7: t.score }) })),
      correlations,
    };
    return res.json({ success: true, data: resp });
  } catch (e: any) {
    const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
    return res.status(code).json({ success: false, message: e?.message || 'Error' });
  }
};

export const testHistory: HttpFunction = async (req, res) => {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const userId = userIdFrom(req);
    const type = (req.query.type as string) || undefined;
    const limit = Math.min(parseInt((req.query.limit as string) || '10', 10), 50);
    const tests = await db.tests.findByUser(userId, type, limit);
    return res.json({ success: true, data: tests, filters: { type: type || 'all', limit } });
  } catch (e: any) {
    const code = typeof e?.statusCode === 'number' ? e.statusCode : 500;
    return res.status(code).json({ success: false, message: e?.message || 'Error' });
  }
};
