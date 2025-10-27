'use client'

import React from 'react'
import { Montserrat } from 'next/font/google'
import { Navbar } from '@/components/Navbar'

import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils' // Assuming you have a utility for conditional class names

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Great for individuals starting their wellness journey.',
    features: [
      'Basic mood tracking',
      'Limited journaling entries',
      'Access to AI insights',
      'Community support',
    ],
    bgGradient: 'from-pink-300 to-pink-500',
    borderColor: 'border-pink-500',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$15 / month',
    description: 'Enhanced features for regular users aiming for better insights.',
    features: [
      'Unlimited mood tracking',
      'Unlimited journaling',
      'Advanced AI coaching',
      'Priority email support',
      'Custom reminders',
    ],
    bgGradient: 'from-purple-400 to-violet-600',
    borderColor: 'border-purple-600',
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 'Contact Us',
    description: 'Designed for clinics, organizations, and healthcare providers.',
    features: [
      'Multi-user management',
      'Data export & analytics',
      'Dedicated support manager',
      'HIPAA and GDPR compliant',
      'Custom integrations',
    ],
    bgGradient: 'from-emerald-400 to-green-600',
    borderColor: 'border-emerald-600',
  },
]

export default function Pricing() {
  return (
    <>
    <Navbar />
    <div className={`${montserrat.className} bg-gradient-to-br from-[#FFF5F9] via-[#FFEBF3] to-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 min-h-screen`}>
      <h1 className="text-4xl font-extrabold text-center text-[#DB5F9A] mb-12 md:text-5xl md:mb-16">
        Choose Your Plan
      </h1>

      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
        {pricingPlans.map(plan => (
          <div
            key={plan.id}
            className={cn(
              'rounded-3xl border-4 p-8 flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300',
              plan.borderColor,
              `bg-gradient-to-br ${plan.bgGradient} bg-opacity-25`
            )}
          >
            <h2 className="text-3xl font-bold text-center text-[#6E2E57]">{plan.name}</h2>
            <p className="mt-4 text-center text-[#A03768]/80 font-semibold mb-6">{plan.description}</p>

            <div className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#C74585] font-medium text-lg">
                    <CheckCircle className="text-[#EC7FA9] w-6 h-6 flex-shrink-0" strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                disabled
                className="w-full rounded-full py-4 bg-[#F8A4C3] cursor-not-allowed text-white font-bold text-xl shadow-md uppercase tracking-wide select-none"
                aria-disabled="true"
                title="Pricing coming soon"
              >
                {plan.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
