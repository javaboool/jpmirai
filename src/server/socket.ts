import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'https://project-14qf9.vercel.app'],
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  socket.on('join:staff', () => socket.join('staff-room'))
  socket.on('join:user', (userId: string) => socket.join(`user:${userId}`))
  socket.on('join:chat', ({ roomId }: { roomId: string }) => socket.join(roomId))

  socket.on('call:request', (data: { roomName: string; userName: string; userId: string }) => {
    io.to('staff-room').emit('call:incoming', data)
  })

  socket.on('call:accept', (data: { roomName: string; userId: string }) => {
    io.to(`user:${data.userId}`).emit('call:accepted', { roomName: data.roomName })
    io.to('staff-room').emit('call:answered', { roomName: data.roomName })
  })

  socket.on('call:reject', (data: { userId: string }) => {
    io.to(`user:${data.userId}`).emit('call:rejected')
  })

  // Staff initiates call to specific user
  socket.on('staff:call:user', (data: { targetUserId: string; roomName: string }) => {
    io.to(`user:${data.targetUserId}`).emit('staff:incoming:call', {
      roomName: data.roomName,
      staffSocketId: socket.id,
    })
  })
  socket.on('user:call:accepted', (data: { staffSocketId: string; roomName: string }) => {
    io.to(data.staffSocketId).emit('user:call:accepted')
  })
  socket.on('user:call:rejected', (data: { staffSocketId: string }) => {
    io.to(data.staffSocketId).emit('user:call:rejected')
  })

  socket.on('chat:message', (data: { roomId: string; message: string; sender: string }) => {
    io.to(data.roomId).emit('chat:message', data)
  })
})

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3001
httpServer.listen(PORT, () => console.log(`Socket.io server on :${PORT}`))
