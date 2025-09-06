"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const aiplatform_1 = require("@google-cloud/aiplatform");
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const config_1 = __importDefault(require("./config"));
let aiClient = null;
let ttsClient = null;
function getAIClient() {
    if (!aiClient && config_1.default.enableAI && config_1.default.gcpProjectId) {
        aiClient = new aiplatform_1.v1beta1.PredictionServiceClient({
            apiEndpoint: `${config_1.default.gcpLocation}-aiplatform.googleapis.com`,
        });
    }
    return aiClient;
}
function getTTSClient() {
    if (!ttsClient && config_1.default.enableTTS) {
        ttsClient = new text_to_speech_1.TextToSpeechClient();
    }
    return ttsClient;
}
async function callGemini(prompt, systemPrompt) {
    if (!config_1.default.enableAI || !config_1.default.gcpProjectId) {
        return "AI is currently disabled. This is a mock response for development.";
    }
    try {
        const client = getAIClient();
        const model = `projects/${config_1.default.gcpProjectId}/locations/${config_1.default.gcpLocation}/publishers/google/models/${config_1.default.geminiModel}`;
        const contents = [
            ...(systemPrompt ? [{ role: 'system', parts: [{ text: systemPrompt }] }] : []),
            { role: 'user', parts: [{ text: prompt }] },
        ];
        const [response] = await client.generateContent({
            model,
            contents,
        });
        const candidates = response?.candidates || [];
        for (const candidate of candidates) {
            const parts = candidate?.content?.parts || [];
            const text = parts.map(p => p?.text || '').join(' ').trim();
            if (text)
                return text;
        }
        return "AI response generated successfully.";
    }
    catch (error) {
        console.error('AI call failed:', error);
        return "I'm here to help, but I'm having trouble right now. Please try again.";
    }
}
exports.ai = {
    async journalCoach(request) {
        const systemPrompt = `You are an empathetic mental health peer supporter for Indian youth. 
    Provide validation, gentle reframing, and practical micro-actions. 
    You are NOT a therapist. Always remind users to seek professional help for serious concerns.
    
    Response format:
    1. EMPATHY: Validate their feelings (2-3 sentences)
    2. REFRAME: Offer gentle perspective (1-2 sentences)  
    3. ACTIONS: Two specific 10-20 minute activities
    
    Keep language warm, culturally sensitive, and youth-friendly.`;
        const userPrompt = `User's journal entry: "${request.text}"
    Language preference: ${request.language_pref || 'English'}
    Tone preference: ${request.tone_pref || 'warm and supportive'}`;
        const response = await callGemini(userPrompt, systemPrompt);
        // Simple risk assessment
        const text = request.text.toLowerCase();
        const highRisk = ['suicide', 'kill myself', 'end it all', 'better off dead'];
        const medRisk = ['hopeless', 'worthless', 'give up', "can't go on"];
        const lowRisk = ['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'];
        let risk = 'none';
        if (highRisk.some(keyword => text.includes(keyword)))
            risk = 'high';
        else if (medRisk.some(keyword => text.includes(keyword)))
            risk = 'med';
        else if (lowRisk.some(keyword => text.includes(keyword)))
            risk = 'low';
        // Parse response or provide fallback
        const empathy = "I hear that you're sharing something important, and I want you to know that your feelings are completely valid.";
        const reframe = "Sometimes difficult moments can feel overwhelming, but they're also temporary and can lead to growth.";
        const actions = [
            {
                title: "5-Minute Breathing",
                steps: ["Find a quiet spot", "Breathe in for 4 counts", "Hold for 2 counts", "Exhale for 6 counts", "Repeat for 5 minutes"],
                duration_mins: 5,
                category: "grounding"
            },
            {
                title: "Three Good Things",
                steps: ["Think of 3 positive moments from today", "Write each one down", "Note why each was meaningful"],
                duration_mins: 10,
                category: "cognitive"
            }
        ];
        return { empathy, reframe, actions, risk };
    },
    async generateWeeklySummary(userId, withAudio = false) {
        const systemPrompt = `Create a youth-friendly weekly emotional summary. 
    Use engaging metaphors and acknowledge their journey. 
    Keep under 150 words. Be encouraging and insightful.`;
        const userPrompt = `Generate a weekly summary for user reflecting on their emotional journey this week.`;
        const summary_text = await callGemini(userPrompt, systemPrompt);
        let audio_url;
        if (withAudio && config_1.default.enableTTS) {
            try {
                const tts = getTTSClient();
                const [response] = await tts.synthesizeSpeech({
                    input: { text: summary_text },
                    voice: { languageCode: 'en-IN', name: config_1.default.ttsVoice },
                    audioConfig: { audioEncoding: 'MP3' },
                });
                if (response.audioContent) {
                    const audioBase64 = Buffer.from(response.audioContent).toString('base64');
                    audio_url = `data:audio/mp3;base64,${audioBase64}`;
                }
            }
            catch (error) {
                console.error('TTS generation failed:', error);
            }
        }
        return {
            summary_text,
            audio_url,
            metaphor: "Your week looked like a gentle river with both calm pools and energizing rapids."
        };
    },
    async checkDistress(text) {
        const lowerText = text.toLowerCase();
        const highRisk = ['suicide', 'kill myself', 'end it all', 'better off dead'];
        const medRisk = ['hopeless', 'worthless', 'give up', "can't go on"];
        const lowRisk = ['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'];
        let risk = 'none';
        const reasons = [];
        if (highRisk.some(keyword => lowerText.includes(keyword))) {
            risk = 'high';
            reasons.push('Expressions of self-harm or suicidal thoughts detected');
        }
        else if (medRisk.some(keyword => lowerText.includes(keyword))) {
            risk = 'med';
            reasons.push('Significant emotional distress and hopelessness indicated');
        }
        else if (lowRisk.some(keyword => lowerText.includes(keyword))) {
            risk = 'low';
            reasons.push('Common stress and emotional challenges identified');
        }
        const helplines = [
            { name: "Tele-MANAS", phone: "14416", available: "24/7" },
            { name: "Kiran Mental Health Helpline", phone: "1800-599-0019", available: "24/7" },
            { name: "iCall Psychosocial Helpline", phone: "022-25521111", available: "Mon-Sat, 8 AM - 10 PM" }
        ];
        const suggestions = {
            none: "Continue taking care of yourself with healthy habits and social connections.",
            low: "Try some stress management techniques and consider talking to someone you trust.",
            med: "Please consider reaching out to a mental health professional or trusted adult.",
            high: "Please contact a crisis helpline immediately or go to your nearest emergency room."
        };
        return {
            risk,
            reasons,
            helplines: risk === 'none' ? [] : helplines,
            suggest_next_step: suggestions[risk]
        };
    }
};
exports.default = exports.ai;
