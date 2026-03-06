# Documento de Contexto — CRM Comercial Catrones América

**Versión:** 1.0
**Fecha:** Marzo 2026
**Proyecto:** CRM para fuerza de ventas de Cartones América Colombia

---

## 1. Contexto del Negocio

### Empresa
Cartones América es una empresa colombiana dedicada a la fabricación y comercialización de soluciones de embalaje en cartón corrugado, cartón plegadizo y empaques especializados. Opera a nivel nacional con clientes en los principales sectores industriales del país.

### Usuario Principal
El sistema fue diseñado para una **comercial/vendedora** que gestiona una cartera de clientes B2B en Colombia. Su trabajo implica:
- Prospectar nuevas empresas en diferentes sectores
- Mantener relaciones con clientes activos
- Hacer seguimiento de cotizaciones y oportunidades
- Registrar cada interacción comercial (llamadas, visitas, emails, WhatsApp)
- Priorizar tareas de seguimiento diario

### Problema que resuelve
Antes del CRM, el seguimiento se hacía en hojas de cálculo o notas sueltas, lo que causaba:
- Pérdida de oportunidades por falta de seguimiento oportuno
- Olvido de compromisos adquiridos con clientes
- Sin visibilidad del pipeline de ventas en tiempo real
- Sin historial organizado por cliente
- Sin apoyo de inteligencia artificial para redactar comunicaciones o analizar la cartera

---

## 2. Stack Tecnológico

| Capa | Tecnología | Razón de elección |
|------|-----------|-------------------|
| Frontend | React 18 + Next.js 16 | Full-stack en un solo proyecto, sin configuración extra |
| Routing/API | Next.js App Router | API routes integradas, sin servidor Express separado |
| Base de datos | SQLite via Prisma ORM | Sin necesidad de servidor de base de datos externo, ideal para uso local |
| Estilos | TailwindCSS 3 | Desarrollo rápido, diseño consistente |
| IA | Groq API (llama-3.3-70b-versatile) | Inferencia ultrarrápida, plan gratuito generoso |
| Iconos | Lucide React | Librería ligera y consistente |
| Gráficas | Recharts | Gráficas declarativas para React |
| Notificaciones | react-hot-toast | Toast notifications simples |
| Fechas | date-fns | Manipulación de fechas sin overhead |
| Utilidades | clsx | Composición condicional de clases CSS |

---

## 3. Arquitectura del Proyecto

```
CRM Comercial Catrones/
├── app/                          # Next.js App Router
│   ├── layout.jsx                # Layout global con Sidebar
│   ├── page.jsx                  # Dashboard principal
│   ├── clientes/page.jsx         # Gestión de clientes
│   ├── oportunidades/page.jsx    # Pipeline de ventas
│   ├── actividades/page.jsx      # Registro de interacciones
│   ├── tareas/page.jsx           # Tareas y recordatorios
│   ├── ia/page.jsx               # Asistente IA con Groq
│   └── api/                      # API Routes (backend)
│       ├── dashboard/route.js
│       ├── clientes/route.js
│       ├── clientes/[id]/route.js
│       ├── oportunidades/route.js
│       ├── oportunidades/[id]/route.js
│       ├── actividades/route.js
│       ├── actividades/[id]/route.js
│       ├── tareas/route.js
│       ├── tareas/[id]/route.js
│       └── ia/route.js
├── components/
│   └── Sidebar.jsx               # Navegación lateral
├── lib/
│   ├── db.js                     # Singleton PrismaClient
│   ├── groq.js                   # Cliente Groq + System Prompt
│   └── utils.js                  # Helpers, constantes, formatos
├── prisma/
│   ├── schema.prisma             # Modelos de base de datos
│   └── seed.js                   # Datos de muestra colombianos
├── .env                          # Variables de entorno (local)
└── dev.db                        # Base de datos SQLite (generada)
```

---

## 4. Modelos de Base de Datos

### Cliente
Campo clave para el negocio B2B. Incluye información comercial completa.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| empresa | String | Razón social |
| nit | String? | NIT colombiano |
| ciudad | String | Ciudad colombiana |
| segmento | String | Alimentos, Flores, Farmacéutico, etc. |
| contacto | String | Nombre del contacto principal |
| cargo | String? | Cargo del contacto |
| telefono / celular | String? | Contacto directo y WhatsApp |
| estado | String | Activo, Inactivo, Prospecto, En Negociación |
| volumenMensual | Float? | Estimado de compra mensual en COP |
| productosInteres | String | Tipo de cartón de interés |

### Oportunidad
Representa una venta en proceso vinculada a un cliente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| titulo | String | Nombre descriptivo |
| valor | Float | Monto estimado en COP |
| etapa | String | Prospección → Ganado / Perdido |
| probabilidad | Int | 0-100% de cierre |
| fechaCierre | DateTime? | Fecha estimada de cierre |
| producto | String? | Tipo de producto de cartón |

**Etapas del pipeline:**
Prospección → Contacto Inicial → Presentación → Cotización → Negociación → Ganado / Perdido

### Actividad
Registro de cada interacción con un cliente.

| Campo | Descripción |
|-------|-------------|
| tipo | Llamada, Visita, Email, WhatsApp, Reunión, Cotización Enviada |
| fecha | Fecha y hora exacta |
| descripcion | Qué ocurrió |
| resultado | Positivo, Neutral, Negativo, Sin Respuesta |
| proximaAccion | Qué sigue después |
| fechaProxima | Cuándo ejecutar la próxima acción |

### Tarea
Lista de pendientes con prioridades y fechas límite.

| Campo | Descripción |
|-------|-------------|
| titulo | Descripción breve |
| prioridad | Alta, Media, Baja |
| fechaLimite | Fecha de vencimiento |
| completada | Boolean (toggle rápido) |
| cliente | Relación opcional con cliente |

---

## 5. Sistema de IA — Groq

### Modelo
`llama-3.3-70b-versatile` — modelo Llama 3.3 de Meta, corriendo en infraestructura Groq (inferencia por hardware especializado LPU, hasta 10x más rápido que GPU convencional).

### System Prompt
El asistente está configurado con un prompt especializado que le da contexto sobre:
- Cartones América y sus productos
- Mercado colombiano de embalaje
- Sectores cliente y sus necesidades específicas
- Temporadas comerciales colombianas (San Valentín, Día de la Madre, Navidad)
- Rangos de precios en COP
- Técnicas de venta consultiva B2B

### Capacidades configuradas
1. Análisis de pipeline y priorización de oportunidades
2. Redacción de emails de seguimiento
3. Scripts para llamadas de prospección
4. Mensajes de WhatsApp comerciales
5. Estrategias por sector (flores, alimentos, farmacéutico, retail)
6. Manejo de objeciones de precio
7. Propuestas de valor
8. Preparación para visitas comerciales

### Contexto dinámico
El usuario puede seleccionar un cliente específico antes de chatear. Los datos del cliente (empresa, segmento, ciudad, volumen, notas) se inyectan automáticamente en el mensaje enviado a Groq para respuestas más precisas y personalizadas.

---

## 6. Variables de Entorno

```env
DATABASE_URL="file:./dev.db"     # Ruta a la base de datos SQLite
GROQ_API_KEY="gsk_..."           # API Key de console.groq.com
```

---

## 7. Comandos del Proyecto

```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 3000)
npm run build        # Build de producción
npm run start        # Iniciar en producción
npm run db:push      # Sincronizar schema con la base de datos
npm run db:seed      # Cargar datos de muestra colombianos
npm run db:studio    # Abrir Prisma Studio (interfaz visual de la BD)
```

---

## 8. Datos de Muestra (Seed)

El archivo `prisma/seed.js` carga automáticamente datos realistas para Colombia:

**10 clientes** de sectores: Alimentos, Flores, Farmacéutico, Industrial, Retail, Textil, Bebidas, Construcción, Logística — en ciudades: Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Pereira, Manizales.

**10 oportunidades** en distintas etapas del pipeline, con valores entre $8.5M y $95M COP.

**10 actividades** recientes: llamadas, visitas, emails, cotizaciones enviadas, reuniones.

**10 tareas** con prioridades distribuidas y fechas límite reales.

---

## 9. Posibles Expansiones Futuras

| Feature | Descripción |
|---------|-------------|
| Multi-usuario | Soporte para varios comerciales con login |
| Reportes exportables | PDF/Excel de pipeline y actividades |
| Integración WhatsApp | Envío directo desde el CRM vía Twilio/Meta API |
| Email integrado | Envío de correos desde el CRM |
| Notificaciones | Alertas de tareas vencidas por email o push |
| App móvil | PWA o React Native para uso en campo |
| Sync Google Calendar | Sincronizar visitas y reuniones |
| Base de datos PostgreSQL | Para producción en la nube |
| Dashboard gerencial | Vista agregada para jefes de ventas |

---

## 10. Seguridad y Despliegue

**Estado actual:** Aplicación local para un solo usuario. No requiere autenticación.

**Para producción se recomienda:**
- Migrar SQLite a PostgreSQL (Supabase o Neon — ambos gratuitos)
- Desplegar en Vercel (compatible con Next.js, deploy con un clic)
- Agregar NextAuth.js para autenticación
- Mover `GROQ_API_KEY` a variables de entorno de Vercel
- Configurar dominio personalizado

**Costo estimado producción básica:** $0/mes (Vercel free + Supabase free + Groq free tier)
