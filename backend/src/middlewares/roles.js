const AppError = require('../utils/AppError');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return next(new AppError('Falta de permisos', 403));
    }

    next();
  };
}

module.exports = { requireRole };
