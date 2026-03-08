import { useState, useEffect, useCallback } from 'react'

export type NotificationPermissionState = 'default' | 'granted' | 'denied'

/**
 * Hook for managing browser notification permission.
 */
export function useNotificationPermission(): {
  permission: NotificationPermissionState
  isSupported: boolean
  requestPermission: () => Promise<boolean>
} {
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }
    return (Notification.permission as NotificationPermissionState) || 'default'
  })

  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  useEffect(() => {
    if (!isSupported) return
    setPermission(Notification.permission as NotificationPermissionState)
  }, [isSupported])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false
    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionState)
      return result === 'granted'
    } catch {
      return false
    }
  }, [isSupported])

  return { permission, isSupported, requestPermission }
}
