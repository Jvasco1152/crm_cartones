'use client'
import { useEffect, useState } from 'react'
import { Plus, X, Trash2, Phone, Mail, MessageSquare, Users, FileText, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { formatDate, formatDateInput, TIPOS_ACTIVIDAD, COLOR_ACTIVIDAD, COLOR_RESULTADO } from '@/lib/utils'

const EMPTY = {
  tipo: 'Llamada', fecha: new Date().toISOString().slice(0, 16),
  descripcion: '', resultado: 'Positivo', proximaAccion: '',
  fechaProxima: '', clienteId: '',
}

const TIPO_ICON = {
  'Llamada': Phone, 'Email': Mail, 'WhatsApp': MessageSquare,
  'Visita': Users, 'Reunión': Users, 'Cotización Enviada': FileText,
  'Propuesta': FileText, 'Otro': Activity,
}

function Modal({ form, setForm, onClose, onSubmit, loading, clientes }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Nueva Actividad</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={onSubmit} className="overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {TIPOS_ACTIVIDAD.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fecha y Hora</label>
              <input className="input" type="datetime-local" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Cliente *</label>
            <select className="input" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} required>
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.empresa}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Descripción *</label>
            <textarea className="input" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required placeholder="¿Qué pasó en esta actividad?" />
          </div>
          <div>
            <label className="label">Resultado</label>
            <select className="input" value={form.resultado} onChange={(e) => setForm({ ...form, resultado: e.target.value })}>
              {['Positivo', 'Neutral', 'Negativo', 'Sin Respuesta'].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Próxima Acción</label>
            <input className="input" value={form.proximaAccion} onChange={(e) => setForm({ ...form, proximaAccion: e.target.value })} placeholder="¿Qué sigue?" />
          </div>
          <div>
            <label className="label">Fecha Próxima Acción</label>
            <input className="input" type="date" value={form.fechaProxima} onChange={(e) => setForm({ ...form, fechaProxima: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Guardando...' : 'Registrar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ActividadesPage() {
  const [actividades, setActividades] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filterTipo, setFilterTipo] = useState('')
  const [filterCliente, setFilterCliente] = useState('')

  const fetch_ = async () => {
    const params = new URLSearchParams()
    if (filterTipo) params.set('tipo', filterTipo)
    if (filterCliente) params.set('clienteId', filterCliente)
    params.set('limit', '100')
    const [res1, res2] = await Promise.all([fetch(`/api/actividades?${params}`), fetch('/api/clientes')])
    const [acts, clis] = await Promise.all([res1.json(), res2.json()])
    setActividades(acts)
    setClientes(clis)
  }

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [filterTipo, filterCliente])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        fecha: new Date(form.fecha).toISOString(),
        fechaProxima: form.fechaProxima ? new Date(form.fechaProxima).toISOString() : null,
        proximaAccion: form.proximaAccion || null,
        resultado: form.resultado || null,
      }
      await fetch('/api/actividades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Actividad registrada')
      setModal(false)
      setForm(EMPTY)
      fetch_()
    } catch { toast.error('Error') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta actividad?')) return
    await fetch(`/api/actividades/${id}`, { method: 'DELETE' })
    toast.success('Eliminada')
    fetch_()
  }

  // Agrupar por fecha
  const grouped = actividades.reduce((acc, act) => {
    const key = new Date(act.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(act)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">Actividades</h1>
          <p className="page-subtitle">{actividades.length} registros</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Registrar
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <select className="input w-44" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {TIPOS_ACTIVIDAD.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="input w-52" value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)}>
          <option value="">Todos los clientes</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.empresa}</option>)}
        </select>
        {(filterTipo || filterCliente) && (
          <button onClick={() => { setFilterTipo(''); setFilterCliente('') }} className="btn-secondary flex items-center gap-1">
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
      ) : actividades.length === 0 ? (
        <div className="card p-12 text-center">
          <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Sin actividades registradas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([fecha, acts]) => (
            <div key={fecha}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 capitalize">{fecha}</h3>
              <div className="space-y-2">
                {acts.map((act) => {
                  const Icon = TIPO_ICON[act.tipo] || Activity
                  const colorClass = COLOR_ACTIVIDAD[act.tipo] || 'bg-gray-400'
                  return (
                    <div key={act.id} className="card p-4 flex items-start gap-4">
                      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-gray-900">{act.tipo}</span>
                              {act.resultado && (
                                <span className={clsx('text-xs font-medium', COLOR_RESULTADO[act.resultado])}>
                                  {act.resultado}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-blue-600">{act.cliente?.empresa}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-gray-400">
                              {new Date(act.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button onClick={() => handleDelete(act.id)} className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{act.descripcion}</p>
                        {act.proximaAccion && (
                          <div className="mt-2 flex items-start gap-1.5">
                            <span className="text-xs text-orange-500 font-medium flex-shrink-0">Siguiente:</span>
                            <span className="text-xs text-gray-600">{act.proximaAccion}</span>
                            {act.fechaProxima && <span className="text-xs text-gray-400">· {formatDate(act.fechaProxima)}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal form={form} setForm={setForm} onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving} clientes={clientes} />
      )}
    </div>
  )
}
