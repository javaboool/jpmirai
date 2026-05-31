import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ClerkProvider } from '@clerk/nextjs'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Locale } from 'next-intl'
import '../globals.css'

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
