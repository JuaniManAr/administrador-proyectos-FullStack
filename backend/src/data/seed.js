const bcrypt = require('bcryptjs');

function passwordHash() {
  return bcrypt.hashSync('123456', 10);
}

function createSeed() {
  const hash = passwordHash();

  return {
    usuarios: [
      { id: 'usr-001', nombre: 'Julieta Admin', email: 'admin@dds.com', passwordHash: hash, rol: 'admin', activo: true },
      { id: 'usr-002', nombre: 'Ramiro Lider', email: 'lider@dds.com', passwordHash: hash, rol: 'lider', activo: true },
      { id: 'usr-003', nombre: 'Lucia Fernandez', email: 'lucia@dds.com', passwordHash: hash, rol: 'colaborador', activo: true },
      { id: 'usr-004', nombre: 'Mateo Silva', email: 'mateo@dds.com', passwordHash: hash, rol: 'colaborador', activo: true },
      { id: 'usr-005', nombre: 'Florencia Vega', email: 'florencia@dds.com', passwordHash: hash, rol: 'colaborador', activo: true }
    ],

    proyectos: [
      {
        id: 'proy-001',
        codigo: 'GEST-TAREAS',
        nombre: 'Gestor de tareas internas',
        descripcion: 'Sistema para organizar tareas dentro de distintos proyectos',
        estado: 'activo',
        integrantes: ['usr-001', 'usr-002', 'usr-003', 'usr-004']
      },
      {
        id: 'proy-002',
        codigo: 'PORTAL-WEB',
        nombre: 'Portal web de clientes',
        descripcion: 'Aplicacion para consultar clientes, solicitudes y estados',
        estado: 'activo',
        integrantes: ['usr-001', 'usr-002', 'usr-004', 'usr-005']
      },
      {
        id: 'proy-003',
        codigo: 'CONTROL-QA',
        nombre: 'Control de calidad',
        descripcion: 'Revision de funcionalidades, errores y pruebas del sistema',
        estado: 'pausado',
        integrantes: ['usr-001', 'usr-002', 'usr-003']
      },
      {
        id: 'proy-004',
        codigo: 'PROY-CERRADO',
        nombre: 'Proyecto finalizado',
        descripcion: 'Proyecto cerrado utilizado para validar restricciones',
        estado: 'finalizado',
        integrantes: ['usr-001', 'usr-005']
      }
    ],

    tareas: [
      { id: 'tar-1001', proyectoId: 'proy-001', titulo: 'Crear formulario de carga', descripcion: 'Armar el formulario para registrar una tarea nueva', responsableId: 'usr-003', prioridad: 'alta', estado: 'pendiente', fechaLimite: '2026-07-01', createdAt: '2026-06-01T10:00:00.000Z' },
      { id: 'tar-1002', proyectoId: 'proy-001', titulo: 'Validar usuario responsable', descripcion: 'Controlar que el responsable pertenezca al proyecto seleccionado', responsableId: 'usr-004', prioridad: 'alta', estado: 'en_progreso', fechaLimite: '2026-07-03', createdAt: '2026-06-01T11:00:00.000Z' },
      { id: 'tar-1003', proyectoId: 'proy-001', titulo: 'Revisar mensajes de error', descripcion: 'Mostrar mensajes claros cuando una operacion no sea valida', responsableId: 'usr-002', prioridad: 'media', estado: 'bloqueada', fechaLimite: '2026-06-15', createdAt: '2026-06-02T09:00:00.000Z' },
      { id: 'tar-1004', proyectoId: 'proy-001', titulo: 'Actualizar documentacion inicial', descripcion: 'Agregar instrucciones basicas para ejecutar el sistema', responsableId: 'usr-003', prioridad: 'baja', estado: 'finalizada', fechaLimite: '2026-06-10', createdAt: '2026-06-02T12:00:00.000Z' },
      { id: 'tar-1005', proyectoId: 'proy-001', titulo: 'Cancelar carga duplicada', descripcion: 'Tarea cancelada porque ya existia una solicitud similar', responsableId: 'usr-004', prioridad: 'baja', estado: 'cancelada', fechaLimite: '2026-06-11', createdAt: '2026-06-03T10:00:00.000Z' },

      { id: 'tar-1006', proyectoId: 'proy-002', titulo: 'Diseñar pantalla principal', descripcion: 'Crear la vista principal del portal con accesos rapidos', responsableId: 'usr-004', prioridad: 'media', estado: 'pendiente', fechaLimite: '2026-07-04', createdAt: '2026-06-03T13:00:00.000Z' },
      { id: 'tar-1007', proyectoId: 'proy-002', titulo: 'Agregar filtros de busqueda', descripcion: 'Permitir filtrar solicitudes por estado y prioridad', responsableId: 'usr-005', prioridad: 'critica', estado: 'en_progreso', fechaLimite: '2026-06-01', createdAt: '2026-06-04T10:00:00.000Z' },
      { id: 'tar-1008', proyectoId: 'proy-002', titulo: 'Crear detalle de solicitud', descripcion: 'Mostrar la informacion completa de una solicitud seleccionada', responsableId: 'usr-004', prioridad: 'alta', estado: 'pendiente', fechaLimite: '2026-07-08', createdAt: '2026-06-04T11:00:00.000Z' },
      { id: 'tar-1009', proyectoId: 'proy-002', titulo: 'Editar datos cargados', descripcion: 'Permitir modificar descripcion, prioridad y responsable', responsableId: 'usr-002', prioridad: 'alta', estado: 'en_progreso', fechaLimite: '2026-07-09', createdAt: '2026-06-05T10:00:00.000Z' },
      { id: 'tar-1010', proyectoId: 'proy-002', titulo: 'Crear pagina no encontrada', descripcion: 'Mostrar una pantalla simple cuando la ruta no exista', responsableId: 'usr-005', prioridad: 'baja', estado: 'finalizada', fechaLimite: '2026-06-12', createdAt: '2026-06-05T12:00:00.000Z' },

      { id: 'tar-1011', proyectoId: 'proy-003', titulo: 'Preparar pruebas de login', descripcion: 'Probar inicio de sesion correcto e incorrecto', responsableId: 'usr-003', prioridad: 'media', estado: 'pendiente', fechaLimite: '2026-07-10', createdAt: '2026-06-06T09:00:00.000Z' },
      { id: 'tar-1012', proyectoId: 'proy-003', titulo: 'Probar permisos por rol', descripcion: 'Verificar que colaborador, lider y admin tengan permisos correctos', responsableId: 'usr-002', prioridad: 'critica', estado: 'bloqueada', fechaLimite: '2026-06-02', createdAt: '2026-06-06T10:00:00.000Z' },
      { id: 'tar-1013', proyectoId: 'proy-003', titulo: 'Revisar datos de prueba', descripcion: 'Controlar que los datos iniciales se carguen correctamente', responsableId: 'usr-001', prioridad: 'media', estado: 'en_progreso', fechaLimite: '2026-07-11', createdAt: '2026-06-06T12:00:00.000Z' },

      { id: 'tar-1014', proyectoId: 'proy-004', titulo: 'Verificar proyecto cerrado', descripcion: 'Tarea finalizada para probar que un proyecto cerrado no se modifique', responsableId: 'usr-005', prioridad: 'alta', estado: 'finalizada', fechaLimite: '2026-06-01', createdAt: '2026-06-07T10:00:00.000Z' },
      { id: 'tar-1015', proyectoId: 'proy-001', titulo: 'Probar cambios de estado', descripcion: 'Tarea disponible para probar iniciar, bloquear, finalizar o cancelar', responsableId: 'usr-004', prioridad: 'baja', estado: 'pendiente', fechaLimite: '2026-07-20', createdAt: '2026-06-07T12:00:00.000Z' }
    ],

    historial_tareas: [
      { id: 'hist-001', tareaId: 'tar-1001', usuarioId: 'usr-001', accion: 'creacion', fechaHora: '2026-06-01T10:00:00.000Z', valorAnterior: null, valorNuevo: { estado: 'pendiente' } },
      { id: 'hist-002', tareaId: 'tar-1002', usuarioId: 'usr-002', accion: 'cambio_estado', fechaHora: '2026-06-02T10:00:00.000Z', valorAnterior: { estado: 'pendiente' }, valorNuevo: { estado: 'en_progreso' } },
      { id: 'hist-003', tareaId: 'tar-1003', usuarioId: 'usr-002', accion: 'cambio_estado', fechaHora: '2026-06-03T10:00:00.000Z', valorAnterior: { estado: 'en_progreso' }, valorNuevo: { estado: 'bloqueada' } }
    ]
  };
}

module.exports = createSeed;