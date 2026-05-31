import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ClerkProvider } from '@clerk/nextjs'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Locale } from 'next-intl'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'JP-Mirai Portal',
  description: '外国人技能実習生・特定技能外国人支援ポータル',
  manifest: '/manifest.json',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(routing.locales as readonly string[]).includes(locale)) notFound()
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body>
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
