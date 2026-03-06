import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const completada = searchParams.get('completada')
    const prioridad = searchParams.get('prioridad') || ''

    const where = {}
    if (completada !== null && completada !== '') where.completada = completada === 'true'
    if (prioridad) where.prioridad = prioridad

    const tareas = await prisma.tarea.findMany({
      where,
      orderBy: [{ completada: 'asc' }, { prioridad: 'asc' }, { fechaLimite: 'asc' }],
      include: { cliente: { select: { id: true, empresa: true } } },
    })

    return NextResponse.json(tareas)
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo tareas' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const tarea = await prisma.tarea.create({
      data: body,
      include: { cliente: { select: { id: true, empresa: true } } },
    })
    return NextResponse.json(tarea, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creando tarea' }, { status: 500 })
  }
}
