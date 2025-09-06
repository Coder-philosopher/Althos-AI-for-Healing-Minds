// Utility functions for the backend

import { v4 as uuidv4 } from 'uuid';

// Generate unique IDs
export function generateId(): string {
  return uuidv4();
}

// Generate random tokens for sharing
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setTime(result.getTime() + (minutes * 60 * 1000));
  return result;
}

export function getWeekBounds(date: Date = new Date()): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  
  return {
    start: formatDate(monday),
    end: formatDate(sunday)
  };
}

// Scoring utilities for mental health tests
export function scorePHQ9(answers: number[]): { score: number; severity: string } {
  if (answers.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 answers');
  }
  
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  let severity: string;
  
  if (score <= 4) severity = 'minimal';
  else if (score <= 9) severity = 'mild';
  else if (score <= 14) severity = 'moderate';
  else if (score <= 19) severity = 'moderately severe';
  else severity = 'severe';
  
  return { score, severity };
}

export function scoreGAD7(answers: number[]): { score: number; severity: string } {
  if (answers.length !== 7) {
    throw new Error('GAD-7 requires exactly 7 answers');
  }
  
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  let severity: string;
  
  if (score <= 4) severity = 'minimal';
  else if (score <= 9) severity = 'mild';
  else if (score <= 14) severity = 'moderate';
  else severity = 'severe';
  
  return { score, severity };
}

// Simple clustering algorithm for mood data
export interface MoodPoint {
  valence: number;
  arousal: number;
  date: string;
}

export interface Cluster {
  id: number;
  center: { valence: number; arousal: number };
  days: string[];
  color?: string;
}

export function clusterMoods(moods: MoodPoint[], k: number = 3): Cluster[] {
  if (moods.length === 0) return [];
  if (moods.length <= k) {
    return moods.map((mood, index) => ({
      id: index,
      center: { valence: mood.valence, arousal: mood.arousal },
      days: [mood.date],
      color: getClusterColor(index)
    }));
  }

  // Initialize centroids randomly
  const centroids = initializeCentroids(moods, k);
  const maxIterations = 10;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign points to clusters
    const clusters: Array<{ center: { valence: number; arousal: number }; points: MoodPoint[] }> = 
      centroids.map(centroid => ({ center: centroid, points: [] }));
    
    moods.forEach(mood => {
      let minDistance = Infinity;
      let assignedCluster = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(
          { valence: mood.valence, arousal: mood.arousal },
          centroid
        );
        if (distance < minDistance) {
          minDistance = distance;
          assignedCluster = index;
        }
      });
      
      clusters[assignedCluster].points.push(mood);
    });
    
    // Update centroids
    let converged = true;
    clusters.forEach((cluster, index) => {
      if (cluster.points.length > 0) {
        const newCentroid = {
          valence: cluster.points.reduce((sum, p) => sum + p.valence, 0) / cluster.points.length,
          arousal: cluster.points.reduce((sum, p) => sum + p.arousal, 0) / cluster.points.length
        };
        
        if (euclideanDistance(centroids[index], newCentroid) > 0.01) {
          converged = false;
        }
        centroids[index] = newCentroid;
      }
    });
    
    if (converged) break;
  }
  
  // Final assignment and create result
  const result: Cluster[] = centroids.map((centroid, index) => ({
    id: index,
    center: centroid,
    days: [],
    color: getClusterColor(index)
  }));
  
  moods.forEach(mood => {
    let minDistance = Infinity;
    let assignedCluster = 0;
    
    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(
        { valence: mood.valence, arousal: mood.arousal },
        centroid
      );
      if (distance < minDistance) {
        minDistance = distance;
        assignedCluster = index;
      }
    });
    
    result[assignedCluster].days.push(mood.date);
  });
  
  return result.filter(cluster => cluster.days.length > 0);
}

function initializeCentroids(points: MoodPoint[], k: number): Array<{ valence: number; arousal: number }> {
  const centroids: Array<{ valence: number; arousal: number }> = [];
  
  // Use k-means++ initialization
  const firstIndex = Math.floor(Math.random() * points.length);
  centroids.push({
    valence: points[firstIndex].valence,
    arousal: points[firstIndex].arousal
  });
  
  for (let i = 1; i < k; i++) {
    const distances = points.map(point => {
      let minDist = Infinity;
      centroids.forEach(centroid => {
        const dist = euclideanDistance(
          { valence: point.valence, arousal: point.arousal },
          centroid
        );
        if (dist < minDist) minDist = dist;
      });
      return minDist * minDist;
    });
    
    const totalDist = distances.reduce((sum, d) => sum + d, 0);
    const random = Math.random() * totalDist;
    
    let cumulativeDist = 0;
    for (let j = 0; j < distances.length; j++) {
      cumulativeDist += distances[j];
      if (cumulativeDist >= random) {
        centroids.push({
          valence: points[j].valence,
          arousal: points[j].arousal
        });
        break;
      }
    }
  }
  
  return centroids;
}

function euclideanDistance(
  a: { valence: number; arousal: number },
  b: { valence: number; arousal: number }
): number {
  return Math.sqrt(Math.pow(a.valence - b.valence, 2) + Math.pow(a.arousal - b.arousal, 2));
}

function getClusterColor(index: number): string {
  const colors = [
    '#10B981', // emerald-500
    '#3B82F6', // blue-500  
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#06B6D4'  // cyan-500
  ];
  return colors[index % colors.length];
}

// Text processing utilities
export function extractKeywords(text: string, maxKeywords: number = 5): string[] {
  // Simple keyword extraction - in production, you might use more sophisticated NLP
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordCounts = words.reduce((counts: { [key: string]: number }, word) => {
    counts[word] = (counts[word] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

// Validation utilities
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidMoodValue(value: number, type: 'valence' | 'arousal'): boolean {
  if (type === 'valence') {
    return Number.isInteger(value) && value >= -2 && value <= 2;
  } else {
    return typeof value === 'number' && value >= 0 && value <= 1;
  }
}

export function isValidTestAnswers(answers: number[], testType: 'phq9' | 'gad7'): boolean {
  const expectedLength = testType === 'phq9' ? 9 : 7;
  if (answers.length !== expectedLength) return false;
  
  return answers.every(answer => 
    Number.isInteger(answer) && answer >= 0 && answer <= 3
  );
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Error handling
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function createErrorResponse(error: AppError | Error, includeStack: boolean = false) {
  const response: any = {
    success: false,
    message: error.message
  };

  if (error instanceof AppError) {
    response.statusCode = error.statusCode;
  }

  if (includeStack && process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return response;
}

// Safe JSON parsing
export function safeJsonParse(jsonString: string, defaultValue: any = null): any {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

export default {
  generateId,
  generateToken,
  formatDate,
  addDays,
  addMinutes,
  getWeekBounds,
  scorePHQ9,
  scoreGAD7,
  clusterMoods,
  extractKeywords,
  isValidDate,
  isValidMoodValue,
  isValidTestAnswers,
  checkRateLimit,
  AppError,
  createErrorResponse,
  safeJsonParse
};