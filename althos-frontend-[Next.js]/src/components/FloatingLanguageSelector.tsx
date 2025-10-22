'use client'

import { useState, useEffect } from 'react'
import { Check, Languages, Loader2, Globe, X } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import { useTranslationStore } from '@/lib/stores/translation-store'
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/languages'
import { useStaticTranslations } from '@/lib/utils/translations'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

export function FloatingLanguageSelector() {
 const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { currentLanguage, setLanguage, isTranslating } = useTranslationStore()
  const { t } = useStaticTranslations() 

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode)
    setOpen(false)
    setSearchQuery('')
    
    // Reload page to apply translations
   
  }

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const recommendedLanguages = filteredLanguages.filter(lang => 
    ['en', 'hi', 'bn', 'te', 'ta', 'mr'].includes(lang.code)
  )

  const otherLanguages = filteredLanguages.filter(lang => 
    !['en', 'hi', 'bn', 'te', 'ta', 'mr'].includes(lang.code)
  )

  if (!mounted) return null

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className={cn(
            montserrat.className,
            'group relative flex items-center gap-2 px-4 py-3 rounded-full',
            'bg-gradient-to-r from-[#E879B9] to-[#DB5F9A]',
            'border-2 border-white/30',
            'shadow-2xl hover:shadow-[#E879B9]/50',
            'transition-all duration-300 hover:scale-110 hover:-translate-y-1',
            'text-white font-bold'
          )}
          disabled={isTranslating}
          title="Change Language (Ctrl+L)"
        >
          {isTranslating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="hidden sm:inline text-sm">{t('language.translating')}</span>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline text-sm">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      {/* Modal Dialog */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-[#C74585]/30 via-black/50 to-[#DB5F9A]/30 backdrop-blur-sm z-[60] animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Language Selector Panel */}
          <div className={cn(
            montserrat.className,
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]',
            'w-[calc(100%-2rem)] max-w-2xl max-h-[80vh]',
            'bg-gradient-to-br from-white via-[#FFF8FB] to-[#FFF5F9]',
            'rounded-3xl border-2 border-[#F8A5C2]/50 shadow-2xl',
            'flex flex-col overflow-hidden',
            'animate-scale-in'
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-[#F8A5C2]/30 bg-gradient-to-r from-white/80 to-[#FFF5F9]/60">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] shadow-lg">
                  <Languages className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#C74585]">
                    {t('language.selectLanguage')}
                  </h2>
                  <p className="text-sm text-[#A03768]/60">
                    Choose your preferred language
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-[#FFEBF3]/60 text-[#DB5F9A] hover:text-[#C74585] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#F8A5C2]/30">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DB5F9A]" />
                <input
                  type="text"
                  placeholder={t('language.searchLanguage')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-[#F8A5C2]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E879B9]/50 focus:border-[#E879B9] transition-all text-[#C74585] placeholder:text-[#A03768]/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Current Language Display */}
            <div className="px-6 py-3 bg-gradient-to-r from-[#E879B9]/10 to-[#F8A5C2]/10 border-b border-[#E879B9]/20">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#A03768]/70">Current:</span>
                <span className="text-xl">{currentLang?.flag}</span>
                <span className="font-bold text-[#C74585]">{currentLang?.name}</span>
                <span className="text-[#A03768]/70">({currentLang?.nativeName})</span>
              </div>
            </div>

            {/* Language List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Recommended Languages */}
              {recommendedLanguages.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#A03768]/70 mb-3 px-2">
                    Recommended Languages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendedLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={cn(
                          'group flex items-center gap-3 p-4 rounded-2xl cursor-pointer',
                          'bg-white/80 border-2',
                          'hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3]',
                          'hover:shadow-lg hover:-translate-y-1',
                          'transition-all duration-300',
                          currentLanguage === language.code 
                            ? 'bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/20 border-[#E879B9]/50 shadow-lg' 
                            : 'border-[#F8A5C2]/30'
                        )}
                      >
                        <span className="text-3xl">{language.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-[#C74585] group-hover:text-[#E879B9] transition-colors">
                            {language.name}
                          </div>
                          <div className="text-sm text-[#A03768]/70">
                            {language.nativeName}
                          </div>
                        </div>
                        {currentLanguage === language.code && (
                          <Check className="h-5 w-5 text-[#E879B9]" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Languages */}
              {otherLanguages.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#A03768]/70 mb-3 px-2">
                    All Languages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {otherLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={cn(
                          'group flex items-center gap-3 p-4 rounded-2xl cursor-pointer',
                          'bg-white/80 border-2',
                          'hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3]',
                          'hover:shadow-lg hover:-translate-y-1',
                          'transition-all duration-300',
                          currentLanguage === language.code 
                            ? 'bg-gradient-to-r from-[#E879B9]/20 to-[#F8A5C2]/20 border-[#E879B9]/50 shadow-lg' 
                            : 'border-[#F8A5C2]/30'
                        )}
                      >
                        <span className="text-3xl">{language.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-[#C74585] group-hover:text-[#E879B9] transition-colors">
                            {language.name}
                          </div>
                          <div className="text-sm text-[#A03768]/70">
                            {language.nativeName}
                          </div>
                        </div>
                        {currentLanguage === language.code && (
                          <Check className="h-5 w-5 text-[#E879B9]" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredLanguages.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-block p-6 rounded-full bg-gradient-to-br from-[#F8A5C2]/20 to-[#E879B9]/10 mb-4">
                    <Globe className="h-12 w-12 text-[#DB5F9A]" />
                  </div>
                  <p className="text-[#A03768]/70">No languages found</p>
                </div>
              )}
            </div>

            {/* Footer with keyboard hint */}
            <div className="p-4 border-t-2 border-[#F8A5C2]/30 bg-gradient-to-r from-white/80 to-[#FFF5F9]/60">
              <div className="flex items-center justify-between text-xs text-[#A03768]/60">
                <span>Press ESC to close</span>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-[#E879B9]/30 rounded">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white border border-[#E879B9]/30 rounded">L</kbd>
                  <span>to open</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(248, 165, 194, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #E879B9, #DB5F9A);
          border-radius: 3px;
        }
      `}</style>
    </>
  )
}
