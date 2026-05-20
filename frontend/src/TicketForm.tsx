import React, { useEffect, useState } from 'react'
import { getAuthHeader } from './auth'

type Category = {
  id: number
  nombre: string
}

type Props = {
  onTicketCreated?: () => void
}

const PRIORITIES = [
  { value: '', label: 'Selecciona prioridad' },
  { value: 'BAJA', label: 'Baja' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRITICA', label: 'Crítica' }
]

export default function TicketForm({ onTicketCreated }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categorias', { headers: getAuthHeader() })
        if (!res.ok) throw new Error('No se pudieron cargar las categorías')
        const body = await res.json()
        setCategories(body.data || [])
      } catch (err: any) {
        setError(err.message)
      }
    }

    loadCategories()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!titulo.trim() || !descripcion.trim() || !prioridad) {
      setError('Completa título, descripción y prioridad')
      return
    }

    setLoading(true)
    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        categoriaId: categoriaId ? Number(categoriaId) : null
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(payload)
      })

      const body = await res.json()
      if (!res.ok || !body?.success) {
        throw new Error(body?.message || 'Error creando ticket')
      }

      setSuccess('Ticket creado correctamente')
      setTitulo('')
      setDescripcion('')
      setPrioridad('')
      setCategoriaId('')
      onTicketCreated?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 16, padding: 16, border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}>
      <h3>Crear nuevo ticket</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Título</label>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título del ticket"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Describe el problema o la solicitud"
            rows={4}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Prioridad</label>
            <select
              value={prioridad}
              onChange={e => setPrioridad(e.target.value)}
              style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            >
              {PRIORITIES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Categoría</label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            >
              <option value="">Sin categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 16px' }}>
            {loading ? 'Creando...' : 'Crear ticket'}
          </button>
          {success && <span style={{ color: 'green' }}>{success}</span>}
        </div>

        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      </form>
    </div>
  )
}
