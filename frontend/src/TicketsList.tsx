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

type Props = {
    userRole?: string
}

const STATUSES = ['', 'ABIERTO', 'EN_PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO']
const PRIORITIES = ['', 'BAJA', 'MEDIA', 'ALTA', 'CRITICA']

const STATUS_BADGES: Record<string, { background: string; color: string }> = {
    ABIERTO: { background: '#d1fae5', color: '#166534' },
    EN_PROCESO: { background: '#dbeafe', color: '#1d4ed8' },
    PENDIENTE: { background: '#fef3c7', color: '#92400e' },
    RESUELTO: { background: '#ccfbf1', color: '#0f766e' },
    CERRADO: { background: '#e2e8f0', color: '#334155' }
}

function getStatusBadgeStyle(status: string) {
    return STATUS_BADGES[status] || { background: '#f8fafc', color: '#334155' }
}

export default function TicketsList({ userRole }: Props) {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [statusUpdating, setStatusUpdating] = useState<Record<number, boolean>>({})

    const canFilter = userRole === 'ADMIN' || userRole === 'TECNICO'
    const canUpdateStatus = canFilter

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

    async function changeTicketStatus(ticketId: number, newStatus: string) {
        if (!newStatus) return

        setStatusUpdating(prev => ({ ...prev, [ticketId]: true }))
        setError(null)
        try {
            const res = await fetch(`/api/tickets/${ticketId}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ status: newStatus })
            })
            const body = await res.json()
            if (!res.ok || !body?.success) {
                throw new Error(body?.message || 'Error actualizando estado')
            }
            setTickets(prev => prev.map(ticket => ticket.id === ticketId ? body.data : ticket))
        } catch (err: any) {
            setError(err.message)
        } finally {
            setStatusUpdating(prev => ({ ...prev, [ticketId]: false }))
        }
    }

    useEffect(() => { loadAll() }, [])

    return (
        <div style={{ marginTop: 12 }}>
            <h3>Listado de Tickets</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <div>
                    <strong>Rol:</strong> {userRole || 'desconocido'}
                </div>
                {canFilter ? (
                    <>
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
                    </>
                ) : (
                    <div style={{ color: '#555', fontSize: 14 }}>
                        Los filtros de estado y prioridad están disponibles solo para ADMIN y TECNICO.
                    </div>
                )}
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'grid', gap: 16, marginTop: 12 }}>
                {tickets.map(t => (
                    <div key={t.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                            <h4 style={{ margin: 0 }}>{t.titulo}</h4>
                            <span style={{ color: '#555', fontSize: 14 }}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div style={{ display: 'grid', gap: 8 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ ...getStatusBadgeStyle(t.status), padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, display: 'inline-block' }}>{t.status}</span>
                                <span style={{ color: '#555', fontSize: 14 }}>Prioridad: {t.prioridad}</span>
                            </div>
                            {canUpdateStatus && (
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <strong style={{ color: '#333' }}>Cambiar estado:</strong>
                                    <select
                                        value={t.status}
                                        onChange={e => changeTicketStatus(t.id, e.target.value)}
                                        disabled={statusUpdating[t.id]}
                                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc' }}
                                    >
                                        {STATUSES.filter(Boolean).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {statusUpdating[t.id] && <span style={{ fontSize: 12, color: '#555' }}>Actualizando...</span>}
                                </label>
                            )}
                            <p style={{ margin: 0 }}><strong>Categoría:</strong> {t.categoriaNombre || 'Sin categoría'}</p>
                            <p style={{ margin: 0 }}><strong>Asignado a:</strong> {t.asignadoAUsername || t.asignadoANombreCompleto || 'Sin asignar'}</p>
                            <p style={{ margin: 0 }}><strong>Creado por:</strong> {t.creadoPorUsername || '-'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
