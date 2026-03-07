import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await prisma.actividad.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando actividad' }, { status: 500 })
  }
}
