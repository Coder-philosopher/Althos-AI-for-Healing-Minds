'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Menu, X, Brain, HelpCircle, Sparkles } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Understand Mental Health', href: '/health', icon: Brain, description: 'Learn about mental wellness' },
    { name: 'Help', href: '/help', icon: HelpCircle, description: 'Get started guide' },
  ]

  return (
    <nav
      className={cn(
        montserrat.className,
        'fixed left-1/2 top-4 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-500',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-[#E879B9]/10 border border-[#F8A5C2]/40' 
          : 'bg-white/80 backdrop-blur-md shadow-lg shadow-[#E879B9]/5 border border-[#F8A5C2]/20',
        'rounded-2xl'
      )}
    >
      {/* Gradient strip at bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E879B9] via-[#DB5F9A] to-[#F8A5C2] opacity-70 rounded-b-xl" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E879B9] to-[#DB5F9A] rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative p-2.5 rounded-xl bg-white/95 border-2 border-[#F09FCA]/40 shadow-md shadow-[#E879B9]/20 transition-transform duration-300 group-hover:scale-105">
                <Heart className="h-6 w-6 text-[#DB5F9A]" fill="currentColor" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#C74585] via-[#DB5F9A] to-[#E879B9] bg-clip-text text-transparent">
                Althos
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-[#A03768]/60">Mental Wellness</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4">
             <Link
              href="/login"
              className="group/signin relative overflow-hidden rounded-lg border-2 border-[#E879B9]/40 bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold px-5 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F8A5C2] via-[#DB5F9A] to-[#E879B9] opacity-40 group-hover/signin:opacity-70 rounded-lg transition-opacity" />
              <div className="relative flex items-center gap-2 justify-center">
                <Sparkles className="h-4 w-4 group-hover/signin:rotate-180 transition-transform duration-500" />
                <span>Sign In</span>
              </div>
            </Link>
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group/link relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FFF5F9] hover:to-[#FFEBF3] border border-transparent hover:border-[#F8A5C2]/40"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#DB5F9A]" />
                    <span className="text-sm font-semibold text-[#C74585] group-hover/link:text-[#DB5F9A]">
                      {link.name}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" />
                </Link>
              )
            })}

            {/* Sign In Button */}
           
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/90 border border-[#F8A5C2]/40 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#DB5F9A]" />
            ) : (
              <Menu className="h-6 w-6 text-[#DB5F9A]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#F8A5C2]/30 shadow-lg animate-slide-in">
          <div className="p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFF5F9] to-[#FFEBF3] border border-[#F8A5C2]/40 hover:border-[#E879B9]/60 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <link.icon className="h-5 w-5 text-[#DB5F9A]" />
                  <div>
                    <div className="font-semibold text-[#C74585]">{link.name}</div>
                    <div className="text-xs text-[#A03768]/60">{link.description}</div>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center rounded-xl bg-gradient-to-r from-[#E879B9] to-[#DB5F9A] text-white font-bold py-3 mt-3 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </nav>
  )
}
