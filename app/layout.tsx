import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollToTopButton } from '@/components/scroll-to-top'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

const BASE_URL = 'https://afrotentacles.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
    template: '%s | AfroTentacles',
  },
  description: 'Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d\'influence.',
  keywords: ['Afrique', 'géopolitique', 'géoéconomie', 'économie africaine', 'analyse', 'réseaux d\'influence'],
  authors: [{ name: 'AfroTentacles', url: BASE_URL }],
  creator: 'AfroTentacles',
  publisher: 'AfroTentacles',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'AfroTentacles',
    title: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
    description: 'Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d\'influence.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'AfroTentacles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
    description: 'Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d\'influence.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AfroTentacles",
              "url": BASE_URL,
              "description": "Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d'influence.",
              "publisher": {
                "@type": "Organization",
                "name": "AfroTentacles",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${BASE_URL}/logo.jpg`
                }
              }
            })
          }}
        />
      </head>
      <body className="font-serif antialiased">
        {children}
        <ScrollToTopButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
