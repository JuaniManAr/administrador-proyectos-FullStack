import api from './api';

export async function getUsuarios() {
  const res = await api.get('/usuarios');
  return res.data;
}
