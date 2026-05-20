// Minimal JWT utilities (no external deps)
export type JwtPayload = {
  sub?: string;
  exp?: number;
  [key: string]: any;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    // decodeURIComponent to handle unicode
    const decoded = decodeURIComponent(json.split('').map(function(c){
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: 'Bearer ' + token } : {}
}

export function decodeToken() {
  const token = getToken()
  if (!token) return null
  return parseJwt(token)
}

export function isTokenValid(): boolean {
  const payload = decodeToken()
  if (!payload) return false
  if (!payload.exp) return true // no exp claim -> assume valid
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}
