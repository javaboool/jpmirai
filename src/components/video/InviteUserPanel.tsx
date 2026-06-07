'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { UserPlus, Phone, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

type User = { clerk_user_id: string; name: string }

type Props = {
  roomName: string
}

export function InviteUserPanel({ roomName }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [calling, setCalling] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/users/lookup?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setUsers(data.users || [])
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const callUser = async (user: User) => {
    setCalling(user.clerk_user_id)
    const res = await fetch('/api/livekit/token', {
      method: 'POST',
      body: JSON.stringify({ roomName, participantName: user.name }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { token } = await res.json()
    socketRef.current?.emit('staff:call:user', {
      targetUserId: user.clerk_user_id,
      roomName,
      staffSocketId: socketRef.current.id,
    })
    setTimeout(() => setCalling(null), 10000)
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-white/90 backdrop-blur text-gray-800 px-3 py-2 rounded-xl shadow flex items-center gap-2 text-sm font-medium hover:bg-white"
        >
          <UserPlus size={16} /> ユーザーを招待
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-72 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-gray-900">ユーザーを招待</span>
            <button onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <Input
            placeholder="名前で検索..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="mb-3"
            autoFocus
          />
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {users.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">
                {query ? 'ユーザーが見つかりません' : '名前を入力してください'}
              </p>
            )}
            {users.map(u => (
              <div key={u.clerk_user_id} className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-800">{u.name}</span>
                <button
                  onClick={() => callUser(u)}
                  disabled={calling === u.clerk_user_id}
                  className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                >
                  <Phone size={12} />
                  {calling === u.clerk_user_id ? '発信中...' : '呼ぶ'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
