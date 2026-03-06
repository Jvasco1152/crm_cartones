# Documento de Contexto — CRM Comercial Catrones América

**Versión:** 1.2
**Fecha:** Marzo 2026
**Proyecto:** CRM para fuerza de ventas de Cartones América Colombia
**Repositorio:** https://github.com/Jvasco1152/crm_cartones
**URL Producción:** https://crm-cartones.vercel.app
**Estado:** ACTIVO en producción — Vercel + Neon PostgreSQL + Groq IA

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
| Base de datos local | PostgreSQL via Prisma ORM | Migrado de SQLite para compatibilidad con Vercel y producción |
| Base de datos nube | Neon (PostgreSQL serverless) | Plan gratuito generoso, conexión pooled para serverless |
| Hosting | Vercel | Deploy automático desde GitHub, plan gratuito, CDN global |
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
├── docs/
│   ├── CONTEXTO_PROYECTO.md      # Este documento
│   └── PROPUESTA_CLIENTE.md      # Documento comercial para cliente
├── .env                          # Variables de entorno (local, NO en git)
└── .env.example                  # Plantilla de variables requeridas
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

Tres variables requeridas tanto en `.env` local como en Vercel:

```env
# Base de datos — Neon PostgreSQL (neon.tech)
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@host.neon.tech/neondb?sslmode=require"

# IA — Groq (console.groq.com)
GROQ_API_KEY="gsk_..."
```

**Por qué dos URLs de base de datos:**
- `DATABASE_URL` → URL con connection pooling (PgBouncer). Usada por Prisma en tiempo de ejecución en Vercel (serverless).
- `DIRECT_URL` → Conexión directa sin pooling. Usada por Prisma para migraciones (`db push`).

> El archivo `.env` está en `.gitignore` y nunca se sube a GitHub. Las credenciales de producción se configuran directamente en el dashboard de Vercel.

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

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| Multi-usuario con login | Cada comercial con su cuenta y cartera propia (NextAuth.js) | Alta |
| Dashboard gerencial | Vista consolidada para jefes de ventas con métricas por comercial | Alta |
| Reportes exportables | Pipeline y actividades en PDF o Excel | Media |
| Integración WhatsApp Business | Envío de mensajes directamente desde el CRM (Twilio o Meta API) | Media |
| Email integrado | Redactar y enviar correos desde el CRM (Resend o SendGrid) | Media |
| Notificaciones automáticas | Alertas por email cuando una tarea vence (cron job en Vercel) | Media |
| App móvil / PWA | Acceso desde celular para registrar actividades en campo | Baja |
| Sync Google Calendar | Visitas y reuniones reflejadas en el calendario | Baja |
| Importar clientes CSV | Carga masiva desde Excel/CSV | Baja |

---

## 10. Infraestructura de Producción

### Estado actual (v1.2) — PRODUCTIVO

| Servicio | Proveedor | Plan | Costo |
|---------|-----------|------|-------|
| Hosting / Deploy | Vercel | Free | $0/mes |
| Base de datos | Neon PostgreSQL | Free (0.5 GB, 10 GB transferencia) | $0/mes |
| IA | Groq API | Free (14,400 req/día) | $0/mes |
| Repositorio | GitHub | Free | $0/mes |
| **Total** | | | **$0/mes** |

### Flujo de despliegue

```
Código local → git push → GitHub → Vercel (deploy automático ~2 min) → crm-cartones.vercel.app
```

Cada `git push` a `main` dispara un redeploy automático en Vercel. Sin intervención manual.

### Incidentes resueltos en puesta en producción

| Problema | Causa | Solución aplicada |
|---------|-------|-------------------|
| Error 500 en todas las APIs | Prisma sin `binaryTargets` para Linux de Vercel | Agregar `rhel-openssl-1.0.x` y `rhel-openssl-3.0.x` en `schema.prisma` |
| "Can't reach database server" | Typo en `DATABASE_URL` dentro de Vercel (`neon.ech` en vez de `neon.tech`) | Corregir URL en variables de entorno de Vercel |

### Variables configuradas en Vercel (producción)
- `DATABASE_URL` — Neon pooled connection (con `-pooler` en hostname)
- `DIRECT_URL` — Neon direct connection (sin `-pooler`, para migraciones)
- `GROQ_API_KEY` — Groq API key

### Seguridad actual
- `.env` excluido de git (`.gitignore`) — credenciales nunca en repositorio
- Base de datos con SSL obligatorio (`sslmode=require & channel_binding=require`)
- Sin autenticación (aplicación de uso personal/interno por una sola usuaria)

### Para agregar autenticación (próxima versión recomendada)
Instalar **NextAuth.js** con proveedor Google o Credentials. Requiere agregar `NEXTAUTH_SECRET` en Vercel y una pantalla de login.

### Comandos de mantenimiento

```bash
# Desarrollo local
npm run dev                # Arrancar servidor (localhost:3000)
npm run db:studio          # Ver base de datos visualmente (Prisma Studio)

# Base de datos
npm run db:push            # Aplicar cambios del schema a Neon
npm run db:seed            # Recargar datos de muestra (borra y recarga)

# Producción
git push                   # Redeploy automático en Vercel
npm run build              # Verificar build antes de subir
```
