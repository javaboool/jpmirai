'use client'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { X, Send } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

type Message = { sender: string; message: string; ts: number }
type Props = { onClose: () => void }

export function ChatPanel({ onClose }: Props) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const roomId = `chat-${user?.id || 'anon'}`
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('join:chat', { roomId })
    socket.on('chat:message', (data: Message) => setMessages(p => [...p, data]))
    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [roomId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const msg: Message = { sender: user?.fullName || 'ユーザー', message: input, ts: Date.now() }
    socketRef.current?.emit('chat:message', { ...msg, roomId })
    setMessages(p => [...p, msg])
    setInput('')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-96">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-bold text-gray-900">チャット</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === (user?.fullName || 'ユーザー') ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${m.sender === (user?.fullName || 'ユーザー') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
              <p>{m.message}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="メッセージを入力..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
