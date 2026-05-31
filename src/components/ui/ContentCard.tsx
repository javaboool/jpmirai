import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

type Props = {
  title: string
  summary?: string
  date: string
  imageUrl?: string
  href: string
  category?: string
}

export function ContentCard({ title, summary, date, imageUrl, href, category }: Props) {
  return (
    <Link href={href} className="group block bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      {imageUrl && (
        <div className="relative h-44 w-full bg-gray-50">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        {category && <Badge variant="secondary" className="mb-2 text-xs">{category}</Badge>}
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 text-sm leading-snug">
          {title}
        </h3>
        {summary && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{summary}</p>
        )}
        <p className="mt-2 text-xs text-gray-400">{formatDate(date)}</p>
      </div>
    </Link>
  )
}
