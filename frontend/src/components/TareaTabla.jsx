import React from 'react';
import { Link } from 'react-router-dom';

export default function TareaTabla({ tareas }) {
  if (!tareas.length) {
    return <p className="card">No hay tareas para mostrar.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Proyecto</th>
          <th>Responsable</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Fecha limite</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tareas.map((tarea) => (
          <tr key={tarea.id} className={tarea.vencida ? 'vencida' : ''}>
            <td>{tarea.titulo}</td>
            <td>{tarea.proyectoNombre}</td>
            <td>{tarea.responsableNombre}</td>
            <td>{tarea.prioridad}</td>
            <td>{tarea.estado}</td>
            <td>{tarea.fechaLimite}</td>
            <td><Link to={`/tareas/${tarea.id}`}>Ver</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
