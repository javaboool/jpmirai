import { getPayloadClient } from '@/lib/payload'
import { ContentCard } from '@/components/ui/ContentCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getLocale } from 'next-intl/server'

export default async function MessagesListPage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'messages',
    limit: 20,
    sort: '-publishedAt',
    locale: locale as 'ja' | 'en' | 'zh',
  })

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">メッセージ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {docs.map((item: any) => (
            <ContentCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              date={item.publishedAt}
              imageUrl={item.coverImage?.url}
              href={`/messages/${item.slug}`}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
