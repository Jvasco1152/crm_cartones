'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, Phone, Mail, Building2, X, ChevronDown, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import {
  formatCOP, formatDate, formatDateInput,
  CIUDADES, SEGMENTOS, ESTADOS_CLIENTE, PRODUCTOS,
  COLOR_ESTADO,
} from '@/lib/utils'

const EMPTY = {
  empresa: '', nit: '', codigoCliente: '', ciudad: 'Medellín', segmento: 'Industrial',
  marcaProducto: '', contacto: '', cargo: '', telefono: '', celular: '', email: '', web: '',
  direccion: '', estado: 'Prospecto', condicionPago: '',
  contactoCompras: '', telefonoCompras: '', emailCompras: '',
  contactoPagos: '', telefonoPagos: '', emailPagos: '',
  horarioEntregas: '', cierreFacturacion: '', citasEntrega: '',
  volumenMensual: '', productosInteres: '', notas: '', pendientes: '',
}

function SectionTitle({ children }) {
  return <p className="col-span-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mt-3 pb-1 border-b border-blue-100">{children}</p>
}

function Field({ label, value, onChange, type = 'text', required, placeholder, span2 }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="label">{label}{required && ' *'}</label>
      <input className="input" type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} />
    </div>
  )
}

function Modal({ title, onClose, onSubmit, loading, form, setForm }) {
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4">

            <SectionTitle>Datos Generales</SectionTitle>
            <Field label="Empresa" value={form.empresa} onChange={f('empresa')} required span2 />
            <Field label="NIT" value={form.nit} onChange={f('nit')} placeholder="900.123.456-1" />
            <Field label="Código Cliente (SAP)" value={form.codigoCliente} onChange={f('codigoCliente')} />
            <div>
              <label className="label">Ciudad</label>
              <select className="input" value={form.ciudad} onChange={f('ciudad')}>
                {CIUDADES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Segmento</label>
              <select className="input" value={form.segmento} onChange={f('segmento')}>
                {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={form.estado} onChange={f('estado')}>
                {ESTADOS_CLIENTE.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <Field label="Marca / Producto que vende" value={form.marcaProducto} onChange={f('marcaProducto')} />
            <Field label="Web" value={form.web} onChange={f('web')} placeholder="empresa.com" />
            <Field label="Dirección" value={form.direccion} onChange={f('direccion')} span2 />

            <SectionTitle>Contacto Principal</SectionTitle>
            <Field label="Nombre" value={form.contacto} onChange={f('contacto')} />
            <Field label="Cargo" value={form.cargo} onChange={f('cargo')} />
            <Field label="Teléfono" value={form.telefono} onChange={f('telefono')} />
            <Field label="Celular / WhatsApp" value={form.celular} onChange={f('celular')} />
            <Field label="Email" value={form.email} onChange={f('email')} type="email" span2 />

            <SectionTitle>Contacto Compras</SectionTitle>
            <Field label="Nombre" value={form.contactoCompras} onChange={f('contactoCompras')} />
            <Field label="Teléfono" value={form.telefonoCompras} onChange={f('telefonoCompras')} />
            <Field label="Email" value={form.emailCompras} onChange={f('emailCompras')} type="email" span2 />

            <SectionTitle>Contacto Pagos / Contabilidad</SectionTitle>
            <Field label="Nombre" value={form.contactoPagos} onChange={f('contactoPagos')} />
            <Field label="Teléfono" value={form.telefonoPagos} onChange={f('telefonoPagos')} />
            <Field label="Email" value={form.emailPagos} onChange={f('emailPagos')} type="email" span2 />

            <SectionTitle>Condiciones Comerciales</SectionTitle>
            <Field label="Condición de Pago" value={form.condicionPago} onChange={f('condicionPago')} placeholder="CUPO $50.000.000 - CREDITO 60 días" span2 />
            <Field label="Horario de Entregas" value={form.horarioEntregas} onChange={f('horarioEntregas')} placeholder="L-V 7am-5pm" />
            <Field label="Cierre de Facturación (día)" value={form.cierreFacturacion} onChange={f('cierreFacturacion')} type="number" placeholder="29" />
            <Field label="Citas de Entrega" value={form.citasEntrega} onChange={f('citasEntrega')} span2 placeholder="Avisar 1 día antes" />
            <Field label="Volumen Mensual Estimado (COP)" value={form.volumenMensual} onChange={f('volumenMensual')} type="number" placeholder="5000000" span2 />

            <SectionTitle>Producto y Notas</SectionTitle>
            <div className="col-span-2">
              <label className="label">Productos de Interés</label>
              <select className="input" value={form.productosInteres} onChange={f('productosInteres')}>
                <option value="">Seleccionar...</option>
                {PRODUCTOS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Notas</label>
              <textarea className="input" rows={2} value={form.notas} onChange={f('notas')} />
            </div>
            <div className="col-span-2">
              <label className="label">Pendientes</label>
              <textarea className="input" rows={2} value={form.pendientes} onChange={f('pendientes')} placeholder="Acciones pendientes con JP o con el cliente..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div>
      <span className="text-gray-500 text-xs">{label}</span>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2 pb-1 border-b border-blue-100">{title}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function DetailModal({ cliente, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold">{cliente.empresa}</h2>
            <p className="text-sm text-gray-500">
              {cliente.marcaProducto && <span className="mr-2">{cliente.marcaProducto} ·</span>}
              {cliente.segmento} · {cliente.ciudad}
              {cliente.codigoCliente && <span className="ml-2 text-xs text-gray-400">Cód. {cliente.codigoCliente}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="btn-secondary flex items-center gap-2"><Edit2 className="w-4 h-4" />Editar</button>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>
        <div className="overflow-y-auto p-5 space-y-5">

          <DetailSection title="Contacto Principal">
            <InfoRow label="Nombre" value={cliente.contacto || '—'} />
            <InfoRow label="Cargo" value={cliente.cargo} />
            <InfoRow label="Teléfono" value={cliente.telefono} />
            <InfoRow label="Celular / WhatsApp" value={cliente.celular} />
            <InfoRow label="Email" value={cliente.email} />
            <InfoRow label="Web" value={cliente.web} />
          </DetailSection>

          {(cliente.contactoCompras || cliente.telefonoCompras || cliente.emailCompras) && (
            <DetailSection title="Contacto Compras">
              <InfoRow label="Nombre" value={cliente.contactoCompras} />
              <InfoRow label="Teléfono" value={cliente.telefonoCompras} />
              <InfoRow label="Email" value={cliente.emailCompras} />
            </DetailSection>
          )}

          {(cliente.contactoPagos || cliente.telefonoPagos || cliente.emailPagos) && (
            <DetailSection title="Contacto Pagos / Contabilidad">
              <InfoRow label="Nombre" value={cliente.contactoPagos} />
              <InfoRow label="Teléfono" value={cliente.telefonoPagos} />
              <InfoRow label="Email" value={cliente.emailPagos} />
            </DetailSection>
          )}

          {(cliente.condicionPago || cliente.horarioEntregas || cliente.cierreFacturacion || cliente.citasEntrega || cliente.volumenMensual) && (
            <DetailSection title="Condiciones Comerciales">
              <InfoRow label="Condición de Pago" value={cliente.condicionPago} />
              <InfoRow label="Horario de Entregas" value={cliente.horarioEntregas} />
              <InfoRow label="Cierre de Facturación" value={cliente.cierreFacturacion ? `Día ${cliente.cierreFacturacion}` : null} />
              <InfoRow label="Citas de Entrega" value={cliente.citasEntrega} />
              <InfoRow label="Vol. Mensual Est." value={formatCOP(cliente.volumenMensual)} />
              <InfoRow label="NIT" value={cliente.nit} />
            </DetailSection>
          )}

          {(cliente.notas || cliente.pendientes) && (
            <div className="space-y-2">
              {cliente.notas && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Notas</p>
                  <p className="text-sm">{cliente.notas}</p>
                </div>
              )}
              {cliente.pendientes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700 font-semibold mb-1">Pendientes</p>
                  <p className="text-sm text-yellow-900">{cliente.pendientes}</p>
                </div>
              )}
            </div>
          )}

          {cliente.oportunidades?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Oportunidades ({cliente.oportunidades.length})</h3>
              <div className="space-y-2">
                {cliente.oportunidades.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                    <span className="truncate">{op.titulo}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-gray-500">{op.etapa}</span>
                      <span className="font-semibold text-gray-900">{formatCOP(op.valor)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cliente.actividades?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Últimas Actividades</h3>
              <div className="space-y-2">
                {cliente.actividades.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-2 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{act.tipo}</span>
                      <span className="text-xs text-gray-500">{formatDate(act.fecha)}</span>
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{act.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'new' | 'edit' | 'detail'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ ciudad: '', segmento: '', estado: '' })

  const fetchClientes = async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filters.ciudad) params.set('ciudad', filters.ciudad)
    if (filters.segmento) params.set('segmento', filters.segmento)
    if (filters.estado) params.set('estado', filters.estado)
    const res = await fetch(`/api/clientes?${params}`)
    const data = await res.json()
    setClientes(data)
  }

  useEffect(() => {
    fetchClientes().finally(() => setLoading(false))
  }, [search, filters])

  const openDetail = async (id) => {
    const res = await fetch(`/api/clientes/${id}`)
    const data = await res.json()
    setSelected(data)
    setModal('detail')
  }

  const openEdit = (cliente) => {
    setSelected(cliente)
    setForm({
      empresa: cliente.empresa || '',
      nit: cliente.nit || '',
      codigoCliente: cliente.codigoCliente || '',
      ciudad: cliente.ciudad || 'Medellín',
      segmento: cliente.segmento || 'Industrial',
      marcaProducto: cliente.marcaProducto || '',
      contacto: cliente.contacto || '',
      cargo: cliente.cargo || '',
      telefono: cliente.telefono || '',
      celular: cliente.celular || '',
      email: cliente.email || '',
      web: cliente.web || '',
      direccion: cliente.direccion || '',
      estado: cliente.estado || 'Prospecto',
      condicionPago: cliente.condicionPago || '',
      contactoCompras: cliente.contactoCompras || '',
      telefonoCompras: cliente.telefonoCompras || '',
      emailCompras: cliente.emailCompras || '',
      contactoPagos: cliente.contactoPagos || '',
      telefonoPagos: cliente.telefonoPagos || '',
      emailPagos: cliente.emailPagos || '',
      horarioEntregas: cliente.horarioEntregas || '',
      cierreFacturacion: cliente.cierreFacturacion || '',
      citasEntrega: cliente.citasEntrega || '',
      volumenMensual: cliente.volumenMensual || '',
      productosInteres: cliente.productosInteres || '',
      notas: cliente.notas || '',
      pendientes: cliente.pendientes || '',
    })
    setModal('edit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        volumenMensual: form.volumenMensual ? parseFloat(form.volumenMensual) : null,
        cierreFacturacion: form.cierreFacturacion ? parseInt(form.cierreFacturacion) : null,
      }
      if (modal === 'new') {
        await fetch('/api/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        toast.success('Cliente creado')
      } else {
        await fetch(`/api/clientes/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        toast.success('Cliente actualizado')
      }
      setModal(null)
      fetchClientes()
    } catch {
      toast.error('Error guardando cliente')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente y todos sus datos?')) return
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    toast.success('Cliente eliminado')
    fetchClientes()
    setModal(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.length} registros</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setModal('new') }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar empresa, contacto, NIT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-40" value={filters.ciudad} onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}>
          <option value="">Todas las ciudades</option>
          {CIUDADES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input w-40" value={filters.segmento} onChange={(e) => setFilters({ ...filters, segmento: e.target.value })}>
          <option value="">Todos los segmentos</option>
          {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-40" value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}>
          <option value="">Todos los estados</option>
          {ESTADOS_CLIENTE.map((e) => <option key={e}>{e}</option>)}
        </select>
        {(filters.ciudad || filters.segmento || filters.estado || search) && (
          <button onClick={() => { setFilters({ ciudad: '', segmento: '', estado: '' }); setSearch('') }} className="btn-secondary flex items-center gap-1">
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : clientes.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay clientes. Crea el primero.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Empresa</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Ciudad</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Segmento</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Contacto</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Vol. Mensual</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{c.empresa}</p>
                      {c.marcaProducto
                        ? <p className="text-xs text-gray-400">{c.marcaProducto}</p>
                        : c.nit && <p className="text-xs text-gray-400">{c.nit}</p>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{c.ciudad}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{c.segmento}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{c.contacto}</p>
                    {c.cargo && <p className="text-xs text-gray-400">{c.cargo}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 hidden lg:table-cell">{formatCOP(c.volumenMensual)}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', COLOR_ESTADO[c.estado])}>{c.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(c.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {(modal === 'new' || modal === 'edit') && (
        <Modal
          title={modal === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          loading={saving}
          form={form}
          setForm={setForm}
        />
      )}
      {modal === 'detail' && selected && (
        <DetailModal
          cliente={selected}
          onClose={() => setModal(null)}
          onEdit={() => { setModal(null); setTimeout(() => openEdit(selected), 50) }}
        />
      )}
    </div>
  )
}
