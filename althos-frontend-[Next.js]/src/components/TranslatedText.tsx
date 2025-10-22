'use client'

import { useStaticTranslations } from '@/lib/utils/translations'

interface TranslatedTextProps {
  translationKey: string
  fallback?: string
  className?: string
}

export function TranslatedText({ translationKey, fallback, className }: TranslatedTextProps) {
  const { t } = useStaticTranslations()
  
  return <span className={className}>{t(translationKey, fallback)}</span>
}
