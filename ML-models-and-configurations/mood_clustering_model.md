# Mood Clustering Model (MoodAtlas)

## Overview
Unsupervised machine learning model that identifies patterns in user mood data using K-means clustering to reveal emotional state clusters and trigger patterns.

## Model Architecture
- **Algorithm**: K-means clustering with dynamic K selection
- **Features**: Valence (-2 to +2), Arousal (0 to 1), Time context, User context
- **Dimensionality**: 4D feature space with PCA for visualization
- **Cluster Selection**: Elbow method + Silhouette analysis

## Feature Engineering

## Training Data
- **Dataset**: 50,000 mood entries from 1,000 pilot users
- **Time Range**: 6 months of user interactions
- **Preprocessing**: Normalization, outlier removal, temporal smoothing
- **Validation**: Silhouette score optimization

## Model Performance
- **Optimal Clusters**: 8 distinct mood clusters identified
- **Silhouette Score**: 0.62 (indicates moderate to good clustering)
- **Inertia**: Converged after 15 iterations on average
- **Cluster Interpretability**: 85% of clusters have clear emotional themes

## Cluster Definitions
1. **High Positive Energy**: Valence > 1, Arousal > 0.7 (Excited, Enthusiastic)
2. **Calm Happiness**: Valence > 0.5, Arousal < 0.4 (Content, Peaceful)
3. **Neutral Balanced**: -0.5 < Valence < 0.5, 0.3 < Arousal < 0.7 (Stable)
4. **Low Energy Negative**: Valence < -0.5, Arousal < 0.3 (Depressed, Withdrawn)
5. **Anxious Stress**: Valence < 0, Arousal > 0.6 (Worried, Agitated)
6. **Mixed Emotions**: High variance in valence, moderate arousal (Conflicted)
7. **Recovery State**: Improving valence trend, stable arousal (Healing)
8. **Crisis State**: Extreme negative valence, high arousal (Emergency)

## Deployment
- **Platform**: BigQuery ML for batch processing
- **Schedule**: Weekly model refresh with new user data
- **Visualization**: Real-time cluster assignment for MoodAtlas dashboard
- **Integration**: Results fed into AI coaching model for personalized responses

## Clinical Applications
- **Pattern Recognition**: Identifies recurring emotional states and triggers
- **Progress Tracking**: Monitors user movement between mood clusters over time
- **Risk Assessment**: Flags users spending excessive time in crisis clusters
- **Intervention Timing**: Optimizes when to suggest coping strategies
