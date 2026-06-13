import api from './api';

export async function getTareas(params) {
  const res = await api.get('/tareas', { params });
  return res.data;
}

export async function getTarea(id) {
  const res = await api.get(`/tareas/${id}`);
  return res.data;
}

export async function crearTarea(data) {
  const res = await api.post('/tareas', data);
  return res.data;
}

export async function editarTarea(id, data) {
  const res = await api.put(`/tareas/${id}`, data);
  return res.data;
}

export async function cambiarEstadoTarea(id, accion) {
  const res = await api.patch(`/tareas/${id}/${accion}`);
  return res.data;
}

export async function getHistorial(id) {
  const res = await api.get(`/tareas/${id}/historial`);
  return res.data;
}

export async function getResumen() {
  const res = await api.get('/tareas/resumen');
  return res.data;
}
