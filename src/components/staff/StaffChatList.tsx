'use client'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageSquare, Send, X } from 'lucide-react'

type ChatEntry = {
  roomId: string
  userId: string
  userName: string
  unread: number
  messages: { sender: string; message: string; ts: number }[]
}

export function StaffChatList() {
  const [chats, setChats] = useState<Record<string, ChatEntry>>({})
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socket.emit('join:staff')

    socket.on('chat:new_message', (data: { roomId: string; userId: string; userName: string; message: string }) => {
      setChats(prev => {
        const existing = prev[data.roomId]
        return {
          ...prev,
          [data.roomId]: {
            roomId: data.roomId,
            userId: data.userId,
            userName: data.userName,
            unread: activeRoomId === data.roomId ? 0 : (existing?.unread || 0) + 1,
            messages: [
              ...(existing?.messages || []),
              { sender: data.userName, message: data.message, ts: Date.now() },
            ],
          },
        }
      })
    })

    socket.on('chat:message', (data: { roomId: string; sender: string; message: string }) => {
      setChats(prev => {
        const existing = prev[data.roomId]
        if (!existing) return prev
        return {
          ...prev,
          [data.roomId]: {
            ...existing,
            messages: [...existing.messages, { sender: data.sender, message: data.message, ts: Date.now() }],
          },
        }
      })
    })

    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, activeRoomId])

  const openChat = (roomId: string) => {
    setActiveRoomId(roomId)
    socketRef.current?.emit('chat:staff:join', { roomId })
    setChats(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], unread: 0 },
    }))
  }

  const send = () => {
    if (!input.trim() || !activeRoomId) return
    const msg = { sender: 'スタッフ', message: input, ts: Date.now() }
    socketRef.current?.emit('chat:message', { ...msg, roomId: activeRoomId })
    setInput('')
  }

  const activeChat = activeRoomId ? chats[activeRoomId] : null
  const chatList = Object.values(chats)

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <MessageSquare size={18} className="text-blue-600" />
        <h2 className="font-bold text-gray-900">チャット対応</h2>
        {chatList.some(c => c.unread > 0) && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {chatList.reduce((sum, c) => sum + c.unread, 0)}
          </span>
        )}
      </div>

      <div className="flex" style={{ minHeight: 300 }}>
        {/* Left: user list */}
        <div className="w-48 border-r flex flex-col">
          {chatList.length === 0 && (
            <p className="text-xs text-gray-400 p-4">チャット待機中...</p>
          )}
          {chatList.map(chat => (
            <button
              key={chat.roomId}
              onClick={() => openChat(chat.roomId)}
              className={`flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 border-b transition-colors ${
                activeRoomId === chat.roomId ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900 truncate w-24">{chat.userName}</p>
                <p className="text-xs text-gray-400 truncate w-24">
                  {chat.messages[chat.messages.length - 1]?.message || ''}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right: chat window */}
        <div className="flex-1 flex flex-col">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400">ユーザーを選択してください</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{activeChat.userName}</span>
                <button onClick={() => setActiveRoomId(null)}><X size={14} className="text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 240 }}>
                {activeChat.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'スタッフ' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                      m.sender === 'スタッフ' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{m.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="px-4 py-3 border-t flex gap-2">
                <input
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="返信..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button onClick={send} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
