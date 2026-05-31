'use client'
import { MessageSquare, Mail, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { EmailForm } from './EmailForm'
import { ChatPanel } from './ChatPanel'
import { useRouter } from '@/i18n/navigation'

export function ConsultButtons() {
  const t = useTranslations('consult')
  const router = useRouter()
  const [panel, setPanel] = useState<'chat' | 'email' | null>(null)

  const buttons = [
    {
      key: 'chat' as const,
      icon: MessageSquare,
      label: t('chat'),
      desc: t('chat_desc'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      key: 'email' as const,
      icon: Mail,
      label: t('email'),
      desc: t('email_desc'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      key: 'video' as const,
      icon: Video,
      label: t('video_call'),
      desc: t('video_desc'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buttons.map(({ key, icon: Icon, label, desc, color }) => (
          <button
            key={key}
            onClick={() => key === 'video' ? router.push('/consult/video') : setPanel(key)}
            className={`${color} text-white rounded-2xl p-6 text-left transition-all hover:scale-105 shadow-md`}
          >
            <Icon size={32} className="mb-3" />
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-sm opacity-80 mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {panel === 'email' && <EmailForm onClose={() => setPanel(null)} />}
      {panel === 'chat' && <ChatPanel onClose={() => setPanel(null)} />}
    </div>
  )
}
