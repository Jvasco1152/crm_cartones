'use client'
import { useEffect, useState } from 'react'
import { Plus, X, CheckSquare, Square, Trash2, Calendar, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { formatDate, PRIORIDADES, TIPOS_TAREA, COLOR_PRIORIDAD } from '@/lib/utils'

const EMPTY = {
  titulo: '', descripcion: '', fechaLimite: '',
  prioridad: 'Media', tipo: 'Seguimiento', clienteId: '',
}

function isVencida(fecha) {
  return new Date(fecha) < new Date()
}

function Modal({ form, setForm, onClose, onSubmit, loading, clientes }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Nueva Tarea</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Título *</label>
            <input className="input" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required placeholder="¿Qué hay que hacer?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prioridad</label>
              <select className="input" value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}>
                {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tipo</label>
              <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {TIPOS_TAREA.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Fecha Límite *</label>
            <input className="input" type="date" value={form.fechaLimite} onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })} required />
          </div>
          <div>
            <label className="label">Cliente (opcional)</label>
            <select className="input" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">Sin cliente asociado</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.empresa}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Guardando...' : 'Crear Tarea'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TareaItem({ tarea, onToggle, onDelete }) {
  const vencida = !tarea.completada && isVencida(tarea.fechaLimite)
  return (
    <div className={clsx(
      'flex items-start gap-3 p-3 rounded-lg border transition-colors',
      tarea.completada
        ? 'bg-gray-50 border-gray-100 opacity-60'
        : vencida
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
    )}>
      <button onClick={() => onToggle(tarea)} className="mt-0.5 flex-shrink-0">
        {tarea.completada
          ? <CheckSquare className="w-5 h-5 text-green-500" />
          : <Square className="w-5 h-5 text-gray-400 hover:text-blue-500" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', tarea.completada ? 'line-through text-gray-400' : 'text-gray-900')}>
          {tarea.titulo}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {tarea.cliente && (
            <span className="text-xs text-blue-600 font-medium">{tarea.cliente.empresa}</span>
          )}
          <span className="text-xs text-gray-400">{tarea.tipo}</span>
          <div className="flex items-center gap-1">
            {vencida && <AlertCircle className="w-3 h-3 text-red-500" />}
            <span className={clsx('text-xs', vencida ? 'text-red-600 font-medium' : 'text-gray-400')}>
              {formatDate(tarea.fechaLimite)}
            </span>
          </div>
        </div>
        {tarea.descripcion && (
          <p className="text-xs text-gray-500 mt-1 truncate">{tarea.descripcion}</p>
        )}
      </div>
      <button onClick={() => onDelete(tarea.id)} className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function TareasPage() {
  const [tareas, setTareas] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showCompletadas, setShowCompletadas] = useState(false)

  const fetch_ = async () => {
    const [res1, res2] = await Promise.all([fetch('/api/tareas'), fetch('/api/clientes')])
    const [ts, cs] = await Promise.all([res1.json(), res2.json()])
    setTareas(ts)
    setClientes(cs)
  }

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        fechaLimite: new Date(form.fechaLimite).toISOString(),
        clienteId: form.clienteId || null,
      }
      await fetch('/api/tareas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Tarea creada')
      setModal(false)
      setForm(EMPTY)
      fetch_()
    } catch { toast.error('Error') } finally { setSaving(false) }
  }

  const handleToggle = async (tarea) => {
    await fetch(`/api/tareas/${tarea.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada: !tarea.completada }),
    })
    if (!tarea.completada) toast.success('Tarea completada!')
    fetch_()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    await fetch(`/api/tareas/${id}`, { method: 'DELETE' })
    toast.success('Eliminada')
    fetch_()
  }

  const pendientes = tareas.filter((t) => !t.completada)
  const completadas = tareas.filter((t) => t.completada)
  const vencidas = pendientes.filter((t) => isVencida(t.fechaLimite))

  const byPrioridad = {
    Alta: pendientes.filter((t) => t.prioridad === 'Alta'),
    Media: pendientes.filter((t) => t.prioridad === 'Media'),
    Baja: pendientes.filter((t) => t.prioridad === 'Baja'),
  }

  const prioColors = {
    Alta: 'text-red-700 bg-red-50 border-red-200',
    Media: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    Baja: 'text-gray-600 bg-gray-50 border-gray-200',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tareas</h1>
          <p className="page-subtitle">
            {pendientes.length} pendientes
            {vencidas.length > 0 && <span className="text-red-600 ml-2">· {vencidas.length} vencidas</span>}
          </p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Tarea
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
      ) : pendientes.length === 0 && completadas.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Sin tareas. Crea la primera.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Por prioridad */}
          {Object.entries(byPrioridad).map(([prioridad, items]) => (
            items.length > 0 && (
              <div key={prioridad}>
                <div className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3', prioColors[prioridad])}>
                  <span>{prioridad}</span>
                  <span className="font-bold">({items.length})</span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <TareaItem key={t.id} tarea={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )
          ))}

          {/* Completadas */}
          {completadas.length > 0 && (
            <div>
              <button
                onClick={() => setShowCompletadas(!showCompletadas)}
                className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1"
              >
                <CheckSquare className="w-4 h-4" />
                {showCompletadas ? 'Ocultar' : 'Mostrar'} completadas ({completadas.length})
              </button>
              {showCompletadas && (
                <div className="space-y-2">
                  {completadas.map((t) => (
                    <TareaItem key={t.id} tarea={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {modal && (
        <Modal form={form} setForm={setForm} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving} clientes={clientes} />
      )}
    </div>
  )
}
