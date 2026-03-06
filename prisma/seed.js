const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Sembrando datos de ejemplo...')

  // Limpiar datos existentes
  await prisma.tarea.deleteMany()
  await prisma.actividad.deleteMany()
  await prisma.oportunidad.deleteMany()
  await prisma.cliente.deleteMany()

  // Clientes colombianos realistas
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        empresa: 'Grupo Alimentario del Valle',
        nit: '800.123.456-1',
        ciudad: 'Cali',
        segmento: 'Alimentos',
        contacto: 'Carolina Mendoza',
        cargo: 'Jefe de Compras',
        telefono: '602-345-6789',
        celular: '315-678-9012',
        email: 'c.mendoza@gavallle.com',
        estado: 'Activo',
        volumenMensual: 8500000,
        productosInteres: 'Caja de Cartón Corrugado Simple, Láminas de Cartón',
        notas: 'Cliente frecuente, requiere entregas semanales los martes',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Flores y Colores del Oriente',
        nit: '900.234.567-2',
        ciudad: 'Bogotá',
        segmento: 'Flores',
        contacto: 'Andrés Restrepo',
        cargo: 'Gerente Comercial',
        telefono: '601-234-5678',
        celular: '312-345-6789',
        email: 'a.restrepo@floresycolores.com',
        estado: 'Activo',
        volumenMensual: 12000000,
        productosInteres: 'Cajas de Flor, Empaques Especiales',
        notas: 'Exporta flores a USA y Europa. Temporadas altas: San Valentín, Día de la Madre',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Laboratorios Biomed Colombia',
        nit: '890.456.789-3',
        ciudad: 'Medellín',
        segmento: 'Farmacéutico',
        contacto: 'Diana Torres',
        cargo: 'Directora de Operaciones',
        telefono: '604-567-8901',
        celular: '314-567-8901',
        email: 'd.torres@biomed.com.co',
        estado: 'Activo',
        volumenMensual: 15000000,
        productosInteres: 'Cartón Plegadizo, Empaques Especiales',
        notas: 'Requiere cartón certificado FSC. Alta exigencia en calidad',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Distribuidora Industrial del Norte',
        nit: '830.567.890-4',
        ciudad: 'Barranquilla',
        segmento: 'Industrial',
        contacto: 'Roberto Ávila',
        cargo: 'Gerente de Logística',
        telefono: '605-678-9012',
        celular: '316-789-0123',
        email: 'r.avila@dinorte.com',
        estado: 'En Negociación',
        volumenMensual: 6000000,
        productosInteres: 'Caja de Cartón Corrugado Doble, Láminas de Cartón',
        notas: 'Evaluando cambio de proveedor actual. Precio es factor clave',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Supermercados FrescoMar',
        nit: '860.678.901-5',
        ciudad: 'Bogotá',
        segmento: 'Retail',
        contacto: 'Valentina Cruz',
        cargo: 'Analista de Compras',
        telefono: '601-789-0123',
        celular: '317-890-1234',
        email: 'v.cruz@frescomart.com',
        estado: 'Activo',
        volumenMensual: 20000000,
        productosInteres: 'Displays Comerciales, Caja de Cartón Corrugado Simple',
        notas: 'Cadena con 45 puntos de venta en Bogotá. Compras centralizadas',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Textiles Andinos S.A.S',
        nit: '820.789.012-6',
        ciudad: 'Pereira',
        segmento: 'Textil',
        contacto: 'Felipe Moreno',
        cargo: 'Jefe de Producción',
        telefono: '606-890-1234',
        celular: '313-901-2345',
        email: 'f.moreno@textilesandinos.com',
        estado: 'Prospecto',
        volumenMensual: null,
        productosInteres: 'Caja de Cartón Corrugado Doble',
        notas: 'Primer contacto en feria textil de Bogotá. Interesado en empaques para exportación',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Bebidas Refrescantes del Pacífico',
        nit: '805.890.123-7',
        ciudad: 'Cali',
        segmento: 'Bebidas',
        contacto: 'Luciana Vargas',
        cargo: 'Gerente de Compras',
        telefono: '602-901-2345',
        celular: '311-012-3456',
        email: 'l.vargas@bebidaspacifico.com',
        estado: 'Activo',
        volumenMensual: 18000000,
        productosInteres: 'Caja de Cartón Corrugado Simple, Displays Comerciales',
        notas: 'Produce jugos y refrescos. Compra mensual fija. Buen pagador',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Constructora Horizonte 360',
        nit: '815.901.234-8',
        ciudad: 'Bucaramanga',
        segmento: 'Construcción',
        contacto: 'Mauricio Pinto',
        cargo: 'Director Administrativo',
        telefono: '607-012-3456',
        celular: '318-123-4567',
        email: 'm.pinto@horizonte360.com',
        estado: 'Inactivo',
        volumenMensual: 3500000,
        productosInteres: 'Embalaje Industrial',
        notas: 'Compras esporádicas para proyectos específicos. Última compra hace 4 meses',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Exportaciones Café Premium',
        nit: '900.012.345-9',
        ciudad: 'Manizales',
        segmento: 'Alimentos',
        contacto: 'Isabella Ospina',
        cargo: 'Gerente General',
        telefono: '606-123-4567',
        celular: '310-234-5678',
        email: 'i.ospina@cafepremium.com',
        estado: 'Activo',
        volumenMensual: 9500000,
        productosInteres: 'Cajas de Flor, Empaques Especiales, Cartón Plegadizo',
        notas: 'Exporta café especial a 12 países. Muy exigente con presentación del empaque',
      },
    }),
    prisma.cliente.create({
      data: {
        empresa: 'Logística Total Colombia',
        nit: '870.123.456-0',
        ciudad: 'Bogotá',
        segmento: 'Logística',
        contacto: 'Carlos Jiménez',
        cargo: 'Gerente de Operaciones',
        telefono: '601-234-5679',
        celular: '320-345-6789',
        email: 'c.jimenez@logisticatotal.com',
        estado: 'Prospecto',
        volumenMensual: null,
        productosInteres: 'Caja de Cartón Corrugado Doble, Embalaje Industrial',
        notas: 'Referido por Supermercados FrescoMar. Agendar visita esta semana',
      },
    }),
  ])

  console.log(`Creados ${clientes.length} clientes`)

  // Oportunidades
  const oportunidades = await Promise.all([
    prisma.oportunidad.create({
      data: {
        titulo: 'Suministro anual cajas corrugadas',
        valor: 85000000,
        etapa: 'Negociación',
        probabilidad: 75,
        fechaCierre: new Date('2026-04-15'),
        producto: 'Caja de Cartón Corrugado Simple',
        descripcion: 'Contrato anual para 50,000 cajas mensuales',
        clienteId: clientes[4].id, // FrescoMar
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Empaques especiales exportación flores',
        valor: 45000000,
        etapa: 'Cotización',
        probabilidad: 60,
        fechaCierre: new Date('2026-03-30'),
        producto: 'Cajas de Flor',
        descripcion: 'Empaques para temporada San Valentín y Día de la Madre',
        clienteId: clientes[1].id, // Flores y Colores
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Cartón plegadizo línea medicamentos',
        valor: 28000000,
        etapa: 'Presentación',
        probabilidad: 40,
        fechaCierre: new Date('2026-05-01'),
        producto: 'Cartón Plegadizo',
        descripcion: 'Nueva línea de medicamentos genéricos requiere empaque certificado',
        clienteId: clientes[2].id, // Biomed
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Displays punto de venta bebidas',
        valor: 15000000,
        etapa: 'Cotización',
        probabilidad: 65,
        fechaCierre: new Date('2026-03-25'),
        producto: 'Displays Comerciales',
        descripcion: 'Displays para lanzamiento nueva línea de refrescos',
        clienteId: clientes[6].id, // Bebidas
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Embalaje industrial cambio proveedor',
        valor: 62000000,
        etapa: 'Negociación',
        probabilidad: 70,
        fechaCierre: new Date('2026-04-01'),
        producto: 'Caja de Cartón Corrugado Doble',
        descripcion: 'Oportunidad de reemplazar proveedor actual. Precio competitivo requerido',
        clienteId: clientes[3].id, // Distribuidora
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Cajas exportación café premium',
        valor: 38000000,
        etapa: 'Contacto Inicial',
        probabilidad: 20,
        fechaCierre: new Date('2026-06-15'),
        producto: 'Empaques Especiales',
        descripcion: 'Empaque de lujo para café de exportación a mercados europeos',
        clienteId: clientes[8].id, // Café Premium
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Contrato logística embalaje masivo',
        valor: 95000000,
        etapa: 'Prospección',
        probabilidad: 10,
        fechaCierre: new Date('2026-07-01'),
        producto: 'Embalaje Industrial',
        descripcion: 'Empresa de logística busca proveedor estratégico para sus clientes',
        clienteId: clientes[9].id, // Logística Total
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Cajas corrugadas alimentos procesados',
        valor: 22000000,
        etapa: 'Ganado',
        probabilidad: 100,
        fechaCierre: new Date('2026-02-28'),
        producto: 'Caja de Cartón Corrugado Simple',
        descripcion: 'Contrato trimestral cerrado exitosamente',
        clienteId: clientes[0].id, // Grupo Alimentario
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Empaques textiles exportación',
        valor: 18000000,
        etapa: 'Prospección',
        probabilidad: 10,
        fechaCierre: new Date('2026-05-30'),
        producto: 'Caja de Cartón Corrugado Doble',
        descripcion: 'Nuevo prospecto, requiere muestras y visita técnica',
        clienteId: clientes[5].id, // Textiles
      },
    }),
    prisma.oportunidad.create({
      data: {
        titulo: 'Láminas cartón para construcción',
        valor: 8500000,
        etapa: 'Perdido',
        probabilidad: 0,
        fechaCierre: new Date('2026-01-31'),
        producto: 'Láminas de Cartón',
        descripcion: 'Perdido por precio. Competidor ofreció 15% menos',
        clienteId: clientes[7].id, // Constructora
      },
    }),
  ])

  console.log(`Creadas ${oportunidades.length} oportunidades`)

  // Actividades
  const now = new Date()
  const actividades = await Promise.all([
    prisma.actividad.create({
      data: {
        tipo: 'Llamada',
        fecha: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        descripcion: 'Seguimiento cotización empaques de flor. Cliente solicita reducción del 5% en precio.',
        resultado: 'Positivo',
        proximaAccion: 'Enviar contrapropuesta con descuento del 3%',
        fechaProxima: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        clienteId: clientes[1].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Visita',
        fecha: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        descripcion: 'Visita a planta de producción. Se presentaron muestras de cartón corrugado doble cara.',
        resultado: 'Positivo',
        proximaAccion: 'Enviar cotización formal esta semana',
        fechaProxima: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        clienteId: clientes[3].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Email',
        fecha: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        descripcion: 'Envío de catálogo actualizado de empaques farmacéuticos certificados FSC.',
        resultado: 'Neutral',
        proximaAccion: 'Llamar para confirmar recepción y resolver dudas',
        fechaProxima: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        clienteId: clientes[2].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Reunión',
        fecha: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        descripcion: 'Reunión de negociación contrato anual. Acordamos términos de pago 30/60 días.',
        resultado: 'Positivo',
        proximaAccion: 'Enviar contrato para firma',
        fechaProxima: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        clienteId: clientes[4].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'WhatsApp',
        fecha: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        descripcion: 'Confirmación de especificaciones técnicas de displays para punto de venta.',
        resultado: 'Positivo',
        proximaAccion: 'Generar orden de producción',
        clienteId: clientes[6].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Llamada',
        fecha: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        descripcion: 'Primer contacto. Empresa referida por FrescoMar. Interés en embalaje para 200 clientes.',
        resultado: 'Positivo',
        proximaAccion: 'Agendar visita presencial en Bogotá',
        fechaProxima: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        clienteId: clientes[9].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Cotización Enviada',
        fecha: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        descripcion: 'Cotización #2024-089 por $38M para cajas de exportación de café premium.',
        resultado: 'Neutral',
        proximaAccion: 'Seguimiento en 3 días hábiles',
        fechaProxima: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        clienteId: clientes[8].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Visita',
        fecha: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        descripcion: 'Visita de prospección. Se identificó necesidad de 15,000 cajas mensuales para exportación textil.',
        resultado: 'Positivo',
        proximaAccion: 'Enviar muestras de materiales',
        clienteId: clientes[5].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Llamada',
        fecha: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        descripcion: 'Llamada de reactivación. Cliente inactivo desde hace 4 meses.',
        resultado: 'Negativo',
        proximaAccion: 'Intentar contacto nuevamente en 2 semanas con oferta especial',
        clienteId: clientes[7].id,
      },
    }),
    prisma.actividad.create({
      data: {
        tipo: 'Reunión',
        fecha: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        descripcion: 'Revisión mensual de pedidos. Cliente confirma continuidad del contrato. Solicita nuevo producto.',
        resultado: 'Positivo',
        proximaAccion: 'Presentar nuevas opciones de láminas la próxima semana',
        clienteId: clientes[0].id,
      },
    }),
  ])

  console.log(`Creadas ${actividades.length} actividades`)

  // Tareas
  const tareas = await Promise.all([
    prisma.tarea.create({
      data: {
        titulo: 'Enviar contrapropuesta a Flores y Colores',
        descripcion: 'Descuento del 3% en cajas de flor. Incluir condiciones de entrega.',
        fechaLimite: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        prioridad: 'Alta',
        tipo: 'Email',
        clienteId: clientes[1].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Llamar a Biomed para confirmar recepción catálogo',
        descripcion: 'Resolver dudas sobre certificación FSC y tiempo de entrega.',
        fechaLimite: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        prioridad: 'Alta',
        tipo: 'Llamada',
        clienteId: clientes[2].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Enviar contrato a FrescoMar para firma',
        descripcion: 'Contrato anual por $85M. Revisar cláusulas de exclusividad.',
        fechaLimite: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        prioridad: 'Alta',
        tipo: 'Seguimiento',
        clienteId: clientes[4].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Cotización formal para Distribuidora del Norte',
        descripcion: 'Incluir precio especial por volumen. Competir en precio vs. proveedor actual.',
        fechaLimite: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        prioridad: 'Alta',
        tipo: 'Seguimiento',
        clienteId: clientes[3].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Agendar visita a Logística Total Colombia',
        descripcion: 'Referido de FrescoMar. Alto potencial. Preparar presentación corporativa.',
        fechaLimite: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        prioridad: 'Media',
        tipo: 'Visita',
        clienteId: clientes[9].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Seguimiento cotización café premium',
        descripcion: 'Llamar a Isabella Ospina. Cotización enviada hace 2 días sin respuesta.',
        fechaLimite: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        prioridad: 'Media',
        tipo: 'Llamada',
        clienteId: clientes[8].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Enviar muestras a Textiles Andinos',
        descripcion: 'Muestras de corrugado doble cara calibre 5. Adjuntar fichas técnicas.',
        fechaLimite: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        prioridad: 'Media',
        tipo: 'Seguimiento',
        clienteId: clientes[5].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Reactivar cliente Constructora Horizonte',
        descripcion: 'Preparar oferta especial para cliente inactivo. Descuento por reactivación.',
        fechaLimite: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        prioridad: 'Baja',
        tipo: 'Email',
        clienteId: clientes[7].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Preparar informe mensual de ventas',
        descripcion: 'Consolidar cifras del mes: clientes nuevos, oportunidades, cierres.',
        fechaLimite: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        prioridad: 'Media',
        tipo: 'Seguimiento',
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Actualizar portafolio de productos 2026',
        descripcion: 'Incluir nuevas líneas ecológicas y precios actualizados.',
        fechaLimite: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        prioridad: 'Baja',
        tipo: 'Seguimiento',
      },
    }),
  ])

  console.log(`Creadas ${tareas.length} tareas`)
  console.log('Datos de ejemplo cargados exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
