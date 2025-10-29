import { io } from 'socket.io-client'

const SOCKET_URL = `${import.meta.env.VITE_Web_SocketFrontend_URL}`
// console.log('Connecting to Socket.IO server at:', SOCKET_URL)

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
})

socket.on('connect', () => {
  // console.log('Connected to Socket.IO server:', socket.id)
})

socket.on('disconnect', () => {
  // console.log('Disconnected from Socket.IO server')
})
socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message)
})

socket.on('ordersUpdated', (data) => {
  // console.log('Orders updated:', data)
  const sound = document.getElementById('notification-sound')
  if (sound) {
    sound.play().catch((err) => {
      console.warn('Autoplay blocked until user interacts:', err)
    })
  }
})
