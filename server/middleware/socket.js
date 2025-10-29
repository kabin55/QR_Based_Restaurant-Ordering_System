import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
  const url = process.env.FRONTEND_URL
  // console.log('Initializing Socket.io with CORS for:', url)
  io = new Server(server, {
    cors: {
      origin: url,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  io.on('connection', (socket) => {
    // console.log('New client connected:', socket.id)

    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!')
  }
  return io
}
