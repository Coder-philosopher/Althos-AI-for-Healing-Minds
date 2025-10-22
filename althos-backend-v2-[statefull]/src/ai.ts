import {v1beta1} from '@google-cloud/aiplatform';
import {TextToSpeechClient} from '@google-cloud/text-to-speech';
import config from './config';
import { JournalCoachRequest, JournalCoachResponse } from './types';

let aiClient: v1beta1.PredictionServiceClient | null = null;
let ttsClient: TextToSpeechClient | null = null;

function getAIClient(): v1beta1.PredictionServiceClient {
  if (!aiClient && config.enableAI && config.gcpProjectId) {
    aiClient = new v1beta1.PredictionServiceClient({
      apiEndpoint: `${config.gcpLocation}-aiplatform.googleapis.com`,
    });
  }
  return aiClient!;
}

function getTTSClient(): TextToSpeechClient {
  if (!ttsClient && config.enableTTS) {
    ttsClient = new TextToSpeechClient();
  }
  return ttsClient!;
}


async function callGemini(userPrompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }
  
  return data.candidates[0].content.parts[0].text;
}



export const ai = {

   async journalCoach(request: JournalCoachRequest): Promise<JournalCoachResponse> {
  const systemPrompt = `You are an empathetic mental health peer supporter for Indian youth. 
Provide validation, gentle reframing, and practical micro-actions. 
You are NOT a therapist. Always remind users to seek professional help for serious concerns.

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "empathy": "2-3 sentences validating their feelings",
  "reframe": "1-2 sentences offering gentle perspective",
  "actions": [
    {
      "title": "Action name",
      "steps": ["step1", "step2", "step3"],
      "duration_mins": 5,
      "category": "grounding"
    },
    {
      "title": "Action name",
      "steps": ["step1", "step2", "step3"],
      "duration_mins": 10,
      "category": "cognitive"
    }
  ]
}

Keep language warm, culturally sensitive, and youth-friendly.`;

  const userPrompt = `User's journal entry: "${request.text}"
Language preference: ${request.language_pref || 'English'}
Tone preference: ${request.tone_pref || 'warm and supportive'}

Respond ONLY with the JSON format specified above.`;

  try {
    const responseText = await callGemini(userPrompt, systemPrompt);

    // Remove markdown code blocks if present
    let cleanedText = responseText.trim();

    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```$/, '').trim();
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```/g, '').trim();
    }

    // Try to parse JSON response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Risk assessment
      const text = request.text.toLowerCase();
      const highRisk = ['suicide', 'kill myself', 'end it all', 'better off dead', 'want to die'];
      const medRisk = ['hopeless', 'worthless', 'give up', "can't go on", 'no point'];
      const lowRisk = ['stressed', 'anxious', 'sad', 'worried', 'overwhelmed', 'depressed'];

      let risk: 'none' | 'low' | 'med' | 'high' = 'none';
      if (highRisk.some(keyword => text.includes(keyword))) risk = 'high';
      else if (medRisk.some(keyword => text.includes(keyword))) risk = 'med';
      else if (lowRisk.some(keyword => text.includes(keyword))) risk = 'low';

      return {
        empathy: parsed.empathy || parsed.EMPATHY || '',
        reframe: parsed.reframe || parsed.REFRAME || '',
        actions: parsed.actions || parsed.ACTIONS || [],
        risk,
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
  }

  // Fallback response if parsing fails
  const text = request.text.toLowerCase();
  const highRisk = ['suicide', 'kill myself', 'end it all', 'better off dead'];
  const medRisk = ['hopeless', 'worthless', 'give up', "can't go on"];
  const lowRisk = ['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'];

  let risk: 'none' | 'low' | 'med' | 'high' = 'none';
  if (highRisk.some(keyword => text.includes(keyword))) risk = 'high';
  else if (medRisk.some(keyword => text.includes(keyword))) risk = 'med';
  else if (lowRisk.some(keyword => text.includes(keyword))) risk = 'low';

  return {
    empathy:
      "I hear that you're sharing something important, and I want you to know that your feelings are completely valid. What you're experiencing matters, and it takes courage to express it.",
    reframe:
      "While this moment feels challenging, remember that feelings are temporary and you have the strength to navigate through this. Every difficult experience is also an opportunity for growth and self-understanding.",
    actions: [
      {
        title: '5-Minute Grounding Exercise',
        steps: [
          "Find a quiet, comfortable spot where you won't be disturbed",
          'Take a deep breath in through your nose for 4 counts',
          'Hold your breath gently for 2 counts',
          'Exhale slowly through your mouth for 6 counts',
          'Repeat this cycle for 5 minutes, focusing only on your breath',
        ],
        duration_mins: 5,
        category: 'grounding',
      },
      {
        title: 'Gratitude Journaling',
        steps: [
          'Get a piece of paper or open your notes app',
          'Think about three positive moments from today, no matter how small',
          'Write down each moment in detail',
          'Reflect on why each moment was meaningful to you',
          'Notice how you feel after completing this exercise',
        ],
        duration_mins: 10,
        category: 'cognitive',
      },
    ],
    risk,
  };
},

    async generateWeeklySummary(userId: string, withAudio = false): Promise<{
    summary_text: string;
    audio_url?: string;
    metaphor: string;
  }> {
    const systemPrompt = `Create a youth-friendly weekly emotional summary. 
    Use engaging metaphors and acknowledge their journey. 
    Keep under 150 words. Be encouraging and insightful.`;

    const userPrompt = `Generate a weekly summary for user reflecting on their emotional journey this week.`;

    const summary_text = await callGemini(userPrompt, systemPrompt);
    let audio_url: string | undefined;

    if (withAudio && config.enableTTS) {
      try {
        const tts = getTTSClient();
        const [response] = await tts.synthesizeSpeech({
          input: { text: summary_text },
          voice: { languageCode: 'en-IN', name: config.ttsVoice },
          audioConfig: { audioEncoding: 'MP3' },
        });

        if (response.audioContent) {
          const audioBase64 = Buffer.from(response.audioContent).toString('base64');
          audio_url = `data:audio/mp3;base64,${audioBase64}`;
        }
      } catch (error) {
        console.error('TTS generation failed:', error);
      }
    }

    return {
      summary_text,
      audio_url,
      metaphor: "Your week looked like a gentle river with both calm pools and energizing rapids."
    };
  },

  async checkDistress(text: string): Promise<{
    risk: 'none' | 'low' | 'med' | 'high';
    reasons: string[];
    helplines: Array<{ name: string; phone: string; available: string }>;
    suggest_next_step: string;
  }> {
    const lowerText = text.toLowerCase();
    const highRisk = ['suicide', 'kill myself', 'end it all', 'better off dead'];
    const medRisk = ['hopeless', 'worthless', 'give up', "can't go on"];
    const lowRisk = ['stressed', 'anxious', 'sad', 'worried', 'overwhelmed'];

    let risk: 'none' | 'low' | 'med' | 'high' = 'none';
    const reasons: string[] = [];

    if (highRisk.some(keyword => lowerText.includes(keyword))) {
      risk = 'high';
      reasons.push('Expressions of self-harm or suicidal thoughts detected');
    } else if (medRisk.some(keyword => lowerText.includes(keyword))) {
      risk = 'med';
      reasons.push('Significant emotional distress and hopelessness indicated');
    } else if (lowRisk.some(keyword => lowerText.includes(keyword))) {
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



export default ai;
