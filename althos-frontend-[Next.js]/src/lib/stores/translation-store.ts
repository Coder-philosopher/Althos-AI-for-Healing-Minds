import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TranslationState {
  currentLanguage: string
  isTranslating: boolean
  triggerUpdate: number // Add this to force re-renders
  setLanguage: (language: string) => void
  setIsTranslating: (isTranslating: boolean) => void
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      isTranslating: false,
      triggerUpdate: 0,
      setLanguage: (language: string) => set((state) => ({ 
        currentLanguage: language,
        triggerUpdate: state.triggerUpdate + 1 // Increment to trigger re-renders
      })),
      setIsTranslating: (isTranslating: boolean) => set({ isTranslating }),
    }),
    {
      name: 'althos-language-storage',
    }
  )
)
