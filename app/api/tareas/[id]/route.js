import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const tarea = await prisma.tarea.update({
      where: { id: params.id },
      data: body,
      include: { cliente: { select: { id: true, empresa: true } } },
    })
    return NextResponse.json(tarea)
  } catch (error) {
    return NextResponse.json({ error: 'Error actualizando tarea' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.tarea.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando tarea' }, { status: 500 })
  }
}
