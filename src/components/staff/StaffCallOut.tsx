'use client'
import { useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Phone, PhoneOff, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type State = 'idle' | 'calling' | 'connected'

export function StaffCallOut() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<State>('idle')
  const [targetName, setTargetName] = useState('')
  const socketRef = useRef<Socket | null>(null)

  const startCall = async () => {
    if (!query.trim()) return

    // Find user by name
    const res = await fetch(`/api/users/lookup?email=${encodeURIComponent(query)}`)
    if (!res.ok) {
      alert('ユーザーが見つかりません')
      return
    }
    const user = await res.json()
    setTargetName(user.name || user.clerk_user_id)

    // Get token
    const roomName = `staff-call-${Date.now()}`
    const tokenRes = await fetch('/api/livekit/token', {
      method: 'POST',
      body: JSON.stringify({ roomName, participantName: 'staff' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { token } = await tokenRes.json()

    // Notify user via Socket.io
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('staff:call:user', {
      targetUserId: user.clerk_user_id,
      roomName,
      staffToken: token,
    })
    socket.on('user:call:accepted', () => {
      setState('connected')
      window.location.href = `/ja/staff/call?token=${encodeURIComponent(token)}`
    })
    socket.on('user:call:rejected', () => {
      setState('idle')
      alert(`${targetName} さんが応答しませんでした`)
    })
    socketRef.current = socket
    setState('calling')
  }

  const cancel = () => {
    socketRef.current?.disconnect()
    setState('idle')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
      <h2 className="font-bold text-gray-900 mb-4">ユーザーに発信</h2>
      {state === 'idle' && (
        <div className="flex gap-2">
          <Input
            placeholder="ユーザー名を入力..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startCall()}
          />
          <Button onClick={startCall} className="bg-purple-600 hover:bg-purple-700">
            <Phone size={16} className="mr-1" /> 発信
          </Button>
        </div>
      )}
      {state === 'calling' && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 animate-pulse">
            <Phone size={18} className="text-purple-600" />
            <span className="text-sm text-gray-600">{targetName} さんを呼び出し中...</span>
          </div>
          <Button variant="destructive" size="sm" onClick={cancel}>
            <PhoneOff size={14} className="mr-1" /> キャンセル
          </Button>
        </div>
      )}
    </div>
  )
}
