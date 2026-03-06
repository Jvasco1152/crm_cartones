import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const etapa = searchParams.get('etapa') || ''
    const clienteId = searchParams.get('clienteId') || ''

    const where = {}
    if (etapa) where.etapa = etapa
    if (clienteId) where.clienteId = clienteId

    const oportunidades = await prisma.oportunidad.findMany({
      where,
      orderBy: { valor: 'desc' },
      include: { cliente: { select: { id: true, empresa: true, ciudad: true, segmento: true } } },
    })

    return NextResponse.json(oportunidades)
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo oportunidades' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const oportunidad = await prisma.oportunidad.create({
      data: body,
      include: { cliente: { select: { id: true, empresa: true } } },
    })
    return NextResponse.json(oportunidad, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creando oportunidad' }, { status: 500 })
  }
}
