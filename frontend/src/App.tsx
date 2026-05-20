import React, { useState } from 'react'
import Login from './Login'
import Protected from './Protected'

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  function handleLogin(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <div>
      {token ? (
        <Protected onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}
