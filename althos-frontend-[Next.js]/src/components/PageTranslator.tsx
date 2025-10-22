'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslationStore } from '@/lib/stores/translation-store'
import { useTranslation } from '../lib/hooks/useTranslations'
import { Loader2 } from 'lucide-react'

interface PageTranslatorProps {
  children: React.ReactNode
  excludeSelectors?: string[] // Selectors to exclude from translation
}

export function PageTranslator({ children, excludeSelectors = [] }: PageTranslatorProps) {
  const { currentLanguage, isTranslating } = useTranslationStore()
  const { translate } = useTranslation()
  const [isTranslatingPage, setIsTranslatingPage] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const originalTexts = useRef<Map<Element, string>>(new Map())

  // Default selectors to exclude from translation
  const defaultExcludes = [
    'script',
    'style',
    'code',
    'pre',
    '[data-no-translate]',
    '.no-translate',
    ...excludeSelectors
  ]

  useEffect(() => {
    if (currentLanguage === 'en' || !contentRef.current) {
      // Restore original English text if switching back to English
      if (currentLanguage === 'en' && originalTexts.current.size > 0) {
        originalTexts.current.forEach((originalText, element) => {
          if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            element.textContent = originalText
          }
        })
      }
      return
    }

    const translatePageContent = async () => {
      setIsTranslatingPage(true)

      try {
        const elements = contentRef.current!.querySelectorAll('*')
        const textsToTranslate: string[] = []
        const elementsToTranslate: Element[] = []

        // Collect all text nodes
        elements.forEach((element) => {
          // Skip excluded elements
          if (defaultExcludes.some(selector => element.matches(selector))) {
            return
          }

          // Only translate direct text nodes (not nested elements)
          if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = element.textContent?.trim()
            if (text && text.length > 0) {
              // Store original text if not already stored
              if (!originalTexts.current.has(element)) {
                originalTexts.current.set(element, text)
              }
              textsToTranslate.push(text)
              elementsToTranslate.push(element)
            }
          }
        })

        if (textsToTranslate.length === 0) {
          setIsTranslatingPage(false)
          return
        }

        // Translate in batches of 50 to avoid overwhelming the API
        const batchSize = 50
        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
          const batch = textsToTranslate.slice(i, i + batchSize)
          const batchElements = elementsToTranslate.slice(i, i + batchSize)

          const translated = await translate({
            text: batch,
            targetLanguage: currentLanguage,
            sourceLanguage: 'en'
          })

          if (translated && Array.isArray(translated)) {
            translated.forEach((translatedText, index) => {
              const element = batchElements[index]
              if (element && translatedText) {
                element.textContent = translatedText
              }
            })
          }
        }

      } catch (error) {
        console.error('Page translation error:', error)
      } finally {
        setIsTranslatingPage(false)
      }
    }

    // Delay translation slightly to ensure DOM is ready
    const timer = setTimeout(() => {
      translatePageContent()
    }, 500)

    return () => clearTimeout(timer)
  }, [currentLanguage, translate])

  return (
    <>
      {/* Loading overlay */}
      {isTranslatingPage && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl border-2 border-[#E879B9]/50 flex items-center gap-4">
            <Loader2 className="h-6 w-6 text-[#E879B9] animate-spin" />
            <div>
              <div className="font-bold text-[#C74585]">Translating page...</div>
              <div className="text-sm text-[#A03768]/70">Please wait a moment</div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}
