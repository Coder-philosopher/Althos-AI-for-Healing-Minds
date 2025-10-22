import { useState, useCallback } from 'react'
import { useTranslationStore } from '@/lib/stores/translation-store'
import { translateText } from '@/lib/api'

interface TranslateOptions {
  text: string | string[]
  targetLanguage?: string
  sourceLanguage?: string
}

export function useTranslation() {
  const { currentLanguage, setIsTranslating } = useTranslationStore()
  const [error, setError] = useState<string | null>(null)

  const translate = useCallback(async ({
    text,
    targetLanguage,
    sourceLanguage = 'en'
  }: TranslateOptions): Promise<string | string[] | null> => {
    // If target language is English or same as source, return original
    const target = targetLanguage || currentLanguage
    if (target === 'en' || target === sourceLanguage) {
      return text
    }

    setIsTranslating(true)
    setError(null)

    try {
      const data = await translateText(text, target, sourceLanguage)
      
      // Check if backend returned success
      if (!data.success) {
        throw new Error(data.message || 'Translation failed')
      }
      
      // Return single string if input was single, array if input was array
      return Array.isArray(text) ? data.translations : data.translations[0]

    } catch (err: any) {
      console.error('Translation error:', err)
      setError(err.message)
      return null
    } finally {
      setIsTranslating(false)
    }
  }, [currentLanguage, setIsTranslating])

  return {
    translate,
    currentLanguage,
    error,
  }
}
