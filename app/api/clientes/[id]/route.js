import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        oportunidades: { orderBy: { createdAt: 'desc' } },
        actividades: { orderBy: { fecha: 'desc' } },
        tareas: { orderBy: { fechaLimite: 'asc' }, where: { completada: false } },
      },
    })
    if (!cliente) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo cliente' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const cliente = await prisma.cliente.update({ where: { id: params.id }, data: body })
    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Error actualizando cliente' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.cliente.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando cliente' }, { status: 500 })
  }
}
