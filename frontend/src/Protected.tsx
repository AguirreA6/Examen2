import React, { useState } from 'react'

type Props = { onLogout: () => void }

export default function Protected({ onLogout }: Props) {
  const [output, setOutput] = useState<string>('Sin datos')

  async function loadTickets() {
    setOutput('Cargando...')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tickets/mis-tickets', {
        headers: token ? { 'Authorization': 'Bearer ' + token } : {}
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.message || 'Error al obtener tickets')
      setOutput(JSON.stringify(body, null, 2))
    } catch (err: any) {
      setOutput(err.message)
      if ((err.message || '').toLowerCase().includes('autentic')) {
        onLogout()
      }
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>Área Protegida</h2>
      <div>
        <button onClick={loadTickets}>Cargar mis tickets</button>
        <button onClick={onLogout} style={{marginLeft:8}}>Cerrar sesión</button>
      </div>
      <pre style={{background:'#f6f8fa',padding:12,marginTop:12}}>{output}</pre>
    </div>
  )
}
