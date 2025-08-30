"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.generateId = generateId;
exports.generateToken = generateToken;
exports.formatDate = formatDate;
exports.addMinutes = addMinutes;
exports.scorePHQ9 = scorePHQ9;
exports.scoreGAD7 = scoreGAD7;
exports.isValidTestAnswers = isValidTestAnswers;
exports.clusterMoods = clusterMoods;
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
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
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
function isValidTestAnswers(answers, testType) {
    const expectedLength = testType === 'phq9' ? 9 : 7;
    if (answers.length !== expectedLength)
        return false;
    return answers.every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 3);
}
function clusterMoods(moods) {
    if (moods.length === 0)
        return [];
    // Simple 3-cluster k-means approximation
    const k = Math.min(3, moods.length);
    const colors = ['#10B981', '#3B82F6', '#F59E0B'];
    // For simplicity, create clusters based on valence ranges
    const clusters = [
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
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
