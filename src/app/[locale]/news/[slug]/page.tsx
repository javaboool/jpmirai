import { getPayloadClient } from '@/lib/payload'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RichTextRenderer } from '@/components/ui/RichTextRenderer'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

type Props = { params: Promise<{ slug: string }> }

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as 'ja' | 'en' | 'zh',
  })

  if (!docs[0]) notFound()
  const item = docs[0] as any

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {item.coverImage?.url && (
          <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
            <Image src={item.coverImage.url} alt={item.title} fill className="object-cover" />
          </div>
        )}
        <p className="text-xs text-gray-400 mb-2">{formatDate(item.publishedAt)}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{item.title}</h1>
        <div className="prose prose-sm max-w-none">
          <RichTextRenderer content={item.content} />
        </div>
      </main>
      <Footer />
    </>
  )
}
