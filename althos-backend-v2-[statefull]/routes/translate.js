const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const router = express.Router();

// Initialize Google Cloud Translate
let translate;

// Check if environment variable exists
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  try {
    // Production: Use JSON from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log("✅ Using credentials from environment variable");
    console.log("Project ID:", credentials.project_id);
    
    translate = new Translate({
      projectId: credentials.project_id,
      credentials: credentials
    });
  } catch (error) {
    console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error.message);
    throw new Error("Invalid service account credentials in environment variable");
  }
} else {
  // Development: Use JSON file
  const path = require('path');
  const credentialsPath = path.join(__dirname, './service.json'); // Go up one level from routes folder
  
  console.log("⚠️ GOOGLE_APPLICATION_CREDENTIALS_JSON not found in environment");
  console.log("📁 Looking for service account file at:", credentialsPath);
  
  try {
    translate = new Translate({
      keyFilename: credentialsPath
    });
    console.log("✅ Using credentials from file:", credentialsPath);
  } catch (error) {
    console.error("❌ Failed to load service account file:", error.message);
    throw new Error("Service account credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable or provide service-account.json file");
  }
}

// Translation cache
const translationCache = new Map();

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: text and targetLanguage'
      });
    }

    if (sourceLanguage === targetLanguage) {
      return res.json({
        success: true,
        translations: Array.isArray(text) ? text : [text],
        cached: false,
      });
    }

    const textsToTranslate = Array.isArray(text) ? text : [text];
    const cacheKey = `${sourceLanguage}-${targetLanguage}`;
    
    if (!translationCache.has(cacheKey)) {
      translationCache.set(cacheKey, new Map());
    }
    const langCache = translationCache.get(cacheKey);

    const translations = [];
    const uncachedTexts = [];
    const uncachedIndices = [];

    textsToTranslate.forEach((txt, index) => {
      if (langCache.has(txt)) {
        translations[index] = langCache.get(txt);
      } else {
        uncachedTexts.push(txt);
        uncachedIndices.push(index);
      }
    });

    if (uncachedTexts.length > 0) {
      const [results] = await translate.translate(uncachedTexts, {
        from: sourceLanguage,
        to: targetLanguage,
      });

      const translatedResults = Array.isArray(results) ? results : [results];

      translatedResults.forEach((translatedText, i) => {
        const originalIndex = uncachedIndices[i];
        const originalText = uncachedTexts[i];
        
        langCache.set(originalText, translatedText);
        translations[originalIndex] = translatedText;
      });
    }

    res.json({
      success: true,
      translations,
      cached: uncachedTexts.length === 0,
      sourceLanguage,
      targetLanguage,
    });

  } catch (error) {
    console.error('Translation API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Translation failed',
      error: error.message
    });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const [languages] = await translate.getLanguages();
    res.json({ 
      success: true,
      supportedLanguages: languages,
      count: languages.length 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch languages',
      error: error.message
    });
  }
});

module.exports = router;
