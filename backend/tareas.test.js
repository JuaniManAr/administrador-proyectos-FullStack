const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/db');

async function login(email = 'admin@dds.com', password = '123456') {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return res.body.token;
}

beforeEach(() => {
  db.reset();
});

describe('TP DDS - API de tareas', () => {
  test('login correcto devuelve usuario y JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@dds.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.email).toBe('admin@dds.com');
    expect(res.body.usuario.passwordHash).toBeUndefined();
  });

  test('login invalido devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@dds.com', password: 'mal' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales invalidas');
  });

  test('listado de tareas con y sin filtros', async () => {
    const token = await login();

    const all = await request(app)
      .get('/api/tareas')
      .set('Authorization', `Bearer ${token}`);

    expect(all.status).toBe(200);
    expect(all.body.items.length).toBeGreaterThan(0);
    expect(all.body.total).toBeGreaterThan(0);

    const filtered = await request(app)
      .get('/api/tareas?proyectoId=proy-001&estado=pendiente&prioridad=baja')
      .set('Authorization', `Bearer ${token}`);

    expect(filtered.status).toBe(200);
    expect(filtered.body.items.every((t) => t.proyectoId === 'proy-001')).toBe(true);
    expect(filtered.body.items.every((t) => t.estado === 'pendiente')).toBe(true);
    expect(filtered.body.items.every((t) => t.prioridad === 'baja')).toBe(true);
  });

  test('detalle de tarea existente e inexistente', async () => {
    const token = await login();

    const ok = await request(app)
      .get('/api/tareas/tar-1001')
      .set('Authorization', `Bearer ${token}`);

    expect(ok.status).toBe(200);
    expect(ok.body.id).toBe('tar-1001');

    const notFound = await request(app)
      .get('/api/tareas/tar-no-existe')
      .set('Authorization', `Bearer ${token}`);

    expect(notFound.status).toBe(404);
    expect(notFound.body.error).toBe('Tarea inexistente');
  });

  test('creacion valida de tarea', async () => {
    const token = await login();

    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-001',
        titulo: 'Nueva tarea',
        descripcion: 'Descripcion de prueba',
        responsableId: 'usr-004',
        prioridad: 'media',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.titulo).toBe('Nueva tarea');
  });

  test('creacion invalida por responsable fuera del proyecto', async () => {
    const token = await login();

    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-001',
        titulo: 'Responsable incorrecto',
        descripcion: 'Debe fallar',
        responsableId: 'usr-005',
        prioridad: 'media',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('El responsable no pertenece al proyecto');
  });

  test('creacion invalida por prioridad o estado no permitido', async () => {
    const token = await login();

    const badPriority = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-001',
        titulo: 'Prioridad mala',
        descripcion: 'Debe fallar',
        responsableId: 'usr-004',
        prioridad: 'urgente',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(badPriority.status).toBe(400);
    expect(badPriority.body.error).toBe('Prioridad invalida');

    const badState = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-001',
        titulo: 'Estado malo',
        descripcion: 'Debe fallar',
        responsableId: 'usr-004',
        prioridad: 'media',
        estado: 'revisando',
        fechaLimite: '2026-07-30'
      });

    expect(badState.status).toBe(400);
    expect(badState.body.error).toBe('Estado invalido');
  });

  test('ruta protegida sin JWT devuelve 401', async () => {
    const res = await request(app)
      .post('/api/tareas')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token requerido');
  });

  test('colaborador no puede crear tareas: devuelve 403', async () => {
    const token = await login('juan@dds.com');

    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-001',
        titulo: 'Intento colaborador',
        descripcion: 'No deberia crear',
        responsableId: 'usr-004',
        prioridad: 'media',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Falta de permisos');
  });

  test('no permite crear tareas en proyecto finalizado o pausado', async () => {
    const token = await login();

    const finalizado = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-004',
        titulo: 'Proyecto finalizado',
        descripcion: 'Debe fallar',
        responsableId: 'usr-005',
        prioridad: 'media',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(finalizado.status).toBe(400);
    expect(finalizado.body.error).toBe('No se pueden crear tareas en un proyecto finalizado');

    const pausado = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        proyectoId: 'proy-003',
        titulo: 'Proyecto pausado',
        descripcion: 'Debe fallar',
        responsableId: 'usr-003',
        prioridad: 'media',
        estado: 'pendiente',
        fechaLimite: '2026-07-30'
      });

    expect(pausado.status).toBe(400);
    expect(pausado.body.error).toBe('No se pueden crear tareas en un proyecto pausado');
  });

  test('no permite una transicion de estado invalida', async () => {
    const token = await login();

    const res = await request(app)
      .put('/api/tareas/tar-1004')
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'pendiente' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No se puede editar una tarea finalizada o cancelada');
  });

  test('historial de cambios queda registrado al iniciar una tarea', async () => {
    const token = await login();

    const change = await request(app)
      .patch('/api/tareas/tar-1015/iniciar')
      .set('Authorization', `Bearer ${token}`);

    expect(change.status).toBe(200);
    expect(change.body.estado).toBe('en_progreso');

    const history = await request(app)
      .get('/api/tareas/tar-1015/historial')
      .set('Authorization', `Bearer ${token}`);

    expect(history.status).toBe(200);
    expect(history.body.some((h) => h.accion === 'cambio_estado')).toBe(true);
  });
});
