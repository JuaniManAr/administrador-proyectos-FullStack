import React from 'react';

export default function TareaFiltros({ filtros, setFiltros, proyectos, usuarios, onBuscar }) {
  function handleChange(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value, page: 1 });
  }

  return (
    <form className="card filtros" onSubmit={(e) => { e.preventDefault(); onBuscar(); }}>
      <select name="proyectoId" value={filtros.proyectoId} onChange={handleChange}>
        <option value="">Todos los proyectos</option>
        {proyectos.map((p) => (
          <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>
        ))}
      </select>

      <select name="responsableId" value={filtros.responsableId} onChange={handleChange}>
        <option value="">Todos los responsables</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>{u.nombre}</option>
        ))}
      </select>

      <select name="estado" value={filtros.estado} onChange={handleChange}>
        <option value="">Todos los estados</option>
        <option value="pendiente">pendiente</option>
        <option value="en_progreso">en_progreso</option>
        <option value="bloqueada">bloqueada</option>
        <option value="finalizada">finalizada</option>
        <option value="cancelada">cancelada</option>
      </select>

      <select name="prioridad" value={filtros.prioridad} onChange={handleChange}>
        <option value="">Todas las prioridades</option>
        <option value="baja">baja</option>
        <option value="media">media</option>
        <option value="alta">alta</option>
        <option value="critica">critica</option>
      </select>

      <select name="sortBy" value={filtros.sortBy} onChange={handleChange}>
        <option value="createdAt">Fecha creacion</option>
        <option value="fechaLimite">Fecha limite</option>
        <option value="titulo">Titulo</option>
        <option value="estado">Estado</option>
        <option value="prioridad">Prioridad</option>
      </select>

      <select name="order" value={filtros.order} onChange={handleChange}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      <button>Buscar</button>
    </form>
  );
}
