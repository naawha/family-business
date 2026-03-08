import { io, Socket } from 'socket.io-client'
import { API_URL } from '@/shared/config'

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('notify_debug=1')

let socket: Socket | null = null
let currentFamilyId: string | null = null

/**
 * Get socket.io server URL. In dev API is on different port; in prod same origin.
 */
function getSocketUrl(): string {
  if (typeof window === 'undefined') return API_URL
  // Production: API and socket.io are on same origin (nginx proxies both)
  const apiHost = new URL(API_URL).host
  const currentHost = window.location.host
  if (apiHost === currentHost) {
    return window.location.origin
  }
  // Dev: API on different port (e.g. 3000 vs 3001)
  return API_URL.replace(/\/$/, '').replace(/\/api\/?$/, '')
}

/**
 * Get or create socket.io connection.
 */
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null

  if (!socket) {
    const url = getSocketUrl()
    if (DEBUG) console.log('[Notifications] Socket URL:', url)
    socket = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
    socket.on('connect', () => {
      if (DEBUG) console.log('[Notifications] Socket connected:', socket?.id)
      // При каждом connect (в т.ч. после reconnect) — снова входим в комнату
      if (currentFamilyId) {
        socket?.emit('family:join', currentFamilyId)
        if (DEBUG) console.log('[Notifications] Re-joined family room on reconnect:', currentFamilyId)
      }
    })
    socket.on('connect_error', (err) => {
      console.warn('[Notifications] Socket connect error:', err.message)
    })
    socket.on('disconnect', (reason) => {
      if (DEBUG) console.log('[Notifications] Socket disconnected:', reason)
    })
  }

  return socket
}

/**
 * Connect socket and join family room.
 * При reconnect (мобильный браузер возвращает приложение из фона) — автоматически переподключаемся к комнате.
 */
export function connectSocket(familyId: string): void {
  const s = getSocket()
  if (!s) return

  currentFamilyId = familyId

  const doJoin = () => {
    s.emit('family:join', familyId)
    if (DEBUG) console.log('[Notifications] Joined family room:', familyId)
  }
  if (s.connected) {
    doJoin()
    return
  }
  s.connect()
  s.once('connect', doJoin)
}

/**
 * Disconnect and leave family.
 */
export function disconnectSocket(familyId?: string): void {
  const s = getSocket()
  if (!s) return

  if (familyId) {
    s.emit('family:leave', familyId)
    if (currentFamilyId === familyId) currentFamilyId = null
  }
  s.disconnect()
}

/**
 * Subscribe to socket events.
 */
export function onSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
): () => void {
  const s = getSocket()
  if (!s) return () => {}

  s.on(event, handler)
  return () => s.off(event, handler)
}
