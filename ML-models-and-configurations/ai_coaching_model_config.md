# AI Coaching Model Configuration

## Overview
Configuration and prompt engineering for Google Vertex AI Gemini model to provide empathetic, culturally-sensitive mental health coaching for Indian youth.

## Model Specifications
- **Base Model**: Gemini-1.5-Pro
- **Context Window**: 32k tokens
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Top-p**: 0.9 (diverse response generation)
- **Max Output Tokens**: 1024

## Prompt Engineering Framework

### System Prompt Template

### Response Structure
1. **Validation** (2-3 sentences acknowledging feelings)
2. **Reframe** (1-2 sentences offering gentle perspective shift)
3. **Actions** (2-3 specific, time-bound coping strategies)
4. **Encouragement** (1 sentence with cultural warmth)

## Cultural Adaptation Features
- **Language**: Hinglish phrases when appropriate
- **Family Context**: Acknowledges family expectations and relationships
- **Academic Pressure**: Addresses exam stress, career anxiety, parental expectations
- **Social Dynamics**: Considers peer pressure, social media impact, relationship concerns
- **Festivals/Seasons**: Incorporates Indian calendar events and seasonal considerations

## Example Interactions

### Input

## Safety Guardrails
- **Crisis Detection**: Automatically flags content suggesting self-harm
- **Boundary Maintenance**: Avoids providing medical diagnoses or prescriptions
- **Cultural Sensitivity**: Prevents responses that might conflict with Indian values
- **Age Appropriateness**: Adjusts language and suggestions based on user age

## Performance Monitoring
- **Response Quality**: User rating system (1-5 stars)
- **Engagement**: Conversation length and follow-up questions
- **Safety**: Zero tolerance for harmful advice
- **Cultural Accuracy**: Regular review by Indian mental health professionals

## Training & Fine-tuning
- **RLHF**: Reinforcement Learning from Human Feedback ongoing
- **Cultural Experts**: Indian psychologists provide training data annotation
- **User Feedback**: Continuous improvement based on user satisfaction scores
- **A/B Testing**: Different prompt variations tested for optimal outcomes
