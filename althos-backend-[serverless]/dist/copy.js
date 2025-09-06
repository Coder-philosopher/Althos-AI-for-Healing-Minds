"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiMessages = exports.audioSettings = exports.prompts = exports.copingCategories = exports.testExplanations = exports.riskLevelMessages = exports.helplines = void 0;
exports.helplines = [
    {
        name: "Tele-MANAS (National Mental Health Programme)",
        phone: "14416",
        available: "24/7",
        description: "Free mental health support by Government of India"
    },
    {
        name: "Kiran Mental Health Helpline",
        phone: "1800-599-0019",
        available: "24/7",
        description: "National helpline for psychosocial support"
    },
    {
        name: "iCall Psychosocial Helpline",
        phone: "022-25521111",
        available: "Mon-Sat, 8 AM - 10 PM",
        description: "Email: icall@tiss.edu"
    },
    {
        name: "AASRA",
        phone: "022-27546669",
        available: "24/7",
        description: "Suicide prevention helpline"
    },
    {
        name: "Vandrevala Foundation Helpline",
        phone: "+91-9999666555",
        available: "24/7",
        description: "Free counseling and mental health support"
    },
    {
        name: "Sumaitri",
        phone: "011-23389090",
        available: "24/7",
        description: "Delhi-based emotional support"
    }
];
exports.riskLevelMessages = {
    none: {
        message: "It sounds like you're managing well. Keep taking care of yourself!",
        suggest: "Continue journaling and practicing self-care. Consider sharing positive moments with friends or family."
    },
    low: {
        message: "You might be going through a tough time, but you're not alone.",
        suggest: "Try some coping techniques like deep breathing or talking to a trusted friend. Consider professional support if feelings persist."
    },
    med: {
        message: "I'm concerned about what you're going through. Your feelings are valid and help is available.",
        suggest: "Please consider reaching out to a mental health professional or trusted adult. You deserve support and care."
    },
    high: {
        message: "I'm really concerned about you right now. Please know that you matter and help is immediately available.",
        suggest: "Please contact a crisis helpline or go to your nearest emergency room. You don't have to face this alone."
    }
};
exports.testExplanations = {
    phq9: {
        severityBands: {
            minimal: { range: "0-4", description: "Minimal depression" },
            mild: { range: "5-9", description: "Mild depression" },
            moderate: { range: "10-14", description: "Moderate depression" },
            moderatelySevere: { range: "15-19", description: "Moderately severe depression" },
            severe: { range: "20-27", description: "Severe depression" }
        },
        disclaimer: "This is a screening tool, not a diagnosis. Please consult a mental health professional for proper evaluation."
    },
    gad7: {
        severityBands: {
            minimal: { range: "0-4", description: "Minimal anxiety" },
            mild: { range: "5-9", description: "Mild anxiety" },
            moderate: { range: "10-14", description: "Moderate anxiety" },
            severe: { range: "15-21", description: "Severe anxiety" }
        },
        disclaimer: "This is a screening tool, not a diagnosis. Please consult a mental health professional for proper evaluation."
    }
};
exports.copingCategories = {
    grounding: {
        name: "Grounding & Mindfulness",
        description: "Techniques to help you feel centered and present"
    },
    behavioral: {
        name: "Behavioral Activation",
        description: "Small actions to improve mood and energy"
    },
    cognitive: {
        name: "Cognitive Techniques",
        description: "Ways to challenge unhelpful thoughts"
    },
    social: {
        name: "Social Connection",
        description: "Building and maintaining supportive relationships"
    },
    physical: {
        name: "Physical Wellness",
        description: "Body-based approaches to mental wellness"
    },
    creative: {
        name: "Creative Expression",
        description: "Using creativity for emotional release and joy"
    }
};
exports.prompts = {
    journalCoach: `You are an empathetic, culturally-aware mental health peer supporter for Indian youth. 
Your role is to provide validation, gentle reframing, and practical micro-actions. 
You understand the unique pressures of Indian academic and family expectations.

IMPORTANT: You are NOT a therapist or counselor. Always remind users to seek professional help for serious concerns.

Response format:
1. EMPATHY (2-3 sentences): Validate their feelings without judgment
2. NORMALIZE (1-2 sentences): Help them understand their response is normal 
3. REFRAME (1-2 sentences): Offer a gentle, realistic different perspective
4. ACTIONS (exactly 2 items): Specific 10-20 minute micro-activities they can do today
5. SAFETY: If you detect any concerning language, gently suggest additional support

Tone: Warm, non-judgmental, culturally sensitive, youth-friendly. 
Use simple language. Avoid clinical terms. Include Hinglish phrases naturally when appropriate.
Always end with encouragement and remind them they're not alone.`,
    copingGenerator: `Generate practical, culturally-appropriate coping strategies for Indian youth.
Consider common constraints: limited privacy, shared living spaces, academic pressure, family dynamics.

For each strategy, provide:
- Clear title (under 40 characters)  
- Step-by-step instructions
- Realistic time estimate
- Consider different environments (home, hostel, public spaces)

Categories: grounding, behavioral activation, cognitive techniques, social connection, physical wellness, creative expression.
Make activities accessible regardless of resources or location.`,
    weeklySummary: `Create a youth-friendly "emotional week in review" - like Spotify Wrapped for feelings.
Use engaging metaphors, acknowledge their journey, celebrate small wins.

Structure:
- Opening metaphor (weather, journey, movie genre)
- One meaningful observation about their week
- One gentle insight or pattern noticed  
- One encouragement for the coming week
- Warm, hopeful closing

Keep under 150 words. Tone: Encouraging, insightful, age-appropriate. 
Avoid clinical language. Focus on growth and resilience.`,
    kindnessExtractor: `Extract positive, kind, or hopeful moments from journal entries.
Look for:
- Moments of gratitude or appreciation
- Acts of kindness (given or received)
- Small victories or achievements  
- Expressions of hope or determination
- Positive social connections
- Self-compassion or growth

Return short, meaningful highlights that can boost mood and self-awareness.
Keep original voice and authentic phrasing when possible.`,
    distressTriage: `Assess text for mental health risk levels. Be conservative but not overly sensitive.

Risk levels:
- NONE: Normal stress, typical challenges
- LOW: Some emotional distress but coping
- MED: Significant distress, struggling to cope, hopelessness
- HIGH: Self-harm ideation, suicide references, crisis language

Consider context of Indian youth: exam pressure, family expectations, social stress are common.
Differentiate between normal stress expression and genuine risk indicators.

Return assessment with specific quoted reasons and culturally-appropriate next steps.`,
    clinicianSummary: `Create a professional, concise summary for healthcare providers treating Indian youth.
Use SOAP format but keep language accessible.

Include:
- Subjective: Main themes from journals/mood data
- Objective: Test scores, mood patterns, significant changes
- Assessment: Risk factors, protective factors, cultural considerations
- Plan: Suggested areas for clinical discussion

Maintain patient dignity and avoid pathologizing normal adolescent experiences.
Highlight strengths and resilience factors. Include cultural context relevant to treatment.`
};
exports.audioSettings = {
    defaultVoice: 'en-IN-Wavenet-A',
    alternativeVoices: [
        'en-IN-Wavenet-B',
        'en-IN-Wavenet-C',
        'en-IN-Standard-A'
    ],
    speakingRate: 0.9,
    pitch: 0.0,
    volumeGainDb: 0.0
};
exports.uiMessages = {
    errors: {
        generic: "Something went wrong. Please try again.",
        network: "Connection issue. Please check your internet and try again.",
        validation: "Please check your input and try again.",
        unauthorized: "Please log in to continue.",
        rateLimited: "Too many requests. Please wait a moment and try again."
    },
    success: {
        journalSaved: "Journal entry saved successfully!",
        testCompleted: "Test completed. Thank you for sharing.",
        taskMarkedDone: "Great job completing that task!",
        summaryGenerated: "Weekly summary ready!",
        shareCreated: "Shareable link created successfully."
    },
    loading: {
        ai: "AI is thinking...",
        saving: "Saving...",
        generating: "Generating summary...",
        processing: "Processing..."
    }
};
exports.default = {
    helplines: exports.helplines,
    riskLevelMessages: exports.riskLevelMessages,
    testExplanations: exports.testExplanations,
    copingCategories: exports.copingCategories,
    prompts: exports.prompts,
    audioSettings: exports.audioSettings,
    uiMessages: exports.uiMessages
};
