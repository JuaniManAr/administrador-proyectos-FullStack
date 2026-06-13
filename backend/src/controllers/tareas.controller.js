const service = require('../services/tareas.service');

function list(req, res, next) {
  try {
    res.json(service.list(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

function getById(req, res, next) {
  try {
    res.json(service.getById(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

function historial(req, res, next) {
  try {
    res.json(service.historial(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

function create(req, res, next) {
  try {
    const tarea = service.create(req.body, req.user);
    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
}

function update(req, res, next) {
  try {
    res.json(service.update(req.params.id, req.body, req.user));
  } catch (error) {
    next(error);
  }
}

function iniciar(req, res, next) {
  try {
    res.json(service.changeState(req.params.id, 'en_progreso', req.user));
  } catch (error) {
    next(error);
  }
}

function bloquear(req, res, next) {
  try {
    res.json(service.changeState(req.params.id, 'bloqueada', req.user));
  } catch (error) {
    next(error);
  }
}

function cancelar(req, res, next) {
  try {
    res.json(service.changeState(req.params.id, 'cancelada', req.user));
  } catch (error) {
    next(error);
  }
}

function finalizar(req, res, next) {
  try {
    res.json(service.changeState(req.params.id, 'finalizada', req.user));
  } catch (error) {
    next(error);
  }
}

function resumen(req, res, next) {
  try {
    res.json(service.resumen(req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  historial,
  create,
  update,
  iniciar,
  bloquear,
  cancelar,
  finalizar,
  resumen
};
