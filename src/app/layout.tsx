import type { Metadata } from 'next'
import Link from 'next/link'
import Providers from '@/components/Providers'
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
        <nav className="bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">AIFlix</Link>
            <div className="space-x-4">
              <Link href="/browse" className="text-white hover:text-red-400">Explorer</Link>
              <Link href="/upload" className="text-white hover:text-red-400">Uploader</Link>
              <Link href="/login" className="text-white hover:text-red-400">Connexion</Link>
              <Link href="/register" className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700">S'inscrire</Link>
            </div>
          </div>
        </nav>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}