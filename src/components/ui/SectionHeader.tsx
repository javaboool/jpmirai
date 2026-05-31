import { Link } from '@/i18n/navigation'

type Props = {
  title: string
  viewMoreHref?: string
  viewMoreLabel?: string
}

export function SectionHeader({ title, viewMoreHref, viewMoreLabel = 'もっと見る' }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {viewMoreHref && (
        <Link href={viewMoreHref} className="text-sm text-blue-600 hover:underline">
          {viewMoreLabel} →
        </Link>
      )}
    </div>
  )
}
