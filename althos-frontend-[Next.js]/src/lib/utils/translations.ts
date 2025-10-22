import { useTranslationStore } from '@/lib/stores/translation-store'
import translations from '@/lib/translations.json'

export type Language = keyof typeof translations
export type TranslationKey = string

// Get nested translation by dot notation path (e.g., "nav.home")
export function getTranslation(
  language: Language,
  key: string,
  fallback?: string
): string {
  const keys = key.split('.')
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to English if translation not found
      value = translations['en']
      for (const fk of keys) {
        if (value && typeof value === 'object' && fk in value) {
          value = value[fk]
        } else {
          return fallback || key
        }
      }
      break
    }
  }

  return typeof value === 'string' ? value : fallback || key
}

// Hook for using translations in components - NOW USES ZUSTAND STORE
export function useStaticTranslations() {
  const { currentLanguage, triggerUpdate } = useTranslationStore()
  
  const t = (key: string, fallback?: string) => {
    // Validate language exists in translations
    const lang = (currentLanguage in translations) ? currentLanguage as Language : 'en'
    return getTranslation(lang, key, fallback)
  }

  return { t, currentLanguage }
}
