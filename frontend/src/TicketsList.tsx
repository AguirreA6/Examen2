import React, { useEffect, useState } from 'react'
import { getAuthHeader } from './auth'

type Ticket = {
    id: number
    titulo: string
    status: string
    prioridad: string
    categoriaNombre?: string
    asignadoAUsername?: string
    asignadoANombreCompleto?: string
    creadoPorUsername?: string
    createdAt?: string
}

const STATUSES = ['', 'ABIERTO', 'EN_PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO']
const PRIORITIES = ['', 'BAJA', 'MEDIA', 'ALTA', 'CRITICA']

export default function TicketsList() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')

    async function loadAll() {
        setLoading(true); setError(null)
        try {
            const res = await fetch('/api/tickets', { headers: getAuthHeader() })
            if (!res.ok) throw new Error('Error cargando tickets')
            const body = await res.json()
            setTickets(body.data || [])
        } catch (err: any) {
            setError(err.message)
        } finally { setLoading(false) }
    }

    async function loadFiltered() {
        setLoading(true); setError(null)
        try {
            let res
            if (statusFilter && !priorityFilter) {
                res = await fetch(`/api/tickets/estado/${statusFilter}`, { headers: getAuthHeader() })
            } else if (priorityFilter && !statusFilter) {
                res = await fetch(`/api/tickets/prioridad/${priorityFilter}`, { headers: getAuthHeader() })
            } else {
                res = await fetch('/api/tickets', { headers: getAuthHeader() })
            }
            if (!res.ok) throw new Error('Error cargando tickets')
            const body = await res.json()
            let data = body.data || []
            if (statusFilter && priorityFilter) {
                data = data.filter((t: any) => t.status === statusFilter && t.prioridad === priorityFilter)
            }
            setTickets(data)
        } catch (err: any) {
            setError(err.message)
        } finally { setLoading(false) }
    }

    useEffect(() => { loadAll() }, [])

    return (
        <div style={{ marginTop: 12 }}>
            <h3>Listado de Tickets</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <label>Estado:
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ marginLeft: 6 }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s || 'Todos'}</option>)}
                    </select>
                </label>
                <label>Prioridad:
                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ marginLeft: 6 }}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p || 'Todas'}</option>)}
                    </select>
                </label>
                <button onClick={loadFiltered}>Aplicar filtros</button>
                <button onClick={loadAll}>Limpiar</button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Titulo</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Estado</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Prioridad</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Categoria</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Asignado</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Creado por</th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 6 }}>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(t => (
                        <tr key={t.id}>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.titulo}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.status}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.prioridad}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.categoriaNombre}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.asignadoAUsername || t.asignadoANombreCompleto || '-'}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.creadoPorUsername}</td>
                            <td style={{ padding: 6, borderBottom: '1px solid #f1f1f1' }}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
