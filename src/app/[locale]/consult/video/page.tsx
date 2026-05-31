'use client'
import { useState } from 'react'
import { io } from 'socket.io-client'
import { Header } from '@/components/layout/Header'
import { VideoCallRoom } from '@/components/video/VideoCallRoom'
import { CallDialing } from '@/components/video/CallDialing'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@clerk/nextjs'

type State = 'idle' | 'dialing' | 'connected'

export default function VideoCallPage() {
  const { user } = useUser()
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [token, setToken] = useState('')

  const startCall = async () => {
    setState('dialing')
    const roomName = `consult-${Date.now()}`
    const res = await fetch('/api/livekit/token', {
      method: 'POST',
      body: JSON.stringify({ roomName, participantName: user?.fullName || 'user' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { token: t } = await res.json()
    setToken(t)
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('join:user', user?.id || 'anon')
    socket.emit('call:request', { roomName, userName: user?.fullName || 'user', userId: user?.id || 'anon' })
    socket.on('call:accepted', () => setState('connected'))
    socket.on('call:rejected', () => { setState('idle'); alert('スタッフが対応できません') })
  }

  if (state === 'connected' && token) {
    return <VideoCallRoom token={token} onDisconnect={() => { setState('idle'); router.push('/consult') }} />
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        {state === 'idle' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">ビデオ通話</h1>
            <p className="text-gray-500 text-sm mb-8">スタッフに接続します</p>
            <Button size="lg" onClick={startCall} className="rounded-full px-10 bg-purple-600 hover:bg-purple-700">
              通話を開始する
            </Button>
          </>
        )}
        {state === 'dialing' && <CallDialing onCancel={() => setState('idle')} />}
      </main>
    </>
  )
}
