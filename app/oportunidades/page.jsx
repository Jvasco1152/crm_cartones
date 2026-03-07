'use client'
import { useEffect, useState } from 'react'
import { Plus, X, TrendingUp, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import {
  formatCOP, formatDate, formatDateInput,
  ETAPAS, ETAPAS_ABIERTAS, PRODUCTOS, PROBABILIDADES_ETAPA,
  COLOR_ETAPA,
} from '@/lib/utils'

const EMPTY = {
  titulo: '', clienteId: '', valor: '', etapa: 'Prospección',
  probabilidad: 10, fechaCierre: '', producto: '', descripcion: '', notasSeguimiento: '',
}

function OportunidadModal({ title, form, setForm, onClose, onSubmit, loading, clientes }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={onSubmit} className="overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <label className="label">Título *</label>
              <input className="input" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required placeholder="Ej: Suministro anual cajas corrugadas" />
            </div>
            <div>
              <label className="label">Cliente *</label>
              <select className="input" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} required>
                <option value="">Seleccionar cliente...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.empresa}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Valor (COP) *</label>
                <input className="input" type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required placeholder="15000000" />
              </div>
              <div>
                <label className="label">Etapa</label>
                <select className="input" value={form.etapa} onChange={(e) => setForm({ ...form, etapa: e.target.value, probabilidad: PROBABILIDADES_ETAPA[e.target.value] })}>
                  {ETAPAS.map((et) => <option key={et}>{et}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Probabilidad: {form.probabilidad}%</label>
                <input className="input" type="range" min="0" max="100" step="5" value={form.probabilidad} onChange={(e) => setForm({ ...form, probabilidad: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="label">Fecha Cierre Estimada</label>
                <input className="input" type="date" value={form.fechaCierre} onChange={(e) => setForm({ ...form, fechaCierre: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Producto</label>
              <select className="input" value={form.producto} onChange={(e) => setForm({ ...form, producto: e.target.value })}>
                <option value="">Seleccionar...</option>
                {PRODUCTOS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Descripción</label>
              <textarea className="input" rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div>
              <label className="label">Notas de Seguimiento</label>
              <textarea className="input" rows={2} value={form.notasSeguimiento} onChange={(e) => setForm({ ...form, notasSeguimiento: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OportunidadCard({ op, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">{op.titulo}</p>
        <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
          <button onClick={() => onEdit(op)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Edit2 className="w-3 h-3" /></button>
          <button onClick={() => onDelete(op.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">{op.cliente?.empresa}</p>
      <p className="text-base font-bold text-gray-900 mb-2">{formatCOP(op.valor)}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{op.probabilidad}% prob.</span>
        {op.fechaCierre && <span>{formatDate(op.fechaCierre)}</span>}
      </div>
      {op.producto && (
        <p className="text-xs text-gray-400 mt-1 truncate">{op.producto}</p>
      )}
    </div>
  )
}

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [vista, setVista] = useState('kanban')

  const fetch_ = async () => {
    const [res1, res2] = await Promise.all([fetch('/api/oportunidades'), fetch('/api/clientes')])
    const [ops, clis] = await Promise.all([res1.json(), res2.json()])
    setOportunidades(ops)
    setClientes(clis)
  }

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [])

  const openEdit = (op) => {
    setSelected(op)
    setForm({
      titulo: op.titulo, clienteId: op.clienteId, valor: op.valor,
      etapa: op.etapa, probabilidad: op.probabilidad,
      fechaCierre: formatDateInput(op.fechaCierre), producto: op.producto || '',
      descripcion: op.descripcion || '', notasSeguimiento: op.notasSeguimiento || '',
    })
    setModal('edit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        valor: parseFloat(form.valor) || 0,
        probabilidad: parseInt(form.probabilidad),
        fechaCierre: form.fechaCierre ? new Date(form.fechaCierre).toISOString() : null,
      }
      if (modal === 'new') {
        await fetch('/api/oportunidades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        toast.success('Oportunidad creada')
      } else {
        await fetch(`/api/oportunidades/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        setOportunidades((prev) => prev.map((o) => o.id === selected.id ? { ...o, ...payload } : o))
        toast.success('Oportunidad actualizada')
      }
      setModal(null)
      fetch_()
    } catch { toast.error('Error') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta oportunidad?')) return
    await fetch(`/api/oportunidades/${id}`, { method: 'DELETE' })
    toast.success('Eliminada')
    fetch_()
  }

  const abiertas = oportunidades.filter((o) => !['Ganado', 'Perdido'].includes(o.etapa))
  const valorTotal = abiertas.reduce((s, o) => s + o.valor, 0)

  // Kanban columns
  const columnas = ETAPAS.map((etapa) => ({
    etapa,
    ops: oportunidades.filter((o) => o.etapa === etapa),
    valor: oportunidades.filter((o) => o.etapa === etapa).reduce((s, o) => s + o.valor, 0),
  }))

  return (
    <div className="max-w-full">
      <div className="page-header">
        <div>
          <h1 className="page-title">Oportunidades</h1>
          <p className="page-subtitle">Pipeline: <strong className="text-green-700">{formatCOP(valorTotal)}</strong> · {abiertas.length} abiertas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setVista('kanban')} className={clsx('px-3 py-1 text-xs rounded-md transition-colors', vista === 'kanban' ? 'bg-white shadow text-gray-900' : 'text-gray-500')}>Kanban</button>
            <button onClick={() => setVista('lista')} className={clsx('px-3 py-1 text-xs rounded-md transition-colors', vista === 'lista' ? 'bg-white shadow text-gray-900' : 'text-gray-500')}>Lista</button>
          </div>
          <button onClick={() => { setForm(EMPTY); setModal('new') }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
      ) : vista === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columnas.map(({ etapa, ops, valor }) => (
            <div key={etapa} className="flex-shrink-0 w-56">
              <div className={clsx('rounded-lg px-3 py-2 mb-3 flex items-center justify-between', COLOR_ETAPA[etapa])}>
                <span className="font-medium text-sm">{etapa}</span>
                <span className="text-xs font-bold">{ops.length}</span>
              </div>
              {valor > 0 && <p className="text-xs text-gray-500 mb-2 px-1">{formatCOP(valor)}</p>}
              <div className="space-y-2">
                {ops.map((op) => (
                  <OportunidadCard key={op.id} op={op} onEdit={openEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {oportunidades.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Sin oportunidades. Crea la primera.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Oportunidad</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Cliente</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Etapa</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Valor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Cierre</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Prob.</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {oportunidades.map((op) => (
                  <tr key={op.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{op.titulo}</p>
                      {op.producto && <p className="text-xs text-gray-400">{op.producto}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{op.cliente?.empresa}</td>
                    <td className="px-4 py-3"><span className={clsx('badge', COLOR_ETAPA[op.etapa])}>{op.etapa}</span></td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCOP(op.valor)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(op.fechaCierre)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{op.probabilidad}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(op)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(op.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {modal && (
        <OportunidadModal
          title={modal === 'new' ? 'Nueva Oportunidad' : 'Editar Oportunidad'}
          form={form}
          setForm={setForm}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          loading={saving}
          clientes={clientes}
        />
      )}
    </div>
  )
}
