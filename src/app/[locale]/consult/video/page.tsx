'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
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
  const [incomingCall, setIncomingCall] = useState<{ roomName: string; staffSocketId: string } | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Listen for incoming calls from staff
  useEffect(() => {
    if (!user?.id) return
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('join:user', user.id)
    socket.on('staff:incoming:call', (data: { roomName: string; staffSocketId: string }) => {
      setIncomingCall(data)
    })
    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [user?.id])

  const acceptIncoming = async () => {
    if (!incomingCall) return
    const res = await fetch('/api/livekit/token', {
      method: 'POST',
      body: JSON.stringify({ roomName: incomingCall.roomName, participantName: user?.fullName || 'user' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { token: t } = await res.json()
    socketRef.current?.emit('user:call:accepted', { staffSocketId: incomingCall.staffSocketId, roomName: incomingCall.roomName })
    setToken(t)
    setIncomingCall(null)
    setState('connected')
  }

  const rejectIncoming = () => {
    if (!incomingCall) return
    socketRef.current?.emit('user:call:rejected', { staffSocketId: incomingCall.staffSocketId })
    setIncomingCall(null)
  }

  const startCall = async () => {
    setState('dialing')
    const roomName = `consult-${Date.now()}`
    let t: string
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        body: JSON.stringify({ roomName, participantName: user?.fullName || 'user' }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data.token) throw new Error('No token in response')
      t = data.token
    } catch (e) {
      setState('idle')
      alert('LiveKit未設定。.env.localにLIVEKIT_API_KEY/SECRETを設定してください。')
      return
    }
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

  // Incoming call from staff popup
  if (incomingCall && state === 'idle') {
    return (
      <>
        <Header />
        <main className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <p className="font-bold text-gray-900 text-lg mb-2">スタッフから着信</p>
            <p className="text-sm text-gray-500 mb-6">ビデオ通話に招待されています</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={acceptIncoming} className="bg-green-500 hover:bg-green-600 px-8">応答</Button>
              <Button variant="destructive" onClick={rejectIncoming} className="px-8">拒否</Button>
            </div>
          </div>
        </main>
      </>
    )
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
