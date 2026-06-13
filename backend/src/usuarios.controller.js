const service = require('../services/usuarios.service');

function list(req, res, next) {
  try {
    res.json(service.list());
  } catch (error) {
    next(error);
  }
}

module.exports = { list };
