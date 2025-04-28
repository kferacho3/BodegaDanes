// src/app/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import React from 'react'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { FilterProvider } from '@/context/FilterContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Force correct CSS pixel width on Safari */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SessionProvider>
            <FilterProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </FilterProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
