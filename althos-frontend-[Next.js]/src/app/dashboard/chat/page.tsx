'use client'

import React from 'react'

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#FFF5F9] to-[#FFD8EB] px-6 text-center">
      <div className="max-w-lg bg-white shadow-xl rounded-3xl p-10 border border-[#FFB8E0]/40 flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#BE5985] mb-6 tracking-wide leading-tight drop-shadow-md">
          Chat Feature <span className="text-[#EC7FA9]">Pro Plan Only</span>
        </h1>

        <p className="text-[#BE5985]/90 text-lg md:text-xl mb-8 max-w-[400px] leading-relaxed font-medium">
          Our real-time chat experience is part of the <strong>Pro Plan</strong>.  
          Upgrade now to unlock seamless messaging, friend lists, and live conversations.
        </p>

        <a
          href="/pricing"
          className="inline-flex items-center gap-3 bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:brightness-110 transition-all duration-300"
          aria-label="Go to pricing page"
        >
          View Pro Plans
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="mt-12 text-[#BE5985]/80 text-base md:text-lg font-light max-w-[360px]">
        Stay tuned — your conversations await in the <span className="font-semibold">Pro experience</span>.
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
