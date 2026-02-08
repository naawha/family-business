import Cookies from 'js-cookie'
import type { RegisterResponseType } from '@family-business/types/modules/accounts'

const TOKEN_COOKIE_KEY = 'family-business-token'
const USER_COOKIE_KEY = 'family-business-user'
const FAMILY_COOKIE_KEY = 'family-business-family-id'

/**
 * Parse cookie string into an object
 * Example: "token=abc; user=123" -> { token: "abc", user: "123" }
 */
function parseCookieString(cookieString: string | undefined): Record<string, string> {
  if (!cookieString) return {}
  
  return cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)
}

/**
 * Get cookie value from various sources (for server-side in Pages Router)
 */
function getCookieFromServer(key: string): string | null {
  // Try to get from process.env or global context if available
  // This is a fallback for server-side rendering in Pages Router
  // In practice, cookies should be passed explicitly via RTK Query context
  if (typeof process !== 'undefined' && (process as any).__NEXT_COOKIES__) {
    const cookies = (process as any).__NEXT_COOKIES__
    return cookies[key] || null
  }
  
  // Try to parse from cookie header if available in global scope
  if (typeof globalThis !== 'undefined' && (globalThis as any).__NEXT_COOKIE_HEADER__) {
    const cookieString = (globalThis as any).__NEXT_COOKIE_HEADER__
    const parsed = parseCookieString(cookieString)
    return parsed[key] || null
  }
  
  return null
}

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
}

export function saveAuth(data: RegisterResponseType): void {
  if (typeof window === 'undefined') return
  try {
    // Save token in cookie
    if (data.token) {
      Cookies.set(TOKEN_COOKIE_KEY, data.token, cookieOptions)
    }
    // Save user data in cookie
    if (data.user) {
      Cookies.set(USER_COOKIE_KEY, JSON.stringify(data.user), cookieOptions)
    }
  } catch {
    // ignore
  }
}

export function loadAuth(cookieHeader?: string): RegisterResponseType | null {
  // Client-side: get from js-cookie
  if (typeof window !== 'undefined') {
    try {
      const token = Cookies.get(TOKEN_COOKIE_KEY)
      const userRaw = Cookies.get(USER_COOKIE_KEY)
      
      if (!token || !userRaw) return null
      
      const user = JSON.parse(userRaw)
      if (!user?.id || !token) return null
      
      return { user, token }
    } catch {
      return null
    }
  }
  
  // Server-side: parse from cookie header (Pages Router)
  if (cookieHeader) {
    try {
      const parsed = parseCookieString(cookieHeader)
      const token = parsed[TOKEN_COOKIE_KEY]
      const userRaw = parsed[USER_COOKIE_KEY]
      
      if (!token || !userRaw) return null
      
      const user = JSON.parse(userRaw)
      if (!user?.id || !token) return null
      
      return { user, token }
    } catch {
      return null
    }
  }
  
  // Fallback: try to get from server context
  try {
    const token = getCookieFromServer(TOKEN_COOKIE_KEY)
    const userRaw = getCookieFromServer(USER_COOKIE_KEY)
    
    if (!token || !userRaw) return null
    
    const user = JSON.parse(userRaw)
    if (!user?.id || !token) return null
    
    return { user, token }
  } catch {
    return null
  }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  try {
    Cookies.remove(TOKEN_COOKIE_KEY)
    Cookies.remove(USER_COOKIE_KEY)
    Cookies.remove(FAMILY_COOKIE_KEY)
  } catch {
    // ignore
  }
}

export function getToken(cookieHeader?: string): string | null {
  // Client-side: get from js-cookie
  if (typeof window !== 'undefined') {
    return Cookies.get(TOKEN_COOKIE_KEY) || null
  }
  
  // Server-side: parse from cookie header (Pages Router)
  if (cookieHeader) {
    const parsed = parseCookieString(cookieHeader)
    return parsed[TOKEN_COOKIE_KEY] || null
  }
  
  // Fallback: try to get from server context
  return getCookieFromServer(TOKEN_COOKIE_KEY)
}

export function saveCurrentFamily(familyId: string): void {
  if (typeof window === 'undefined') return
  try {
    Cookies.set(FAMILY_COOKIE_KEY, familyId, cookieOptions)
  } catch {
    // ignore
  }
}

export function getCurrentFamily(cookieHeader?: string): string | null {
  // Client-side: get from js-cookie
  if (typeof window !== 'undefined') {
    return Cookies.get(FAMILY_COOKIE_KEY) || null
  }
  
  // Server-side: parse from cookie header (Pages Router)
  if (cookieHeader) {
    const parsed = parseCookieString(cookieHeader)
    return parsed[FAMILY_COOKIE_KEY] || null
  }
  
  // Fallback: try to get from server context
  return getCookieFromServer(FAMILY_COOKIE_KEY)
}

// Alias for convenience
export const logout = clearAuth
