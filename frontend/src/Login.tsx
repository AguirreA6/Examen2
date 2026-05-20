import React, { useState } from 'react'
import { setToken } from './auth'

type Props = { onLogin: (token: string) => void }

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const body = await res.json()
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || 'Error de autenticación')
      }
      const token = body.data?.token
      if (!token) throw new Error('Token no presente')
      setToken(token)
      onLogin(token)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{maxWidth:360,margin:'40px auto',padding:16,border:'1px solid #ddd',borderRadius:8}}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={submit}>
        <div>
          <label>Usuario</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div style={{marginTop:12}}>
          <button type="submit">Entrar</button>
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  )
}
