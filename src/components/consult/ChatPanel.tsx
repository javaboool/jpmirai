'use client'
import { X } from 'lucide-react'

type Props = { onClose: () => void }

export function ChatPanel({ onClose }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">チャット</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <p className="text-sm text-gray-500">チャット機能は準備中です（Task 13で実装）</p>
    </div>
  )
}
