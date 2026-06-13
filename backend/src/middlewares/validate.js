const AppError = require('../utils/AppError');

function validateRequired(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === '') {
        return next(new AppError(`Falta el campo ${field}`, 400));
      }
    }

    next();
  };
}

module.exports = { validateRequired };
