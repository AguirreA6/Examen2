import React, { useEffect, useState } from 'react'
import { getAuthHeader, removeToken } from './auth'

type Props = { onLogout: () => void; user?: any }

export default function Protected({ onLogout, user }: Props) {
  const [output, setOutput] = useState<string>('Sin datos')

  useEffect(() => {
    if (!user) {
      // if no user info, force logout
      onLogout()
    }
  }, [user])

  async function loadTickets() {
    setOutput('Cargando...')
    try {
      const res = await fetch('/api/tickets/mis-tickets', {
        headers: getAuthHeader()
      })
      if (res.status === 401 || res.status === 403) {
        // unauthenticated
        removeToken()
        onLogout()
        return
      }
      const body = await res.json()
      if (!res.ok) throw new Error(body?.message || 'Error al obtener tickets')
      setOutput(JSON.stringify(body, null, 2))
    } catch (err: any) {
      setOutput(err.message)
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>Área Protegida</h2>
      {user && <p>Conectado como <strong>{user.sub || user.username || user.nombre || 'usuario'}</strong></p>}
      <div>
        <button onClick={loadTickets}>Cargar mis tickets</button>
        <button onClick={() => { removeToken(); onLogout() }} style={{marginLeft:8}}>Cerrar sesión</button>
      </div>
      <pre style={{background:'#f6f8fa',padding:12,marginTop:12}}>{output}</pre>
    </div>
  )
}
