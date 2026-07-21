import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import { getSiteContent } from '@/lib/site-store'
import { createDefaultContent } from '@/lib/content'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-tc',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
})

export async function generateMetadata(): Promise<Metadata> {
  let seo = createDefaultContent().settings.seo
  try {
    const content = await getSiteContent()
    seo = content.settings.seo
  } catch {
    /* use defaults */
  }

  return {
    title: seo.title,
    description: seo.description,
    metadataBase: seo.canonical ? new URL(seo.canonical) : undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo.indexing ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: seo.ogEnabled
      ? {
          title: seo.title,
          description: seo.description,
          images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
        }
      : undefined,
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
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  let themeColor = '#2151a1'
  try {
    const content = await getSiteContent()
    themeColor = content.settings.seo.themeColor || themeColor
  } catch {
    /* default */
  }
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`light ${notoSansTC.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
