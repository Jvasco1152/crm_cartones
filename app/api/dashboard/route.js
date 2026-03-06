import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() + 1)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const [
      totalClientes,
      clientesActivos,
      oportunidadesAbiertas,
      totalOportunidades,
      ganadas,
      actividadesEstaSemana,
      tareasPendientes,
      pipelineEtapas,
      recentActividades,
      upcomingTareas,
      topOportunidades,
      valorPipeline,
    ] = await Promise.all([
      prisma.cliente.count(),
      prisma.cliente.count({ where: { estado: 'Activo' } }),
      prisma.oportunidad.count({ where: { etapa: { notIn: ['Ganado', 'Perdido'] } } }),
      prisma.oportunidad.count(),
      prisma.oportunidad.count({ where: { etapa: 'Ganado' } }),
      prisma.actividad.count({ where: { fecha: { gte: weekStart, lte: weekEnd } } }),
      prisma.tarea.count({ where: { completada: false } }),
      prisma.oportunidad.groupBy({
        by: ['etapa'],
        _count: { id: true },
        _sum: { valor: true },
        where: { etapa: { notIn: ['Ganado', 'Perdido'] } },
      }),
      prisma.actividad.findMany({
        take: 6,
        orderBy: { fecha: 'desc' },
        include: { cliente: { select: { empresa: true } } },
      }),
      prisma.tarea.findMany({
        take: 5,
        where: { completada: false },
        orderBy: [{ prioridad: 'asc' }, { fechaLimite: 'asc' }],
        include: { cliente: { select: { empresa: true } } },
      }),
      prisma.oportunidad.findMany({
        take: 5,
        where: { etapa: { notIn: ['Ganado', 'Perdido'] } },
        orderBy: { valor: 'desc' },
        include: { cliente: { select: { empresa: true } } },
      }),
      prisma.oportunidad.aggregate({
        _sum: { valor: true },
        where: { etapa: { notIn: ['Ganado', 'Perdido'] } },
      }),
    ])

    const tasaCierre = totalOportunidades > 0
      ? Math.round((ganadas / totalOportunidades) * 100)
      : 0

    return NextResponse.json({
      totalClientes,
      clientesActivos,
      oportunidadesAbiertas,
      valorPipeline: valorPipeline._sum.valor || 0,
      actividadesEstaSemana,
      tareasPendientes,
      tasaCierre,
      pipelineEtapas,
      recentActividades,
      upcomingTareas,
      topOportunidades,
    })
  } catch (error) {
    console.error('Dashboard error:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Error cargando dashboard' }, { status: 500 })
  }
}
