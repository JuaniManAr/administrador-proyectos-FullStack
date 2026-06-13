const db = require('../data/db');
const AppError = require('../utils/AppError');

const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];
const ESTADOS = ['pendiente', 'en_progreso', 'bloqueada', 'finalizada', 'cancelada'];
const MANAGERS = ['admin', 'lider'];

function isManager(user) {
  return user && MANAGERS.includes(user.rol);
}

function isVencida(tarea) {
  const hoy = new Date().toISOString().slice(0, 10);
  return tarea.fechaLimite < hoy && !['finalizada', 'cancelada'].includes(tarea.estado);
}

function nextId(items, prefix) {
  const numbers = items
    .map((item) => Number(String(item.id).replace(prefix, '')))
    .filter((n) => !Number.isNaN(n));

  const max = numbers.length ? Math.max(...numbers) : 0;
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

function enrichTask(tarea, data) {
  const proyecto = data.proyectos.find((p) => p.id === tarea.proyectoId);
  const responsable = data.usuarios.find((u) => u.id === tarea.responsableId);

  return {
    ...tarea,
    proyectoNombre: proyecto ? proyecto.nombre : 'Sin proyecto',
    responsableNombre: responsable ? responsable.nombre : 'Sin responsable',
    vencida: isVencida(tarea)
  };
}

function findProject(data, proyectoId) {
  const proyecto = data.proyectos.find((p) => p.id === proyectoId);

  if (!proyecto) {
    throw new AppError('Proyecto inexistente', 404);
  }

  return proyecto;
}

function validatePriority(prioridad) {
  if (!PRIORIDADES.includes(prioridad)) {
    throw new AppError('Prioridad invalida', 400);
  }
}

function validateState(estado) {
  if (!ESTADOS.includes(estado)) {
    throw new AppError('Estado invalido', 400);
  }
}

function validateResponsible(project, responsableId) {
  if (!project.integrantes.includes(responsableId)) {
    throw new AppError('El responsable no pertenece al proyecto', 400);
  }
}

function validateProjectForCreate(project) {
  if (project.estado === 'finalizado') {
    throw new AppError('No se pueden crear tareas en un proyecto finalizado', 400);
  }

  if (project.estado === 'pausado') {
    throw new AppError('No se pueden crear tareas en un proyecto pausado', 400);
  }
}

function validateProjectForEdit(project) {
  if (project.estado === 'finalizado') {
    throw new AppError('No se pueden modificar tareas de un proyecto finalizado', 400);
  }
}

function validateTransition(currentState, nextState) {
  const allowed = {
    pendiente: ['en_progreso', 'cancelada'],
    en_progreso: ['bloqueada', 'finalizada', 'cancelada'],
    bloqueada: ['cancelada'],
    finalizada: [],
    cancelada: []
  };

  if (!allowed[currentState] || !allowed[currentState].includes(nextState)) {
    throw new AppError(`Transicion de estado no permitida: ${currentState} -> ${nextState}`, 400);
  }
}

function addHistory(data, tareaId, usuarioId, accion, valorAnterior, valorNuevo) {
  data.historial_tareas.push({
    id: nextId(data.historial_tareas, 'hist-'),
    tareaId,
    usuarioId,
    accion,
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo
  });
}

function assertCanReadTask(tarea, user) {
  if (!isManager(user) && tarea.responsableId !== user.id) {
    throw new AppError('Falta de permisos', 403);
  }
}

function list(query, user) {
  const data = db.read();
  let tareas = [...data.tareas];

  // El colaborador solo ve sus tareas asignadas.
  if (!isManager(user)) {
    tareas = tareas.filter((t) => t.responsableId === user.id);
  }

  const { proyectoId, responsableId, estado, prioridad } = query;

  if (proyectoId) tareas = tareas.filter((t) => t.proyectoId === proyectoId);
  if (responsableId) tareas = tareas.filter((t) => t.responsableId === responsableId);
  if (estado) tareas = tareas.filter((t) => t.estado === estado);
  if (prioridad) tareas = tareas.filter((t) => t.prioridad === prioridad);

  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 'asc' : 'desc';
  const allowedSort = ['createdAt', 'fechaLimite', 'titulo', 'estado', 'prioridad'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';

  tareas.sort((a, b) => {
    const valueA = String(a[sortField]);
    const valueB = String(b[sortField]);
    return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const total = tareas.length;
  const start = (page - 1) * limit;
  const items = tareas.slice(start, start + limit).map((t) => enrichTask(t, data));

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  };
}

function getById(id, user) {
  const data = db.read();
  const tarea = data.tareas.find((t) => t.id === id);

  if (!tarea) {
    throw new AppError('Tarea inexistente', 404);
  }

  assertCanReadTask(tarea, user);
  return enrichTask(tarea, data);
}

function historial(id, user) {
  // Reutilizo getById para validar existencia y permiso de lectura.
  getById(id, user);

  const data = db.read();
  return data.historial_tareas
    .filter((h) => h.tareaId === id)
    .map((h) => {
      const usuario = data.usuarios.find((u) => u.id === h.usuarioId);
      return { ...h, usuarioNombre: usuario ? usuario.nombre : 'Usuario desconocido' };
    });
}

function create(body, user) {
  if (!isManager(user)) {
    throw new AppError('Falta de permisos', 403);
  }

  const data = db.read();
  const project = findProject(data, body.proyectoId);

  validateProjectForCreate(project);
  validateResponsible(project, body.responsableId);
  validatePriority(body.prioridad);
  validateState(body.estado);

  if (body.estado !== 'pendiente') {
    throw new AppError('La tarea nueva debe iniciar en estado pendiente', 400);
  }

  const tarea = {
    id: nextId(data.tareas, 'tar-'),
    proyectoId: body.proyectoId,
    titulo: body.titulo,
    descripcion: body.descripcion,
    responsableId: body.responsableId,
    prioridad: body.prioridad,
    estado: body.estado,
    fechaLimite: body.fechaLimite,
    createdAt: new Date().toISOString()
  };

  data.tareas.push(tarea);
  addHistory(data, tarea.id, user.id, 'creacion', null, tarea);
  db.write(data);

  return enrichTask(tarea, data);
}

function update(id, body, user) {
  const data = db.read();
  const index = data.tareas.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new AppError('Tarea inexistente', 404);
  }

  const tarea = data.tareas[index];
  const project = findProject(data, tarea.proyectoId);

  validateProjectForEdit(project);

  if (['finalizada', 'cancelada'].includes(tarea.estado)) {
    throw new AppError('No se puede editar una tarea finalizada o cancelada', 400);
  }

  if (body.proyectoId && body.proyectoId !== tarea.proyectoId) {
    throw new AppError('No se puede cambiar el proyecto de una tarea', 400);
  }

  const before = { ...tarea };

  if (!isManager(user)) {
    if (tarea.responsableId !== user.id) {
      throw new AppError('Falta de permisos', 403);
    }

    const changedKeys = Object.keys(body).filter((key) => body[key] !== undefined && body[key] !== tarea[key]);
    const allowed = changedKeys.every((key) => key === 'descripcion');

    if (!allowed) {
      throw new AppError('Falta de permisos', 403);
    }

    tarea.descripcion = body.descripcion ?? tarea.descripcion;
  } else {
    if (body.responsableId && body.responsableId !== tarea.responsableId) {
      validateResponsible(project, body.responsableId);
      tarea.responsableId = body.responsableId;
    }

    if (body.prioridad && body.prioridad !== tarea.prioridad) {
      validatePriority(body.prioridad);
      tarea.prioridad = body.prioridad;
    }

    if (body.estado && body.estado !== tarea.estado) {
      validateState(body.estado);
      validateTransition(tarea.estado, body.estado);
      tarea.estado = body.estado;
    }

    tarea.titulo = body.titulo ?? tarea.titulo;
    tarea.descripcion = body.descripcion ?? tarea.descripcion;
    tarea.fechaLimite = body.fechaLimite ?? tarea.fechaLimite;
  }

  data.tareas[index] = tarea;

  const changed = {};
  for (const key of ['titulo', 'descripcion', 'responsableId', 'prioridad', 'estado', 'fechaLimite']) {
    if (before[key] !== tarea[key]) {
      changed[key] = { anterior: before[key], nuevo: tarea[key] };
    }
  }

  if (Object.keys(changed).length > 0) {
    const accion = changed.estado ? 'cambio_estado' : changed.responsableId ? 'reasignacion' : 'edicion';
    addHistory(data, tarea.id, user.id, accion, before, tarea);
  }

  db.write(data);
  return enrichTask(tarea, data);
}

function changeState(id, nextState, user) {
  validateState(nextState);

  const data = db.read();
  const index = data.tareas.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new AppError('Tarea inexistente', 404);
  }

  const tarea = data.tareas[index];
  const project = findProject(data, tarea.proyectoId);

  validateProjectForEdit(project);

  if (!isManager(user)) {
    if (tarea.responsableId !== user.id) {
      throw new AppError('Falta de permisos', 403);
    }

    if (!['en_progreso', 'bloqueada'].includes(nextState)) {
      throw new AppError('Falta de permisos', 403);
    }
  }

  validateTransition(tarea.estado, nextState);

  const before = { estado: tarea.estado };
  tarea.estado = nextState;

  data.tareas[index] = tarea;
  addHistory(data, tarea.id, user.id, nextState === 'cancelada' ? 'cancelacion' : 'cambio_estado', before, { estado: nextState });
  db.write(data);

  return enrichTask(tarea, data);
}

function resumen(user) {
  if (!isManager(user)) {
    throw new AppError('Falta de permisos', 403);
  }

  const data = db.read();
  const tareasPorEstado = {};
  const cargaPorResponsable = {};

  for (const estado of ESTADOS) {
    tareasPorEstado[estado] = 0;
  }

  for (const tarea of data.tareas) {
    tareasPorEstado[tarea.estado] = (tareasPorEstado[tarea.estado] || 0) + 1;

    const responsable = data.usuarios.find((u) => u.id === tarea.responsableId);
    const nombre = responsable ? responsable.nombre : tarea.responsableId;
    cargaPorResponsable[nombre] = (cargaPorResponsable[nombre] || 0) + 1;
  }

  return {
    tareasPorEstado,
    tareasVencidas: data.tareas.filter(isVencida).length,
    cargaPorResponsable,
    tareasCriticas: data.tareas.filter((t) => t.prioridad === 'critica').length
  };
}

module.exports = {
  PRIORIDADES,
  ESTADOS,
  list,
  getById,
  historial,
  create,
  update,
  changeState,
  resumen
};
