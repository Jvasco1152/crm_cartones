'use client'
import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User, Bot, Loader2, Trash2, ChevronDown, X } from 'lucide-react'
import clsx from 'clsx'

const QUICK_ACTIONS = [
  { label: 'Analizar mi pipeline', prompt: 'Analiza mi pipeline actual y dime en qué oportunidades debería enfocarme esta semana para maximizar cierres. Trabajo en Cartones América vendiendo embalaje de cartón corrugado en Antioquia.' },
  { label: 'Email de seguimiento', prompt: 'Redacta un email profesional de seguimiento para un cliente del sector plásticos en Medellín que no ha respondido mi cotización de cajas corrugadas hace 3 días.' },
  { label: 'Script para llamada', prompt: 'Dame un script para llamar a un cliente prospecto del sector alimentos en el Área Metropolitana de Medellín y presentarle nuestra oferta de cajas de cartón corrugado de Cartones América.' },
  { label: 'Estrategia sector flores', prompt: 'Dame 5 estrategias específicas para aumentar ventas en el sector floricultor de Rionegro y el Oriente Antioqueño, considerando temporadas (San Valentín, Día de la Madre) y los tipos de caja que necesitan.' },
  { label: 'Mensaje WhatsApp', prompt: 'Redacta un mensaje de WhatsApp corto y efectivo para reactivar un cliente que lleva un tiempo sin comprar cajas de Cartones América.' },
  { label: 'Manejo de objeción precio', prompt: 'Dame argumentos para manejar la objeción "su precio es más alto que la competencia" cuando vendo cajas de cartón corrugado en Antioquia. ¿Cómo defiendo el valor de Cartones América?' },
  { label: 'Propuesta de valor', prompt: 'Ayúdame a construir una propuesta de valor diferenciadora para Cartones América frente a competidores de embalaje en Antioquia, destacando calidad, servicio y tiempos de entrega.' },
  { label: 'Preparar visita cliente', prompt: 'Tengo una visita mañana con una empresa del sector mascotas en Itagüí. ¿Qué debo investigar antes, qué preguntas hacer y qué productos de Cartones América recomendar?' },
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-600'
      )}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
      </div>
      <div className={clsx(
        'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isUser
          ? 'bg-blue-600 text-white rounded-tr-sm'
          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
      )}>
        {msg.content.split('\n').map((line, i) => (
          line ? <p key={i} className="mb-1 last:mb-0">{line}</p> : <br key={i} />
        ))}
      </div>
    </div>
  )
}

export default function IAPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente comercial de Cartones América. Estoy aquí para ayudarte a cerrar más negocios, redactar comunicaciones y analizar tu cartera de clientes.\n\n¿En qué te puedo ayudar hoy?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState([])
  const [clienteCtx, setClienteCtx] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/clientes').then((r) => r.json()).then(setClientes)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const context = clienteCtx
        ? clientes.find((c) => c.id === clienteCtx)
        : null

      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })
      const data = await res.json()

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${data.error}` }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.message }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Error de conexión. Por favor intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Chat reiniciado! ¿En qué te puedo ayudar?',
    }])
  }

  const selectedCliente = clientes.find((c) => c.id === clienteCtx)

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="page-header flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="page-title">IA Asistente</h1>
            <p className="page-subtitle">Powered by Groq · llama-3.3-70b-versatile</p>
          </div>
        </div>
        <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-xs">
          <Trash2 className="w-3.5 h-3.5" /> Limpiar chat
        </button>
      </div>

      {/* Acciones rápidas */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => send(action.prompt)}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contexto de cliente */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <select
            className="input w-64 text-sm"
            value={clienteCtx}
            onChange={(e) => setClienteCtx(e.target.value)}
          >
            <option value="">Sin contexto de cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.empresa} — {c.ciudad}</option>
            ))}
          </select>
          {selectedCliente && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xs text-blue-700 font-medium">Contexto: {selectedCliente.empresa}</span>
              <button onClick={() => setClienteCtx('')} className="text-blue-400 hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        {selectedCliente && (
          <p className="text-xs text-gray-400 mt-1 ml-1">
            La IA usará los datos de este cliente en sus respuestas
          </p>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 card overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 mt-3">
        <div className="flex gap-2">
          <textarea
            className="input flex-1 resize-none"
            rows={2}
            placeholder="Escribe tu consulta... (Enter para enviar, Shift+Enter para nueva línea)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-primary px-4 self-end flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Enviar
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Necesitas una API key de Groq (gratuita) en <code className="bg-gray-100 px-1 rounded">.env</code> como <code className="bg-gray-100 px-1 rounded">GROQ_API_KEY</code>
        </p>
      </div>
    </div>
  )
}
