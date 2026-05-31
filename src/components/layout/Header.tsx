'use client'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const locales = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
]

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-blue-700">JP-Mirai</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">{t('home')}</Link>
          <Link href="/consult" className="hover:text-blue-700 transition-colors">{t('consult')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Globe size={16} className="text-gray-400" />
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => router.replace(pathname, { locale: l.code as 'ja' | 'en' | 'zh' })}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  locale === l.code
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-blue-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm" variant="outline">ログイン</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
