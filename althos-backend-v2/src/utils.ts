import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

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

export function isValidTestAnswers(answers: number[], testType: 'phq9' | 'gad7'): boolean {
  const expectedLength = testType === 'phq9' ? 9 : 7;
  if (answers.length !== expectedLength) return false;
  
  return answers.every(answer => 
    Number.isInteger(answer) && answer >= 0 && answer <= 3
  );
}

export function clusterMoods(moods: Array<{valence: number, arousal: number, date: string}>): Array<{
  id: number;
  center: {valence: number, arousal: number};
  days: string[];
  color: string;
}> {
  if (moods.length === 0) return [];
  
  // Simple 3-cluster k-means approximation
  const k = Math.min(3, moods.length);
  const colors = ['#10B981', '#3B82F6', '#F59E0B'];
  
  // For simplicity, create clusters based on valence ranges
  const clusters: Array<{
    id: number;
    center: { valence: number, arousal: number };
    days: string[];
    color: string;
  }> = [
    { id: 0, center: { valence: -1, arousal: 0.5 }, days: [], color: colors[0] },
    { id: 1, center: { valence: 0, arousal: 0.5 }, days: [], color: colors[1] },
    { id: 2, center: { valence: 1, arousal: 0.5 }, days: [], color: colors[2] }
  ];
  
  moods.forEach(mood => {
    const clusterId = mood.valence <= -0.5 ? 0 : mood.valence >= 0.5 ? 2 : 1;
    clusters[clusterId].days.push(mood.date);
  });
  
  return clusters.filter(cluster => cluster.days.length > 0);
}

export class AppError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
