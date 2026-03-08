import { FC, useEffect, useCallback } from 'react'
import { useStore } from 'react-redux'
import { notifications } from '@mantine/notifications'

const DEBUG =
  typeof window !== 'undefined' && window.location.search.includes('notify_debug=1')
import {
  connectSocket,
  disconnectSocket,
  onSocketEvent,
} from '@/shared/lib/socket'
import { useFamily } from '@/models/accounts'
import { RTK_TAGS, type RtkTagType } from '@/shared/api'
import MainService from '@/shared/api/service'

// Уведомления только при создании задач и товаров
const NOTIFICATION_EVENTS = ['todo:created', 'shopping:created'] as const
const NOTIFICATION_TITLES: Record<string, string> = {
  'todo:created': 'Новая задача',
  'shopping:created': 'Добавлен товар',
}

const INVALIDATE_TAGS: Record<string, { type: RtkTagType; id?: string }[]> = {
  'todo:created': [{ type: RTK_TAGS.Todo, id: 'LIST' }],
  'todo:updated': [{ type: RTK_TAGS.Todo, id: 'LIST' }],
  'todo:deleted': [{ type: RTK_TAGS.Todo, id: 'LIST' }],
  'shopping:created': [{ type: RTK_TAGS.ShoppingItem, id: 'LIST' }],
  'shopping:updated': [{ type: RTK_TAGS.ShoppingItem, id: 'LIST' }],
  'shopping:deleted': [{ type: RTK_TAGS.ShoppingItem, id: 'LIST' }],
}

function getNotificationMessage(event: string, data: unknown): string {
  if (typeof data !== 'object' || data === null) return ''
  const d = data as Record<string, unknown>
  if (event.startsWith('todo') && d.title) return String(d.title)
  if (event.startsWith('shopping') && d.name) return String(d.name)
  if (event.startsWith('planned') && d.name) return String(d.name)
  return ''
}

function showNotification(event: string, data: unknown): void {
  // Показываем уведомление только при создании задач и товаров
  if (!NOTIFICATION_EVENTS.includes(event as (typeof NOTIFICATION_EVENTS)[number])) return

  const title = NOTIFICATION_TITLES[event] || 'Обновление'
  const message = getNotificationMessage(event, data)

  if (DEBUG) {
    console.log('[Notifications] Showing:', title, message, 'document.hidden:', document?.hidden, 'permission:', typeof Notification !== 'undefined' ? Notification.permission : 'N/A')
  }

  if (typeof document !== 'undefined' && document.hidden) {
    // App in background — use browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message || 'Есть новые изменения',
        icon: '/icons/icon-192x192.png',
        tag: event,
      })
    }
  } else {
    // App visible — use Mantine notifications
    notifications.show({
      title,
      message: message || 'Обновите страницу',
      color: 'green',
    })
  }
}

interface NotificationProviderProps {
  familyId: string | null
  children?: React.ReactNode
}

export const NotificationProviderInner: FC<NotificationProviderProps> = ({
  familyId,
  children,
}) => {
  const store = useStore()

  const handleSocketEvent = useCallback(
    (event: string) => (data: unknown) => {
      if (DEBUG) console.log('[Notifications] Event received:', event, data)
      const tags = INVALIDATE_TAGS[event]
      if (tags) {
        store.dispatch(MainService.util.invalidateTags(tags))
      }
      showNotification(event, data)
    },
    [store]
  )

  useEffect(() => {
    if (!familyId) {
      if (DEBUG) console.log('[Notifications] No familyId, skipping socket')
      return
    }
    if (DEBUG) console.log('[Notifications] Setting up socket for family:', familyId)

    connectSocket(familyId)

    const unsubscribes: (() => void)[] = []
    const events = Object.keys(INVALIDATE_TAGS)
    for (const event of events) {
      unsubscribes.push(onSocketEvent(event, handleSocketEvent(event)))
    }
    // Отладка: family:presence приходит при входе в комнату — проверка, что события доходят
    const unsubPresence = onSocketEvent('family:presence', (data: unknown) => {
      if (DEBUG) console.log('[Notifications] family:presence received (socket OK):', data)
    })
    unsubscribes.push(unsubPresence)

    return () => {
      unsubscribes.forEach((unsub) => unsub())
      disconnectSocket(familyId)
    }
  }, [familyId, handleSocketEvent])

  return <>{children}</>
}

/**
 * Wrapper that provides familyId from auth. Use this in _app.
 */
export const NotificationProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { family } = useFamily()
  const familyId = family?.id ?? null
  if (DEBUG) console.log('[Notifications] familyId:', familyId, '(from API)')
  return (
    <NotificationProviderInner familyId={familyId}>
      {children}
    </NotificationProviderInner>
  )
}

export default NotificationProvider
