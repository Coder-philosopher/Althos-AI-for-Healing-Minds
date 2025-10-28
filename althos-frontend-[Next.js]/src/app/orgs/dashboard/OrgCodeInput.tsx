'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface OrgCodeInputProps {
  orgCode: string
  setOrgCode: (code: string) => void
}

export default function OrgCodeInput({ orgCode, setOrgCode }: OrgCodeInputProps) {
  const [input, setInput] = useState(orgCode)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) setOrgCode(input.trim())
  }

  return (
    <section className="w-full flex justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white border-2 border-[#F8A5C2]/60 shadow-lg hover:shadow-xl transition-all duration-300 p-8 rounded-lg w-full max-w-2xl flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#BE5985] mb-2">
            Dashboard Access
          </h2>
          <p className="text-[#A03768]/70 text-sm">
            Enter your <strong>Organization Code</strong> to unlock analytics and insights.
          </p>
        </div>

        {/* Input and Button Row */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BE5985]/60 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter your organization code"
              className="w-full border-2 border-[#EC7FA9]/70 bg-[#FFF9FB] rounded-md pl-12 pr-4 py-3 text-lg font-semibold text-[#BE5985] placeholder:text-[#BE5985]/50 focus:outline-none focus:ring-4 focus:ring-[#EC7FA9]/40 transition-all duration-200"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white px-8 py-3 rounded-md font-bold shadow-md hover:shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            Get Analytics
          </button>
        </div>

        {/* Helper / Tip */}
        <div className="text-center text-sm text-[#BE5985]/70 italic mt-1">
          Example: <strong>ORG-ALPHA</strong> or <strong>TEAMX2025</strong>
        </div>
      </form>
    </section>
  )
}
