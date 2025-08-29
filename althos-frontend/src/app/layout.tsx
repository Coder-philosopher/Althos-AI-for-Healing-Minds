import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Althos - Mental Wellness Companion',
  description: 'AI-powered mental health support for Indian youth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
      </head>
      <body className={`${inter.className} h-full bg-bg`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
