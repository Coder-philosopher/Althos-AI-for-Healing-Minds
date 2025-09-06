// ai.ts
// Requires: npm i @google-cloud/aiplatform @google-cloud/text-to-speech
import {v1beta1} from '@google-cloud/aiplatform';
import type { google } from '@google-cloud/aiplatform/build/protos/protos';
import {TextToSpeechClient} from '@google-cloud/text-to-speech';
import config from './config';
import {prompts, helplines, riskLevelMessages} from './copy';
import {
  JournalCoachRequest, JournalCoachResponse,
  CopingRequest, CopingResponse,
  WeeklySummaryRequest, WeeklySummaryResponse,
  KindnessRequest, KindnessResponse,
  DistressCheckRequest, DistressCheckResponse,
} from './types';

// Singletons for serverless efficiency
let genClient: v1beta1.PredictionServiceClient | null = null;
let ttsClient: TextToSpeechClient | null = null;

// Create or reuse Vertex AI client for the chosen region (e.g., us-central1)
function getGenClient(): v1beta1.PredictionServiceClient {
  if (!genClient) {
    genClient = new v1beta1.PredictionServiceClient({
      apiEndpoint: `${config.geminiLocation}-aiplatform.googleapis.com`,
    });
  }
  return genClient!;
}

function getTTS(): TextToSpeechClient {
  if (!ttsClient) ttsClient = new TextToSpeechClient();
  return ttsClient!;
}

// Helper: extract plain text from GenerateContentResponse
function extractText(resp: any): string {
  const candidates = resp?.candidates || [];
  for (const c of candidates) {
    const parts = c?.content?.parts || [];
    const text = parts.map((p: any) => (p?.text ?? '')).join(' ').trim();
    if (text) return text;
  }
  return '';
}

// Generic Gemini call using generateContent
export async function callGemini(userPrompt: string, systemPrompt = ''): Promise<string> {
  const client = getGenClient();
  const model = `projects/${config.gcpProjectId}/locations/${config.geminiLocation}/publishers/google/models/${config.geminiModel}`;
  const contents: google.cloud.aiplatform.v1beta1.IContent[] = [
    ...(systemPrompt ? [{ role: 'system', parts: [{ text: systemPrompt }] }] : []),
    { role: 'user', parts: [{ text: userPrompt }] },
  ];
  

  const [response] = await client.generateContent({
    model,
    contents,
  });

  return extractText(response) || '...';
}

// TTS to data URL for demo
async function synthesize(text: string): Promise<string> {
  const tts = getTTS();
  const [resp] = await tts.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'en-IN', name: config.ttsVoice },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 0.0 },
  });
  if (!resp.audioContent) throw new Error('TTS failed');
  return `data:audio/mp3;base64,${Buffer.from(resp.audioContent).toString('base64')}`;
}

// Public AI services
export const ai = {
  async journalCoach(req: JournalCoachRequest): Promise<JournalCoachResponse> {
    const sys = prompts.journalCoach;
    const user = `Entry: "${req.text}"\nLanguage: ${req.language_pref || 'English/Hinglish'}\nTone: ${req.tone_pref || 'warm'}\n${req.context ? `Context: ${JSON.stringify(req.context)}` : ''}`;
    const text = await callGemini(user, sys);

    // Simple action fallback
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

    // Keyword triage for risk
    const t = req.text.toLowerCase();
    const high = ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point'];
    const med = ['hopeless', 'worthless', 'give up', "can't go on", 'hate myself'];
    let risk: 'none' | 'low' | 'med' | 'high' = 'none';
    if (high.some(k => t.includes(k))) risk = 'high';
    else if (med.some(k => t.includes(k))) risk = 'med';
    else if (['stressed','anxious','sad','worried','overwhelmed'].some(k => t.includes(k))) risk = 'low';

    // Heuristic split of empathy/reframe (safe defaults)
    const empathy = text.split('\n').slice(0, 3).join(' ').trim() || 'Thanks for sharing—those feelings are valid.';
    const reframe = 'A gentle reframe: this moment can pass, and small steps can help regain footing.';
    return { empathy, reframe, actions, risk };
  },

  async generateCoping(req: CopingRequest): Promise<CopingResponse> {
    const sys = prompts.copingGenerator;
    const user = `Goal: ${req.goal}\nTime: ${req.time_avail_mins || 15} mins\nConstraints: ${req.constraints?.join(', ') || 'none'}\nEnvironment: ${req.environment || 'flexible'}`;
    await callGemini(user, sys); // Optionally parse into tasks later
    const actions = [
      { title: '5-4-3-2-1', steps: ['5 see','4 touch','3 hear','2 smell','1 taste'], duration_mins: 5, category: 'grounding' },
      { title: 'PMR Short', steps: ['Tense toes→release','Calves→release','Thighs→release','Deep breath'], duration_mins: 10, category: 'physical' },
      { title: '10-Min Sprint', steps: ['Pick tiny task','Timer 10m','No multitask','Celebrate'], duration_mins: 10, category: 'behavioral' },
    ];
    return { actions };
  },

  async generateWeeklySummary(req: WeeklySummaryRequest): Promise<WeeklySummaryResponse> {
    const sys = prompts.weeklySummary;
    const user = `Period: ${req.from_date || 'last week'} → ${req.to_date || 'this week'}\nUnder 150 words, metaphor, 1 win + 1 gentle suggestion.`;
    const summary_text = await callGemini(user, sys);
    const audio_url = (req.with_audio && config.enableTTS) ? await synthesize(summary_text) : undefined;
    return {
      summary_text,
      audio_url,
      metaphor: 'Your week looked like a monsoon with clear patches—intense yet moving forward.',
      period: {
        from: req.from_date || new Date(Date.now() - 6 * 864e5).toISOString().slice(0,10),
        to: req.to_date || new Date().toISOString().slice(0,10),
      },
    };
  },

  async extractKindness(req: KindnessRequest): Promise<KindnessResponse> {
    const sys = prompts.kindnessExtractor;
    const user = `Extract 3–5 uplifting highlights from recent entries within ${req.days_back || 7} days. Keep authentic phrasing.`;
    await callGemini(user, sys);
    return {
      positives: [
        { text: 'Helped a classmate with revisions', source_date: new Date(Date.now()-2*864e5).toISOString().slice(0,10), journal_id: 'demo-1' },
        { text: 'Roommate made chai when stressed', source_date: new Date(Date.now()-4*864e5).toISOString().slice(0,10), journal_id: 'demo-2' },
        { text: 'Kept a steadier sleep schedule', source_date: new Date(Date.now()-1*864e5).toISOString().slice(0,10), journal_id: 'demo-3' },
      ],
      caption: 'These small kindnesses show strength and care—worth celebrating even on tough weeks.',
    };
  },

  async checkDistress(req: DistressCheckRequest): Promise<DistressCheckResponse> {
    const sys = prompts.distressTriage;
    const user = `Assess the text for risk: "${req.text}". Return conservative triage + one-line next step.`;
    await callGemini(user, sys);

    const t = req.text.toLowerCase();
    const high = ['suicide','kill myself','end it all','better off dead','no point'];
    const med = ['hopeless','worthless','give up',"can't go on",'hate myself'];
    let risk: 'none' | 'low' | 'med' | 'high' = 'none';
    if (high.some(k => t.includes(k))) risk = 'high';
    else if (med.some(k => t.includes(k))) risk = 'med';
    else if (['stressed','anxious','sad','worried','overwhelmed'].some(k => t.includes(k))) risk = 'low';

    const msg = riskLevelMessages[risk];
    return {
      risk,
      reasons: [msg.message],
      helplines: helplines.slice(0,3),
      suggest_next_step: msg.suggest,
    };
  },

  async generateClinicianSummary(userId: string, windowDays = 30): Promise<string> {
    const sys = prompts.clinicianSummary;
    const user = `Create SOAP-style summary for user ${userId}, last ${windowDays} days, with Indian youth context and protective factors.`;
    const text = await callGemini(user, sys);
    return text || 'Summary generated.';
  },
};

export default ai;
