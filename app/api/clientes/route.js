import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const ciudad = searchParams.get('ciudad') || ''
    const segmento = searchParams.get('segmento') || ''
    const estado = searchParams.get('estado') || ''

    const where = {}
    if (search) {
      where.OR = [
        { empresa: { contains: search } },
        { contacto: { contains: search } },
        { nit: { contains: search } },
        { email: { contains: search } },
      ]
    }
    if (ciudad) where.ciudad = ciudad
    if (segmento) where.segmento = segmento
    if (estado) where.estado = estado

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: { empresa: 'asc' },
      include: {
        _count: { select: { oportunidades: true, actividades: true } },
      },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo clientes' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const cliente = await prisma.cliente.create({ data: body })
    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creando cliente' }, { status: 500 })
  }
}
