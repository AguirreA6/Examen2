import React, { useEffect, useState } from 'react'
import Login from './Login'
import Protected from './Protected'
import { getToken, isTokenValid, decodeToken, removeToken } from './auth'

export default function App() {
  const [token, setToken] = useState<string | null>(() => getToken())
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const t = getToken()
    if (!t || !isTokenValid()) {
      removeToken()
      setToken(null)
      setUser(null)
      return
    }
    setToken(t)
    setUser(decodeToken())
  }, [])

  function handleLogin(newToken: string) {
    setToken(newToken)
    setUser(decodeToken())
  }

  function handleLogout() {
    removeToken()
    setToken(null)
    setUser(null)
  }

  return (
    <div>
      {token ? (
        <Protected onLogout={handleLogout} user={user} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}
