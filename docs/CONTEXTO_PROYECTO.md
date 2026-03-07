# Documento de Contexto — CRM Comercial Catrones América

**Versión:** 1.3
**Fecha:** Marzo 2026
**Proyecto:** CRM para fuerza de ventas de Cartones América Colombia
**Repositorio:** https://github.com/Jvasco1152/crm_cartones
**URL Producción:** https://crm-cartones.vercel.app
**Estado:** ACTIVO en producción — Vercel + Neon PostgreSQL + Groq IA

---

## 1. Contexto del Negocio

### Empresa
Cartones América es una empresa colombiana dedicada a la fabricación y comercialización de soluciones de embalaje en cartón corrugado, cartón plegadizo y empaques especializados. Opera principalmente en el Área Metropolitana de Medellín (Antioquia) con clientes en los principales sectores industriales del país.

### Usuario Principal
El sistema fue diseñado para **Naty**, comercial/vendedora que gestiona una cartera de ~83 clientes B2B en Antioquia. Su trabajo implica:
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
│   ├── seed.js                   # Carga inicial (borra y recarga 51 clientes reales)
│   └── add-real-clients.js       # Script ADITIVO — agrega clientes sin borrar existentes
├── docs/
│   ├── CONTEXTO_PROYECTO.md      # Este documento
│   └── PROPUESTA_CLIENTE.md      # Documento comercial para cliente
├── Documentos bases/             # Archivos Excel fuente (NO en git)
│   ├── CLIENTES 2025 VACACIONES ABRIL .xlsx
│   ├── CLIENTES NATY 2025.xlsx
│   ├── INCAPACIDAD NATY OCTUBRE 2025.xlsx  ← más reciente
│   ├── PROSPECTOS NATY 2026.xlsx
│   ├── PROSPECTOS CLIENTES NATY.xlsx
│   ├── DIARIO TRABAJO .xlsx
│   └── JULIO 2025.xlsx
├── .env                          # Variables de entorno (local, NO en git)
└── .env.example                  # Plantilla de variables requeridas
```

---

## 4. Modelos de Base de Datos

### Cliente
Campo clave para el negocio B2B. Incluye información comercial completa con tres contactos diferenciados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| empresa | String | Razón social |
| nit | String? | NIT colombiano |
| codigoCliente | String? | Código interno SAP (ej: 100026987) |
| ciudad | String | Ciudad (Medellín por defecto) |
| segmento | String | Plásticos, Alimentos, Cosméticos, etc. |
| marcaProducto | String? | Qué vende el cliente (ej: "JUNIPER - BEBIDAS") |
| contacto | String | Nombre del contacto principal |
| cargo | String? | Cargo del contacto principal |
| telefono / celular | String? | Contacto directo y WhatsApp |
| email | String? | Email contacto principal |
| web | String? | Sitio web del cliente |
| direccion | String? | Dirección de entrega |
| estado | String | Ver estados más abajo |
| condicionPago | String? | Cupo y crédito (ej: "CUPO $50M - CREDITO 60 días") |
| contactoCompras | String? | Nombre contacto área de compras |
| telefonoCompras / emailCompras | String? | Datos contacto compras |
| contactoPagos | String? | Nombre contacto contabilidad/pagos |
| telefonoPagos / emailPagos | String? | Datos contacto pagos |
| horarioEntregas | String? | Horario de recepción (ej: "L-V 7am-5pm") |
| cierreFacturacion | Int? | Día del mes de cierre (ej: 29) |
| citasEntrega | String? | Instrucciones especiales de entrega |
| volumenMensual | Float? | Estimado de compra mensual en COP |
| productosInteres | String? | Tipo de producto de cartón de interés |
| notas | String? | Notas generales |
| pendientes | String? | Acciones pendientes con JP u otras personas |

**Estados de cliente:**
| Estado | Color | Descripción |
|--------|-------|-------------|
| Activo | Verde | Cliente con pedidos regulares |
| Inactivo | Gris | Sin actividad reciente |
| Prospecto | Azul | Primer contacto, sin venta |
| En Negociación | Naranja | En proceso de cierre |
| Cotización | Amarillo | Cotización enviada, esperando respuesta |
| Nuevo | Índigo | Cliente nuevo sin historial |
| Retomar | Morado | Pendiente de recontactar |
| Reactivar | Rosa | Cliente pausado a reactivar activamente |

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

## 5. Catálogo de Productos

Los productos de Cartones América disponibles en el CRM:

- Caja Corriente
- Caja Troquelada
- Caja Troquelada Pegada
- Caja Base Tapa
- Caja Tipo Floricultor
- Lámina de Ventas Impresa
- Caja Telescópica
- Caja Cinco Lados
- Caja Armado Mecanizado
- Bandeja
- Divisiones
- Particiones

---

## 6. Segmentos y Ciudades

**Segmentos de clientes (reales del portafolio de Naty):**
Plásticos, Alimentos, Bebidas, Cosméticos, Farmacéutico, Textil, Industrial, Impresos, Químicos, Mascotas, Otro

**Ciudades (Antioquia-centric):**
Medellín, Sabaneta, Itagüí, La Estrella, Guarne, Rionegro, Caldas, Bello, Girardota, Envigado, Barbosa, Copacabana + Bogotá, Cali, Barranquilla, Bucaramanga, Pereira, Otra

---

## 7. Sistema de IA — Groq

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

## 8. Variables de Entorno

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

## 9. Comandos del Proyecto

```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 3000)
npm run build        # Build de producción
npm run start        # Iniciar en producción
npm run db:push      # Sincronizar schema con la base de datos
npm run db:seed      # Carga inicial (BORRA y recarga 51 clientes base)
npm run db:studio    # Abrir Prisma Studio (interfaz visual de la BD)

# Agregar clientes nuevos SIN borrar los existentes:
node prisma/add-real-clients.js
```

---

## 10. Datos en Producción

El CRM contiene **~83 clientes reales** de Antioquia cargados desde los archivos Excel de Naty:

| Fuente | Contenido |
|--------|-----------|
| `CLIENTES 2025 VACACIONES ABRIL.xlsx` | Base inicial — activos, cotización, retomar |
| `PROSPECTOS NATY 2026.xlsx` | Prospectos zona Antioquia (plásticos, alimentos) |
| `INCAPACIDAD NATY OCTUBRE 2025.xlsx` | **El más reciente** — 14 activos nuevos, estados actualizados |
| `CLIENTES NATY 2025.xlsx` | Lista completa complementaria |

**Distribución por estado (aprox):**
- Activo: ~42 clientes
- Cotización: ~18 clientes
- Reactivar: ~7 clientes
- Retomar: ~3 clientes
- Prospecto: ~13 clientes

**script `add-real-clients.js`:** Usa upsert por nombre/código — nunca duplica. Correr cuando lleguen nuevos Excel.

---

## 11. Posibles Expansiones Futuras

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

## 12. Infraestructura de Producción

### Estado actual (v1.3) — PRODUCTIVO

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
npm run dev                      # Arrancar servidor (localhost:3000)
npm run db:studio                # Ver base de datos visualmente (Prisma Studio)

# Base de datos
npm run db:push                  # Aplicar cambios del schema a Neon
npm run db:seed                  # Recargar datos base (borra y recarga)
node prisma/add-real-clients.js  # Agregar clientes nuevos SIN borrar

# Producción
git push                         # Redeploy automático en Vercel
npm run build                    # Verificar build antes de subir
```
