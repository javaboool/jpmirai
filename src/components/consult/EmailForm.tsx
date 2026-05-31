'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

type Props = { onClose: () => void }

export function EmailForm({ onClose }: Props) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/email', { method: 'POST', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } })
    setSent(true)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">メールで相談</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      {sent ? (
        <p className="text-green-600 text-sm">送信しました。担当者からご連絡いたします。</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="お名前" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
          <Input type="email" placeholder="メールアドレス" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
          <Textarea placeholder="ご相談内容" rows={4} value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required />
          <Button type="submit" className="w-full">送信する</Button>
        </form>
      )}
    </div>
  )
}
