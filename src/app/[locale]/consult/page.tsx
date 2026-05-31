import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ConsultButtons } from '@/components/consult/ConsultButtons'
import { getTranslations } from 'next-intl/server'

export default async function ConsultPage() {
  const t = await getTranslations('consult')
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-500">{t('subtitle')}</p>
        </div>
        <ConsultButtons />
      </main>
      <Footer />
    </>
  )
}
