import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getHistorial, getTarea } from '../services/tareas.service';
import AccionesTarea from '../components/AccionesTarea';
import { useAuth } from '../context/AuthContext';

export default function TareaDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tarea, setTarea] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [task, history] = await Promise.all([getTarea(id), getHistorial(id)]);
      setTarea(task);
      setHistorial(history);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la tarea');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="card">Cargando...</p>;
  if (error) return <p className="error card">{error}</p>;
  if (!tarea) return null;

  const puedeEditar =
    !['finalizada', 'cancelada'].includes(tarea.estado) &&
    (['admin', 'lider'].includes(user?.rol) || tarea.responsableId === user?.id);

  return (
    <section>
      <Link to="/tareas">← Volver</Link>

      <article className="card">
        <div className="header-line">
          <div>
            <h1>{tarea.titulo}</h1>
            <p>{tarea.descripcion}</p>
          </div>

          {puedeEditar && <Link className="boton" to={`/tareas/${tarea.id}/editar`}>Editar</Link>}
        </div>

        <p><b>Proyecto:</b> {tarea.proyectoNombre}</p>
        <p><b>Responsable:</b> {tarea.responsableNombre}</p>
        <p><b>Prioridad:</b> {tarea.prioridad}</p>
        <p><b>Estado:</b> {tarea.estado}</p>
        <p><b>Fecha limite:</b> {tarea.fechaLimite}</p>
        {tarea.vencida && <p className="error">Esta tarea esta vencida.</p>}
      </article>

      <article className="card">
        <AccionesTarea tarea={tarea} onCambio={load} />
      </article>

      <article className="card">
        <h2>Historial</h2>
        {!historial.length && <p>No hay movimientos registrados.</p>}
        {historial.map((item) => (
          <div key={item.id} className="historial-item">
            <b>{item.accion}</b> - {item.usuarioNombre} - {new Date(item.fechaHora).toLocaleString()}
            <pre>{JSON.stringify({ anterior: item.valorAnterior, nuevo: item.valorNuevo }, null, 2)}</pre>
          </div>
        ))}
      </article>
    </section>
  );
}
