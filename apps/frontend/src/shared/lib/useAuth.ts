import { useState, useEffect } from 'react'
import { getToken, getCurrentFamily } from './auth-storage'

/**
 * Hook to get authentication token from cookies.
 * @param initial - Initial token from SSR (e.g. getServerSideProps) for consistent server/client render.
 */
export function useToken(initial?: string | null): string | null {
  const [token, setToken] = useState<string | null>(() => {
    if (initial !== undefined) return initial
    if (typeof window === 'undefined') return null
    return getToken()
  })

  useEffect(() => {
    setToken(getToken())
    const interval = setInterval(() => {
      const newToken = getToken()
      setToken((prev) => (prev !== newToken ? newToken : prev))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return token
}

/**
 * Hook to get current family ID from cookies
 */
export function useCurrentFamily(): string | null {
  const [familyId, setFamilyId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return getCurrentFamily()
  })

  useEffect(() => {
    // Initial load
    setFamilyId(getCurrentFamily())
    
    // Check family ID periodically to catch cookie changes
    const interval = setInterval(() => {
      const newFamilyId = getCurrentFamily()
      setFamilyId((prevFamilyId) => {
        if (prevFamilyId !== newFamilyId) {
          return newFamilyId
        }
        return prevFamilyId
      })
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return familyId
}
