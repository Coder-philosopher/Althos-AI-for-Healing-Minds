import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Althos - Mental Wellness Companion',
  description: 'AI-powered mental health support for Gen-Z and youth. Track moods, journal, and grow mentally with our smart tools.',
  metadataBase: new URL('https://althos.nitrr.in'), // change this to your real domain
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Althos - Mental Wellness Companion',
    description: 'Your AI-powered mental health companion for journaling, mood tracking, and personal growth.',
    url: 'https://althos.nitrr.in', // update this
    siteName: 'Althos',
    images: [
      {
        url: '/android-chrome-512x512.png', // fallback preview image
        width: 512,
        height: 512,
        alt: 'Althos logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Althos - Mental Wellness Companion',
    description: 'AI-powered mental health support for Gen-Z. Built with love using generative AI.',
    images: ['/android-chrome-512x512.png'],
    creator: '@yourtwitterhandle', // optional
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Mobile & PWA Enhancements */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} h-full bg-bg`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
