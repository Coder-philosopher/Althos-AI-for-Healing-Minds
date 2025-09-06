# Distress Detection Model

## Overview
A fine-tuned transformer-based model for real-time detection of mental health crisis indicators in user journal entries and text communications.

## Model Architecture
- **Base Model**: BERT-base-uncased
- **Fine-tuning**: Additional classification layer with 4 output classes
- **Input**: Tokenized journal text (max 512 tokens)
- **Output**: Probability distribution over distress levels [None, Low, Medium, High]

## Training Data
- **Dataset Size**: 10,000 annotated journal entries
- **Sources**: Anonymized mental health forums, clinical datasets, synthetic data
- **Labeling**: Mental health professionals provided ground truth annotations
- **Class Distribution**: None (40%), Low (30%), Medium (20%), High (10%)


## Evaluation Metrics
- **Precision**: 0.85 (weighted average)
- **Recall**: 0.82 (weighted average)
- **F1-Score**: 0.83 (weighted average)
- **AUC-ROC**: 0.89
- **Inference Latency**: 150ms average

## Deployment
- **Platform**: Google Vertex AI Custom Prediction
- **Endpoint**: REST API with authentication
- **Scaling**: Auto-scaling 0-10 instances based on load
- **Monitoring**: Real-time performance and drift detection


## Safety Measures
- **High-risk threshold**: Confidence > 0.75 triggers immediate crisis protocol
- **Human oversight**: All high-risk predictions reviewed by mental health professionals
- **Fallback**: Manual escalation paths for edge cases

