import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500">ページが見つかりません</p>
      <Link href="/" className="text-blue-600 hover:underline">ホームに戻る</Link>
    </main>
  )
}
