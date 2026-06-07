import { io } from 'socket.io-client'

let socket = null
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL.replace('/api', '')

export const getSocket = () => socket

export const connectSocket = (token) => {
  if (socket?.connected) return socket
  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000
  })
  socket.on('connect_error', (err) => console.warn('Socket error:', err.message))
  return socket
}

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null }
}
