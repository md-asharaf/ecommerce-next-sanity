import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import '../globals.css'
import { Header } from '@/components/header'
import { SanityLive } from '@/sanity/lib/live'
import { draftMode } from 'next/headers'
import DisableDraftMode from '@/components/disable-draft-mode'
import { VisualEditing } from 'next-sanity'
import { Inter } from 'next/font/google'
import Footer from '@/components/footer'
import { Toaster } from 'sonner'
import MergeCart from '@/components/merge-cart'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shopper',
  description: 'Shopper - Your one-stop shop for all your needs',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" className={inter.className}>
        <body>
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <main className="h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
              <Header />
            </div>
            <div className="flex-1 mt-16 bg-gray-100 overflow-y-auto">
              {children}
              <Footer />
            </div>
          </main>
          <MergeCart/>
          <SanityLive />
          <Toaster richColors position='top-right' />
        </body>
      </html>
    </ClerkProvider>
  )
}