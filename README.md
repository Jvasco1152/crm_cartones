# CRM Comercial - Cartones América

CRM para la fuerza de ventas de Cartones América Colombia.

## Instalación rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos y datos de ejemplo
npm run db:push
npm run db:seed

# 3. (Opcional) Configurar Groq IA
# Edita .env y agrega tu GROQ_API_KEY
# Obtén tu clave gratis en: console.groq.com

# 4. Iniciar
npm run dev
```

Abrir en: http://localhost:3000

## Módulos

| Módulo | Descripción |
|--------|-------------|
| Dashboard | KPIs, pipeline chart, actividades y tareas recientes |
| Clientes | CRUD completo, filtros por ciudad/segmento/estado |
| Oportunidades | Vista Kanban + lista, pipeline en COP |
| Actividades | Timeline de llamadas, visitas, emails, WhatsApp |
| Tareas | Lista por prioridad con completado rápido |
| IA Asistente | Chat con Groq AI, acciones rápidas, contexto de cliente |

## IA con Groq

El asistente usa el modelo `llama-3.3-70b-versatile` (gratuito).

**Para activarlo:**
1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta y genera un API key
3. Agrega en `.env`: `GROQ_API_KEY="gsk_..."`
4. Reinicia el servidor

**Capacidades:**
- Análisis de clientes y pipeline
- Redacción de emails y mensajes WhatsApp
- Scripts para llamadas de ventas
- Estrategias por sector (flores, alimentos, farmacéutico, retail)
- Manejo de objeciones de precio
