import api from './api';

export async function getProyectos() {
  const res = await api.get('/proyectos');
  return res.data;
}
