import React from 'react'
import { Inter } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../theme'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lumina - Générateur de Templates Email IA',
  description: 'Générez des réponses d\'emails professionnels personnalisées avec l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  )
} 