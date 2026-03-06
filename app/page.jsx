'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, TrendingUp, DollarSign, Activity, CheckSquare, Target, Calendar, ArrowRight } from 'lucide-react'
import { formatCOP, formatDate, timeAgo, COLOR_ETAPA, COLOR_PRIORIDAD } from '@/lib/utils'
import Link from 'next/link'
import clsx from 'clsx'

const ETAPA_COLORS = {
  'Prospección': '#94a3b8',
  'Contacto Inicial': '#60a5fa',
  'Presentación': '#a78bfa',
  'Cotización': '#fbbf24',
  'Negociación': '#fb923c',
}

function KPICard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Cargando dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="card p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold mb-2">Error de conexión</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-3">Verifica las variables de entorno DATABASE_URL y DIRECT_URL en Vercel.</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const chartData = (data.pipelineEtapas || []).map((e) => ({
    name: e.etapa,
    valor: e._sum.valor || 0,
    count: e._count.id,
  }))

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle capitalize">{today}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={Users}
          label="Clientes Activos"
          value={data.clientesActivos}
          sub={`${data.totalClientes} total`}
          color="blue"
        />
        <KPICard
          icon={TrendingUp}
          label="Oportunidades Abiertas"
          value={data.oportunidadesAbiertas}
          sub="En pipeline"
          color="purple"
        />
        <KPICard
          icon={DollarSign}
          label="Valor Pipeline"
          value={formatCOP(data.valorPipeline)}
          sub="Oportunidades activas"
          color="green"
        />
        <KPICard
          icon={Activity}
          label="Actividades Esta Semana"
          value={data.actividadesEstaSemana}
          sub={`${data.tareasPendientes} tareas pendientes`}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Pipeline Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pipeline por Etapa</h2>
            <Link href="/oportunidades" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [formatCOP(value), 'Valor']}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={ETAPA_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
              No hay oportunidades activas
            </div>
          )}
        </div>

        {/* Stats secundarias */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa de Cierre</p>
                <p className="text-2xl font-bold text-gray-900">{data.tasaCierre}%</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{data.tareasPendientes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Oportunidades */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Principales Oportunidades</h2>
            <Link href="/oportunidades" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.topOportunidades.length > 0 ? (
            <div className="space-y-3">
              {data.topOportunidades.map((op) => (
                <div key={op.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{op.titulo}</p>
                    <p className="text-xs text-gray-500">{op.cliente?.empresa}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className={clsx('badge', COLOR_ETAPA[op.etapa])}>{op.etapa}</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCOP(op.valor)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No hay oportunidades activas</p>
          )}
        </div>

        {/* Actividades Recientes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Actividades Recientes</h2>
            <Link href="/actividades" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentActividades.length > 0 ? (
            <div className="space-y-3">
              {data.recentActividades.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{act.cliente?.empresa}</p>
                    <p className="text-xs text-gray-500 truncate">{act.tipo} · {act.descripcion.substring(0, 50)}...</p>
                    <p className="text-xs text-gray-400">{timeAgo(act.fecha)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Sin actividades recientes</p>
          )}
        </div>
      </div>

      {/* Tareas Urgentes */}
      {data.upcomingTareas.length > 0 && (
        <div className="card p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Tareas Próximas
            </h2>
            <Link href="/tareas" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.upcomingTareas.map((t) => (
              <div key={t.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={clsx('badge mt-0.5', COLOR_PRIORIDAD[t.prioridad])}>{t.prioridad}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.titulo}</p>
                  <p className="text-xs text-gray-500">{t.cliente?.empresa || 'General'} · {formatDate(t.fechaLimite)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
