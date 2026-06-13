import React, { useState } from 'react';
import { cambiarEstadoTarea } from '../services/tareas.service';
import { useAuth } from '../context/AuthContext';

export default function AccionesTarea({ tarea, onCambio }) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const esManager = ['admin', 'lider'].includes(user?.rol);
  const esResponsable = tarea.responsableId === user?.id;

  async function ejecutar(accion) {
    try {
      setError('');
      await cambiarEstadoTarea(tarea.id, accion);
      onCambio();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cambiar el estado');
    }
  }

  if (['finalizada', 'cancelada'].includes(tarea.estado)) {
    return <p className="ayuda">La tarea ya esta {tarea.estado}. No hay acciones disponibles.</p>;
  }

  return (
    <div className="acciones">
      <h3>Acciones de estado</h3>

      {tarea.estado === 'pendiente' && (esManager || esResponsable) && (
        <button onClick={() => ejecutar('iniciar')}>Iniciar</button>
      )}

      {tarea.estado === 'en_progreso' && (esManager || esResponsable) && (
        <button onClick={() => ejecutar('bloquear')}>Bloquear</button>
      )}

      {tarea.estado === 'en_progreso' && esManager && (
        <button onClick={() => ejecutar('finalizar')}>Finalizar</button>
      )}

      {esManager && (
        <button onClick={() => ejecutar('cancelar')}>Cancelar</button>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
