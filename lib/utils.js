export function formatCOP(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateInput(date) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export function timeAgo(date) {
  const now = new Date()
  const d = new Date(date)
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days < 7) return `hace ${days}d`
  return formatDate(date)
}

export const CIUDADES = [
  'Medellín', 'Sabaneta', 'Itagüí', 'La Estrella', 'Guarne',
  'Rionegro', 'Caldas', 'Bello', 'Girardota', 'Envigado',
  'Barbosa', 'Copacabana', 'Bogotá', 'Cali', 'Barranquilla',
  'Bucaramanga', 'Pereira', 'Otra',
]

export const SEGMENTOS = [
  'Plásticos', 'Alimentos', 'Bebidas', 'Cosméticos', 'Farmacéutico',
  'Textil', 'Industrial', 'Impresos', 'Químicos', 'Mascotas', 'Otro',
]

export const ESTADOS_CLIENTE = ['Activo', 'Inactivo', 'Prospecto', 'En Negociación', 'Cotización', 'Nuevo', 'Retomar', 'Reactivar']

export const ETAPAS = [
  'Prospección', 'Contacto Inicial', 'Presentación',
  'Cotización', 'Negociación', 'Ganado', 'Perdido',
]

export const ETAPAS_ABIERTAS = ['Prospección', 'Contacto Inicial', 'Presentación', 'Cotización', 'Negociación']

export const TIPOS_ACTIVIDAD = [
  'Llamada', 'Visita', 'Email', 'WhatsApp', 'Reunión',
  'Cotización Enviada', 'Propuesta', 'Otro',
]

export const PRIORIDADES = ['Alta', 'Media', 'Baja']

export const TIPOS_TAREA = ['Llamada', 'Visita', 'Email', 'WhatsApp', 'Seguimiento', 'Otro']

export const PRODUCTOS = [
  'Caja de Cartón Corrugado Simple',
  'Caja de Cartón Corrugado Doble',
  'Cartón Plegadizo',
  'Láminas de Cartón',
  'Empaques Especiales',
  'Cajas de Flor',
  'Embalaje Industrial',
  'Displays Comerciales',
  'Otro',
]

export const PROBABILIDADES_ETAPA = {
  'Prospección': 10,
  'Contacto Inicial': 20,
  'Presentación': 40,
  'Cotización': 60,
  'Negociación': 80,
  'Ganado': 100,
  'Perdido': 0,
}

export const COLOR_ETAPA = {
  'Prospección': 'bg-gray-100 text-gray-700',
  'Contacto Inicial': 'bg-blue-100 text-blue-700',
  'Presentación': 'bg-purple-100 text-purple-700',
  'Cotización': 'bg-yellow-100 text-yellow-800',
  'Negociación': 'bg-orange-100 text-orange-700',
  'Ganado': 'bg-green-100 text-green-700',
  'Perdido': 'bg-red-100 text-red-700',
}

export const COLOR_ESTADO = {
  'Activo': 'bg-green-100 text-green-700',
  'Inactivo': 'bg-gray-100 text-gray-600',
  'Prospecto': 'bg-blue-100 text-blue-700',
  'En Negociación': 'bg-orange-100 text-orange-700',
  'Cotización': 'bg-yellow-100 text-yellow-800',
  'Nuevo': 'bg-indigo-100 text-indigo-700',
  'Retomar': 'bg-purple-100 text-purple-700',
  'Reactivar': 'bg-pink-100 text-pink-700',
}

export const COLOR_PRIORIDAD = {
  'Alta': 'bg-red-100 text-red-700',
  'Media': 'bg-yellow-100 text-yellow-700',
  'Baja': 'bg-gray-100 text-gray-600',
}

export const COLOR_ACTIVIDAD = {
  'Llamada': 'bg-blue-500',
  'Visita': 'bg-purple-500',
  'Email': 'bg-gray-500',
  'WhatsApp': 'bg-green-500',
  'Reunión': 'bg-indigo-500',
  'Cotización Enviada': 'bg-orange-500',
  'Propuesta': 'bg-yellow-500',
  'Otro': 'bg-gray-400',
}

export const COLOR_RESULTADO = {
  'Positivo': 'text-green-600',
  'Neutral': 'text-gray-600',
  'Negativo': 'text-red-600',
  'Sin Respuesta': 'text-yellow-600',
}
