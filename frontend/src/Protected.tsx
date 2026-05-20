import React, { useEffect, useState } from 'react'
import { getAuthHeader, removeToken } from './auth'
import TicketsList from './TicketsList'
import TicketForm from './TicketForm'

type Props = { onLogout: () => void; user?: any }

export default function Protected({ onLogout, user }: Props) {
  const [output, setOutput] = useState<string>('Sin datos')
  const [showList, setShowList] = useState(false)
  const [listKey, setListKey] = useState(0)

  const role = user?.role
    || (Array.isArray(user?.roles) && user.roles.length > 0
      ? user.roles[0].replace('ROLE_', '')
      : undefined)

  useEffect(() => {
    if (!user) {
      onLogout()
    }
  }, [user])

  return (
    <div style={{padding:16}}>
      <h2>Área Protegida</h2>
      {user && <p>Conectado como <strong>{user.sub || user.username || user.nombre || 'usuario'}</strong></p>}
      <div style={{marginBottom:8}}>
        <button onClick={() => setShowList(s => !s)} style={{marginLeft:8}}>{showList ? 'Ocultar listado' : 'Ver listado'}</button>
        <button onClick={() => { removeToken(); onLogout() }} style={{marginLeft:8}}>Cerrar sesión</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Rol:</strong> {role || 'desconocido'}
      </div>
      <TicketForm onTicketCreated={() => setListKey(k => k + 1)} />
      {showList ? <TicketsList key={listKey} userRole={role} /> : <pre style={{background:'#f6f8fa',padding:12,marginTop:12}}>{output}</pre>}
    </div>
  )
}
