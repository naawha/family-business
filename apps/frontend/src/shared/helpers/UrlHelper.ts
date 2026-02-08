const PROTECTED_PREFIXES = ['/dashboard', '/profile']

export function _getIsProtectedUrl(path: string): boolean {
  return PROTECTED_PREFIXES.some((p) => path.startsWith(p))
}

export default { _getIsProtectedUrl }
