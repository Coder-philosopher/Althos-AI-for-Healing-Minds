"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
exports.callGemini = callGemini;
const aiplatform_1 = require("@google-cloud/aiplatform");
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const config_1 = __importDefault(require("./config"));
const copy_1 = require("./copy");
let genClient = null;
let ttsClient = null;
function getGenClient() {
    if (!genClient) {
        genClient = new aiplatform_1.v1beta1.PredictionServiceClient({
            apiEndpoint: `${config_1.default.geminiLocation}-aiplatform.googleapis.com`,
        });
    }
    return genClient;
}
function getTTS() {
    if (!ttsClient)
        ttsClient = new text_to_speech_1.TextToSpeechClient();
    return ttsClient;
}
function extractText(resp) {
    const candidates = resp?.candidates || [];
    for (const c of candidates) {
        const parts = c?.content?.parts || [];
        const text = parts.map((p) => (p?.text ?? '')).join(' ').trim();
        if (text)
            return text;
    }
    return '';
}
async function callGemini(userPrompt, systemPrompt = '') {
    const client = getGenClient();
    const model = `projects/${config_1.default.gcpProjectId}/locations/${config_1.default.geminiLocation}/publishers/google/models/${config_1.default.geminiModel}`;
    const contents = [
        ...(systemPrompt ? [{ role: 'system', parts: [{ text: systemPrompt }] }] : []),
        { role: 'user', parts: [{ text: userPrompt }] },
    ];
    const [response] = await client.generateContent({
        model,
        contents,
    });
    return extractText(response) || '...';
}
async function synthesize(text) {
    const tts = getTTS();
    const [resp] = await tts.synthesizeSpeech({
        input: { text },
        voice: { languageCode: 'en-IN', name: config_1.default.ttsVoice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 0.0 },
    });
    if (!resp.audioContent)
        throw new Error('TTS failed');
    return `data:audio/mp3;base64,${Buffer.from(resp.audioContent).toString('base64')}`;
}
exports.ai = {
    async journalCoach(req) {
        const sys = copy_1.prompts.journalCoach;
        const user = `Entry: "${req.text}"\nLanguage: ${req.language_pref || 'English/Hinglish'}\nTone: ${req.tone_pref || 'warm'}\n${req.context ? `Context: ${JSON.stringify(req.context)}` : ''}`;
        const text = await callGemini(user, sys);
        const actions = [
            {
                title: '5-Minute Breathing',
                steps: ['Sit comfortably', 'Inhale 4s', 'Hold 2s', 'Exhale 6s', 'Repeat 5 min'],
                duration_mins: 5, category: 'grounding',
            },
            {
                title: 'Three Good Things',
                steps: ['Recall 3 positives', 'Write 1–2 lines each', 'Note why each mattered'],
                duration_mins: 10, category: 'cognitive',
            },
        ];
        const t = req.text.toLowerCase();
        const high = ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point'];
        const med = ['hopeless', 'worthless', 'give up', "can't go on", 'hate myself'];
        let risk = 'none';
        if (high.some(k => t.includes(k)))
            risk = 'high';
        else if (med.some(k => t.includes(k)))
            risk = 'med';
        else if (['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'].some(k => t.includes(k)))
            risk = 'low';
        const empathy = text.split('\n').slice(0, 3).join(' ').trim() || 'Thanks for sharing—those feelings are valid.';
        const reframe = 'A gentle reframe: this moment can pass, and small steps can help regain footing.';
        return { empathy, reframe, actions, risk };
    },
    async generateCoping(req) {
        const sys = copy_1.prompts.copingGenerator;
        const user = `Goal: ${req.goal}\nTime: ${req.time_avail_mins || 15} mins\nConstraints: ${req.constraints?.join(', ') || 'none'}\nEnvironment: ${req.environment || 'flexible'}`;
        await callGemini(user, sys);
        const actions = [
            { title: '5-4-3-2-1', steps: ['5 see', '4 touch', '3 hear', '2 smell', '1 taste'], duration_mins: 5, category: 'grounding' },
            { title: 'PMR Short', steps: ['Tense toes→release', 'Calves→release', 'Thighs→release', 'Deep breath'], duration_mins: 10, category: 'physical' },
            { title: '10-Min Sprint', steps: ['Pick tiny task', 'Timer 10m', 'No multitask', 'Celebrate'], duration_mins: 10, category: 'behavioral' },
        ];
        return { actions };
    },
    async generateWeeklySummary(req) {
        const sys = copy_1.prompts.weeklySummary;
        const user = `Period: ${req.from_date || 'last week'} → ${req.to_date || 'this week'}\nUnder 150 words, metaphor, 1 win + 1 gentle suggestion.`;
        const summary_text = await callGemini(user, sys);
        const audio_url = (req.with_audio && config_1.default.enableTTS) ? await synthesize(summary_text) : undefined;
        return {
            summary_text,
            audio_url,
            metaphor: 'Your week looked like a monsoon with clear patches—intense yet moving forward.',
            period: {
                from: req.from_date || new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10),
                to: req.to_date || new Date().toISOString().slice(0, 10),
            },
        };
    },
    async extractKindness(req) {
        const sys = copy_1.prompts.kindnessExtractor;
        const user = `Extract 3–5 uplifting highlights from recent entries within ${req.days_back || 7} days. Keep authentic phrasing.`;
        await callGemini(user, sys);
        return {
            positives: [
                { text: 'Helped a classmate with revisions', source_date: new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10), journal_id: 'demo-1' },
                { text: 'Roommate made chai when stressed', source_date: new Date(Date.now() - 4 * 864e5).toISOString().slice(0, 10), journal_id: 'demo-2' },
                { text: 'Kept a steadier sleep schedule', source_date: new Date(Date.now() - 1 * 864e5).toISOString().slice(0, 10), journal_id: 'demo-3' },
            ],
            caption: 'These small kindnesses show strength and care—worth celebrating even on tough weeks.',
        };
    },
    async checkDistress(req) {
        const sys = copy_1.prompts.distressTriage;
        const user = `Assess the text for risk: "${req.text}". Return conservative triage + one-line next step.`;
        await callGemini(user, sys);
        const t = req.text.toLowerCase();
        const high = ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point'];
        const med = ['hopeless', 'worthless', 'give up', "can't go on", 'hate myself'];
        let risk = 'none';
        if (high.some(k => t.includes(k)))
            risk = 'high';
        else if (med.some(k => t.includes(k)))
            risk = 'med';
        else if (['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'].some(k => t.includes(k)))
            risk = 'low';
        const msg = copy_1.riskLevelMessages[risk];
        return {
            risk,
            reasons: [msg.message],
            helplines: copy_1.helplines.slice(0, 3),
            suggest_next_step: msg.suggest,
        };
    },
    async generateClinicianSummary(userId, windowDays = 30) {
        const sys = copy_1.prompts.clinicianSummary;
        const user = `Create SOAP-style summary for user ${userId}, last ${windowDays} days, with Indian youth context and protective factors.`;
        const text = await callGemini(user, sys);
        return text || 'Summary generated.';
    },
};
exports.default = exports.ai;
