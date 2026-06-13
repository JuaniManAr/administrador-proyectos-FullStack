const db = require('../data/db');

function list() {
  const data = db.read();
  return data.proyectos;
}

module.exports = { list };
