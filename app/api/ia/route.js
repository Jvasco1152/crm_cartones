import { NextResponse } from 'next/server'
import { chatWithGroq } from '@/lib/groq'

export async function POST(request) {
  try {
    const { messages, context } = await request.json()

    let finalMessages = messages
    if (context && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      finalMessages = [
        ...messages.slice(0, -1),
        {
          role: lastMsg.role,
          content: `Contexto del cliente:\n${JSON.stringify(context, null, 2)}\n\nConsulta: ${lastMsg.content}`,
        },
      ]
    }

    const content = await chatWithGroq(finalMessages)
    return NextResponse.json({ message: content })
  } catch (error) {
    console.error('IA error:', error)
    const msg = error.message?.includes('GROQ_API_KEY')
      ? 'Configura tu GROQ_API_KEY en el archivo .env para usar el asistente IA.'
      : 'Error con el asistente IA. Intenta de nuevo.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
