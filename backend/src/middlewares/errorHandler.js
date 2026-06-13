const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError('Ruta no encontrada', 404));
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
