import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || ''
    const clienteId = searchParams.get('clienteId') || ''
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = {}
    if (tipo) where.tipo = tipo
    if (clienteId) where.clienteId = clienteId

    const actividades = await prisma.actividad.findMany({
      where,
      take: limit,
      orderBy: { fecha: 'desc' },
      include: { cliente: { select: { id: true, empresa: true } } },
    })

    return NextResponse.json(actividades)
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo actividades' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const actividad = await prisma.actividad.create({
      data: body,
      include: { cliente: { select: { id: true, empresa: true } } },
    })
    return NextResponse.json(actividad, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creando actividad' }, { status: 500 })
  }
}
