import type { Metadata } from 'next'
import Link from 'next/link'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIFlix',
  description: 'Plateforme pour séries et films générés par IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}