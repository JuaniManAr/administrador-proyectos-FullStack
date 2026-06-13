const db = require('../data/db');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Token requerido', 401));
  }

  try {
    const token = header.replace('Bearer ', '');
    const payload = verifyToken(token);
    const data = db.read();
    const user = data.usuarios.find((u) => u.id === payload.id);

    if (!user || !user.activo) {
      return next(new AppError('Usuario no autorizado', 401));
    }

    req.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    };

    next();
  } catch (error) {
    next(new AppError('Token invalido', 401));
  }
}

module.exports = { requireAuth };
