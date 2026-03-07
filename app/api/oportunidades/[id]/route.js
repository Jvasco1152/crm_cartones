import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const oportunidad = await prisma.oportunidad.update({
      where: { id: params.id },
      data: body,
      include: { cliente: { select: { id: true, empresa: true } } },
    })
    return NextResponse.json(oportunidad)
  } catch (error) {
    console.error('PUT oportunidad error:', error)
    return NextResponse.json({ error: 'Error actualizando oportunidad', detail: error?.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.oportunidad.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando oportunidad' }, { status: 500 })
  }
}
