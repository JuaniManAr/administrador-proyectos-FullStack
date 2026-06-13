const bcrypt = require('bcryptjs');
const db = require('../data/db');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

function publicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo
  };
}

async function register(body) {
  const { nombre, email, password, rol = 'colaborador' } = body;

  if (!nombre || !email || !password) {
    throw new AppError('Nombre, email y password son obligatorios', 400);
  }

  if (!['colaborador', 'lider', 'admin'].includes(rol)) {
    throw new AppError('Rol invalido', 400);
  }

  const data = db.read();
  const exists = data.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new AppError('El email ya esta registrado', 400);
  }

  const newUser = {
    id: `usr-${String(data.usuarios.length + 1).padStart(3, '0')}`,
    nombre,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    rol,
    activo: true
  };

  data.usuarios.push(newUser);
  db.write(data);

  return publicUser(newUser);
}

async function login(body) {
  const { email, password } = body;

  if (!email || !password) {
    throw new AppError('Email y password son obligatorios', 400);
  }

  const data = db.read();
  const user = data.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.activo) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    throw new AppError('Credenciales invalidas', 401);
  }

  return {
    usuario: publicUser(user),
    token: signToken(user)
  };
}

module.exports = { register, login, publicUser };
