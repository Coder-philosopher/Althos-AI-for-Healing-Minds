"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.generateId = generateId;
exports.generateToken = generateToken;
exports.formatDate = formatDate;
exports.addDays = addDays;
exports.addMinutes = addMinutes;
exports.getWeekBounds = getWeekBounds;
exports.scorePHQ9 = scorePHQ9;
exports.scoreGAD7 = scoreGAD7;
exports.clusterMoods = clusterMoods;
exports.extractKeywords = extractKeywords;
exports.isValidDate = isValidDate;
exports.isValidMoodValue = isValidMoodValue;
exports.isValidTestAnswers = isValidTestAnswers;
exports.checkRateLimit = checkRateLimit;
exports.createErrorResponse = createErrorResponse;
exports.safeJsonParse = safeJsonParse;
const uuid_1 = require("uuid");
function generateId() {
    return (0, uuid_1.v4)();
}
function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addMinutes(date, minutes) {
    const result = new Date(date);
    result.setTime(result.getTime() + (minutes * 60 * 1000));
    return result;
}
function getWeekBounds(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    return {
        start: formatDate(monday),
        end: formatDate(sunday)
    };
}
function scorePHQ9(answers) {
    if (answers.length !== 9) {
        throw new Error('PHQ-9 requires exactly 9 answers');
    }
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    let severity;
    if (score <= 4)
        severity = 'minimal';
    else if (score <= 9)
        severity = 'mild';
    else if (score <= 14)
        severity = 'moderate';
    else if (score <= 19)
        severity = 'moderately severe';
    else
        severity = 'severe';
    return { score, severity };
}
function scoreGAD7(answers) {
    if (answers.length !== 7) {
        throw new Error('GAD-7 requires exactly 7 answers');
    }
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    let severity;
    if (score <= 4)
        severity = 'minimal';
    else if (score <= 9)
        severity = 'mild';
    else if (score <= 14)
        severity = 'moderate';
    else
        severity = 'severe';
    return { score, severity };
}
function clusterMoods(moods, k = 3) {
    if (moods.length === 0)
        return [];
    if (moods.length <= k) {
        return moods.map((mood, index) => ({
            id: index,
            center: { valence: mood.valence, arousal: mood.arousal },
            days: [mood.date],
            color: getClusterColor(index)
        }));
    }
    const centroids = initializeCentroids(moods, k);
    const maxIterations = 10;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const clusters = centroids.map(centroid => ({ center: centroid, points: [] }));
        moods.forEach(mood => {
            let minDistance = Infinity;
            let assignedCluster = 0;
            centroids.forEach((centroid, index) => {
                const distance = euclideanDistance({ valence: mood.valence, arousal: mood.arousal }, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    assignedCluster = index;
                }
            });
            clusters[assignedCluster].points.push(mood);
        });
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
        if (converged)
            break;
    }
    const result = centroids.map((centroid, index) => ({
        id: index,
        center: centroid,
        days: [],
        color: getClusterColor(index)
    }));
    moods.forEach(mood => {
        let minDistance = Infinity;
        let assignedCluster = 0;
        centroids.forEach((centroid, index) => {
            const distance = euclideanDistance({ valence: mood.valence, arousal: mood.arousal }, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                assignedCluster = index;
            }
        });
        result[assignedCluster].days.push(mood.date);
    });
    return result.filter(cluster => cluster.days.length > 0);
}
function initializeCentroids(points, k) {
    const centroids = [];
    const firstIndex = Math.floor(Math.random() * points.length);
    centroids.push({
        valence: points[firstIndex].valence,
        arousal: points[firstIndex].arousal
    });
    for (let i = 1; i < k; i++) {
        const distances = points.map(point => {
            let minDist = Infinity;
            centroids.forEach(centroid => {
                const dist = euclideanDistance({ valence: point.valence, arousal: point.arousal }, centroid);
                if (dist < minDist)
                    minDist = dist;
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
function euclideanDistance(a, b) {
    return Math.sqrt(Math.pow(a.valence - b.valence, 2) + Math.pow(a.arousal - b.arousal, 2));
}
function getClusterColor(index) {
    const colors = [
        '#10B981',
        '#3B82F6',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#06B6D4'
    ];
    return colors[index % colors.length];
}
function extractKeywords(text, maxKeywords = 5) {
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
    const wordCounts = words.reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
    }, {});
    return Object.entries(wordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, maxKeywords)
        .map(([word]) => word);
}
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}
function isValidMoodValue(value, type) {
    if (type === 'valence') {
        return Number.isInteger(value) && value >= -2 && value <= 2;
    }
    else {
        return typeof value === 'number' && value >= 0 && value <= 1;
    }
}
function isValidTestAnswers(answers, testType) {
    const expectedLength = testType === 'phq9' ? 9 : 7;
    if (answers.length !== expectedLength)
        return false;
    return answers.every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 3);
}
const rateLimitMap = new Map();
function checkRateLimit(key, maxRequests, windowMs) {
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
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function createErrorResponse(error, includeStack = false) {
    const response = {
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
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return defaultValue;
    }
}
exports.default = {
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
