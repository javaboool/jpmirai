import { Link } from '@/i18n/navigation'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-bold text-blue-700">JP-Mirai Portal</span>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-700">ホーム</Link>
          <Link href="/consult" className="hover:text-blue-700">相談する</Link>
        </nav>
        <p className="text-xs text-gray-400">© 2024 JP-Mirai. All rights reserved.</p>
      </div>
    </footer>
  )
}
