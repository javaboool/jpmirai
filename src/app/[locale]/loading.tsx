import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(j => (
            <Skeleton key={j} className="h-52 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  )
}
