import { Navbar } from '@/components/shared/Navbar';
import LoadingScreen from '@/components/shared/LoadingScreen';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const viewport: Viewport = {
  themeColor: '#080B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://medilink.app'),
  title: {
    default: 'MediLink — Free QR Emergency Medical ID Card | India',
    template: '%s | MediLink'
  },
  description: 'Create your free QR-based emergency medical ID card. Paramedics scan your QR and instantly see blood group, allergies, and emergency contacts — no app required. Free forever.',
  keywords: [
    'emergency medical ID', 'QR medical card', 'medical ID India', 'emergency QR code',
    'blood group QR', 'first responder medical info', 'free medical ID card India',
    'emergency contact QR', 'medical alert card', 'accident emergency ID',
    'QR medical bracelet', 'emergency health card', 'मेडिकल ID कार्ड', 'medical ID free'
  ],
  authors: [{ name: 'MediLink Team' }],
  creator: 'MediLink',
  publisher: 'MediLink',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://medilink.app',
    title: 'MediLink — Free QR Emergency Medical ID | India',
    description: 'Your blood group, allergies, and emergency contacts — in a QR code. Free. Secure. Life-saving.',
    siteName: 'MediLink',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MediLink Emergency Medical ID' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediLink — Free QR Emergency Medical ID',
    description: 'Create your emergency QR medical ID in 2 minutes. Free forever.',
    images: ['/og-image.png']
  },
  alternates: {
    canonical: 'https://medilink.app'
  },
  verification: {
    google: 'ADD_GOOGLE_SEARCH_CONSOLE_TOKEN_HERE'
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MediLink'
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-[#FF2D2D]/30 selection:text-white">
        <NextTopLoader
          color="#FF2D2D"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF2D2D,0 0 5px #FF2D2D"
        />
        <LoadingScreen />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
