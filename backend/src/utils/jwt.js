const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clave-simple-dds';

function signToken(user) {
  // El JWT no guarda contraseña ni datos sensibles.
  return jwt.sign(
    { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    SECRET,
    { expiresIn: '2h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
