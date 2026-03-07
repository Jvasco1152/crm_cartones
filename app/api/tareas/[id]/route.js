import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const tarea = await prisma.tarea.update({
      where: { id },
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
    const { id } = await params
    await prisma.tarea.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando tarea' }, { status: 500 })
  }
}
