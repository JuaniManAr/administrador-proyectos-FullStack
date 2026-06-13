import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="card">
      <h1>Pagina no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <Link to="/tareas">Volver a tareas</Link>
    </section>
  );
}
