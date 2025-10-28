'use client'

import { Navbar } from '@/components/Navbar'
import { useState } from 'react'
import OrgCodeInput from './OrgCodeInput'
import OrgDashboardView from './OrgDashboardView'

export default function OrgDashboardPage() {
  const [orgCode, setOrgCode] = useState('')

  return (
    <>
      <Navbar />
      <main className="pt-40 max-w-full px-12 min-h-screen bg-gradient-to-br from-[#FFF4F9] to-[#FFF9F9] text-center flex flex-col items-center">
        
        {/* Page Title */}
        <h1 className="font-extrabold text-3xl md:text-4xl text-[#DB5F9A] mb-4">
          <span className="text-[#BE5985]">Organization Dashboard Access</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#BE5985]/80 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
          Please <strong>enter your organization code below</strong> to view analytics and performance data.  
          This helps us fetch the right insights for your team.
        </p>

        {/* Input Field */}
        <OrgCodeInput orgCode={orgCode} setOrgCode={setOrgCode} />

        {/* Helper Hint */}
        

        {/* Divider */}

        {/* Dashboard Section */}
        {orgCode ? (
          <OrgDashboardView orgCode={orgCode} />
        ) : (
          <div className="text-[#BE5985]/70 mt-8 text-base max-w-md">
            <p className="font-medium">
              💡 Tip: The dashboard will appear right here once you enter a valid code.
            </p>
            <p className="mt-2 text-sm">
              Make sure your organization is registered and has analytics enabled.
            </p>
          </div>
        )}
      </main>
    </>
  )
}
