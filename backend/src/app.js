const express = require('express');
const cors = require('cors');
const db = require('./data/db');
const authRoutes = require('./routes/auth.routes');
const proyectosRoutes = require('./routes/proyectos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const tareasRoutes = require('./routes/tareas.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Crea la base JSON si no existe.
db.init();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/tareas', tareasRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
