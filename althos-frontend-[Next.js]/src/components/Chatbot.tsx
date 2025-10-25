'use client'
import { useState, useEffect, useRef } from 'react'
import { postChatQuery } from '@/lib/api'
import { MessageCircle, X } from 'lucide-react'

function TypingDots() {
  return (
    <span className="flex gap-1 items-center ml-1">
      <span className="inline-block h-2 w-2 rounded-full bg-[#EC7FA9] animate-bounce-[0ms]"></span>
      <span className="inline-block h-2 w-2 rounded-full bg-[#EC7FA9] animate-bounce-200"></span>
      <span className="inline-block h-2 w-2 rounded-full bg-[#EC7FA9] animate-bounce-400"></span>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.8); }
            40% { transform: scale(1.2); }
          }
          .animate-bounce-0ms { animation: bounce 1s infinite 0ms; }
          .animate-bounce-200 { animation: bounce 1s infinite 200ms; }
          .animate-bounce-400 { animation: bounce 1s infinite 400ms; }
        `}
      </style>
    </span>
  )
}

export default function Chatbot() {
  const [userId, setUserId] = useState<string | null>(null)
  const [dashboardVisited, setDashboardVisited] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUserId(sessionStorage.getItem('userId'))
    setDashboardVisited(sessionStorage.getItem('dashboardVisited') === 'true')
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function sendMessage() {
    if (!userId || !query.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', text: query }])
    setQuery('')
    setLoading(true)
    try {
      const response = await postChatQuery(userId, query)
      setMessages(prev => [...prev, { role: 'bot', text: response.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Oops, kuch galat ho gaya! 😅 Try again?" }])
    } finally {
      setLoading(false)
    }
  }

  if (!userId || !dashboardVisited) return null

  // Floating circular button (right-middle)
  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          title='chatbot'
          onClick={() => setIsOpen(true)}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-150 bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] hover:from-[#FFB8E0] hover:to-[#EC7FA9] shadow-xl p-4 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ boxShadow: '0 4px 16px 0 #EC7FA980' }}
          aria-label="Open Chatbot"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed right-12 top-1/2 -translate-y-1/2 w-[420px] max-h-[650px] bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-[#EC7FA9]/30 flex flex-col z-50 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#FFB8E0]/40 bg-gradient-to-r from-[#FFEDFA]/60 to-[#FFB8E0]/20 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-[#EC7FA9]" />
              <span className="font-bold text-xl text-[#BE5985]">Althos Buddy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-[#FFB8E0]/40 transition"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5 text-[#BE5985]" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 px-7 py-6 space-y-3 overflow-y-auto custom-scrollbar bg-[#FFF7FB]">
            {messages.length === 0 && !loading && (
              <div className="text-center text-[#BE5985]/70 pt-12 pb-4 text-base">
                Ask anything related to your mental wellness, journaling, moods, tests, ya phir koi masti sawal! 😊
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-2xl px-5 py-3 mb-1 max-w-[85%] whitespace-pre-wrap text-base ${msg.role === 'user'
                  ? 'ml-auto bg-gradient-to-br from-[#EC7FA9]/25 to-[#BE5985]/10 text-[#BE5985] shadow-sm'
                  : 'bg-gradient-to-br from-[#FFB8E0]/70 to-[#FFEDFA]/30 text-[#EC7FA9] border border-[#EC7FA9]/10'}`
                }
              >
                {msg.text}
              </div>
            ))}
            {/* Loading animation (typing dots) when bot is thinking */}
            {loading && (
              <div className="px-5 py-3 mb-1 rounded-2xl bg-gradient-to-br from-[#FFB8E0]/70 to-[#FFEDFA]/30 text-[#EC7FA9] max-w-[60%]">
                Althos is typing<TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="px-7 pb-7 pt-2 border-t border-[#FFB8E0]/40 bg-gradient-to-tr from-[#FFEDFA]/60 to-[#FFB8E0]/30 rounded-b-3xl">
            <form
              onSubmit={e => { e.preventDefault(); sendMessage() }}
              className="flex gap-3"
            >
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !loading && query.trim()) { e.preventDefault(); sendMessage() } }}
                className="flex-1 px-4 py-2 rounded-xl border border-[#FFB8E0]/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#EC7FA9]/50 transition duration-150 text-base resize-none shadow"
                rows={2}
                placeholder={loading ? "Bot is thinking..." : "Type your message and hit Enter"}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className={`px-5 py-2 h-11 rounded-xl font-bold transition duration-150 text-white shadow-md bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-base flex items-center justify-center
                 ${loading || !query.trim() ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl hover:from-[#BE5985] hover:to-[#EC7FA9]'}`}
              >
                {loading
                  ? <span className="flex gap-1 items-center">Sending <TypingDots /></span>
                  : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Custom scrollbar styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #FFB8E0;
            border-radius: 6px;
          }
        `}
      </style>
    </>
  )
}
