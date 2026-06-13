const service = require('../services/proyectos.service');

function list(req, res, next) {
  try {
    res.json(service.list());
  } catch (error) {
    next(error);
  }
}

module.exports = { list };
