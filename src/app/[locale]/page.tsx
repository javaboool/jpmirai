import { getPayloadClient } from '@/lib/payload'
import { HeroBanner } from '@/components/ui/HeroBanner'
import { ContentCard } from '@/components/ui/ContentCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/i18n/navigation'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('home')
  const locale = await getLocale()
  const payload = await getPayloadClient()

  const [newsData, messagesData, noticesData] = await Promise.all([
    payload.find({ collection: 'news', limit: 4, sort: '-publishedAt', locale: locale as 'ja' | 'en' | 'zh' }),
    payload.find({ collection: 'messages', limit: 4, sort: '-publishedAt', locale: locale as 'ja' | 'en' | 'zh' }),
    payload.find({ collection: 'notices', limit: 4, sort: '-publishedAt', locale: locale as 'ja' | 'en' | 'zh' }),
  ])

  const sections = [
    { key: 'news', label: 'ニュース', data: newsData.docs, href: '/news' },
    { key: 'messages', label: 'メッセージ', data: messagesData.docs, href: '/messages' },
    { key: 'notices', label: 'お知らせ', data: noticesData.docs, href: '/notices' },
  ]

  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
          {sections.map((section) => (
            <section key={section.key}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{section.label}</h2>
                <Link href={section.href} className="text-sm text-blue-600 hover:underline">
                  {t('view_more')} →
                </Link>
              </div>
              {section.data.length === 0 ? (
                <p className="text-sm text-gray-400">コンテンツがありません</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.data.map((item: any) => (
                    <ContentCard
                      key={item.id}
                      title={item.title}
                      summary={item.summary}
                      date={item.publishedAt}
                      imageUrl={item.coverImage?.url}
                      href={`/${section.key}/${item.slug}`}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
