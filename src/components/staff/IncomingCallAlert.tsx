'use client'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Phone, PhoneOff } from 'lucide-react'

type IncomingCall = { roomName: string; userName: string; userId: string }

export function IncomingCallAlert() {
  const [call, setCall] = useState<IncomingCall | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('join:staff')
    socket.on('call:incoming', (data: IncomingCall) => {
      setCall(data)
      audioRef.current?.play().catch(() => {})
    })
    socket.on('call:answered', () => setCall(null))
    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [])

  const accept = async () => {
    if (!call) return
    const res = await fetch('/api/livekit/token', {
      method: 'POST',
      body: JSON.stringify({ roomName: call.roomName, participantName: 'staff' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { token } = await res.json()
    socketRef.current?.emit('call:accept', { roomName: call.roomName, userId: call.userId })
    window.location.href = `/ja/staff/call?token=${encodeURIComponent(token)}`
  }

  const reject = () => {
    if (!call) return
    socketRef.current?.emit('call:reject', { userId: call.userId })
    setCall(null)
  }

  if (!call) return null

  return (
    <>
      <audio ref={audioRef} src="/sounds/ringtone.mp3" loop />
      <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-50 w-72">
        <p className="font-bold text-gray-900 mb-1">着信あり</p>
        <p className="text-sm text-gray-500 mb-4">{call.userName} さんからの通話</p>
        <div className="flex gap-3">
          <button onClick={accept} className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600">
            <Phone size={16} /> 応答
          </button>
          <button onClick={reject} className="flex-1 bg-red-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600">
            <PhoneOff size={16} /> 拒否
          </button>
        </div>
      </div>
    </>
  )
}
