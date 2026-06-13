import React, { useEffect, useState } from 'react';
import { getResumen } from '../services/tareas.service';

export default function Resumen() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        setData(await getResumen());
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar el resumen');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="card">Cargando...</p>;
  if (error) return <p className="error card">{error}</p>;
  if (!data) return null;

  return (
    <section>
      <h1>Resumen administrativo</h1>

      <div className="grid">
        <div className="card resumen-card">
          <h2>Tareas vencidas</h2>
          <p>{data.tareasVencidas}</p>
        </div>

        <div className="card resumen-card">
          <h2>Tareas criticas</h2>
          <p>{data.tareasCriticas}</p>
        </div>
      </div>

      <article className="card">
        <h2>Tareas por estado</h2>
        <ul>
          {Object.entries(data.tareasPorEstado).map(([estado, total]) => (
            <li key={estado}>{estado}: {total}</li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h2>Carga por responsable</h2>
        <ul>
          {Object.entries(data.cargaPorResponsable).map(([nombre, total]) => (
            <li key={nombre}>{nombre}: {total}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
