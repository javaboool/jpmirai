'use client'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'

export function HeroBanner() {
  const t = useTranslations('home')
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('hero_title')}</h1>
        <p className="text-blue-100 mb-8 text-sm md:text-base">{t('hero_subtitle')}</p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="bg-white text-blue-700 px-5 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div>
    </section>
  )
}
