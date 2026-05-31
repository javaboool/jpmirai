'use client'
import { Phone, PhoneOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onCancel: () => void
  staffName?: string
}

export function CallDialing({ onCancel, staffName = 'スタッフ' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
        <Phone size={40} className="text-blue-600" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900">{staffName}</p>
        <p className="text-sm text-gray-500 mt-1">呼び出し中...</p>
      </div>
      <Button variant="destructive" size="lg" onClick={onCancel} className="rounded-full w-16 h-16">
        <PhoneOff size={24} />
      </Button>
    </div>
  )
}
