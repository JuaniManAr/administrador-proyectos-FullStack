import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TareaFiltros from '../components/TareaFiltros';
import TareaTabla from '../components/TareaTabla';
import { getTareas } from '../services/tareas.service';
import { getProyectos } from '../services/proyectos.service';
import { getUsuarios } from '../services/usuarios.service';
import { useAuth } from '../context/AuthContext';

export default function Tareas() {
  const { user } = useAuth();
  const esManager = ['admin', 'lider'].includes(user?.rol);
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    proyectoId: '',
    responsableId: '',
    estado: '',
    prioridad: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [proys, users, result] = await Promise.all([
        getProyectos(),
        getUsuarios(),
        getTareas(filtros)
      ]);

      setProyectos(proys);
      setUsuarios(users);
      setTareas(result.items);
      setMeta({ page: result.page, totalPages: result.totalPages, total: result.total });
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.page, filtros.sortBy, filtros.order]);

  function cambiarPagina(nextPage) {
    setFiltros({ ...filtros, page: nextPage });
  }

  return (
    <section>
      <div className="header-line">
        <div>
          <h1>Tareas</h1>
          <p className="ayuda">Listado con filtros, paginacion y ordenamiento.</p>
        </div>

        {esManager && <Link className="boton" to="/tareas/nueva">Nueva tarea</Link>}
      </div>

      <TareaFiltros
        filtros={filtros}
        setFiltros={setFiltros}
        proyectos={proyectos}
        usuarios={usuarios}
        onBuscar={load}
      />

      {loading && <p className="card">Cargando...</p>}
      {error && <p className="error card">{error}</p>}
      {!loading && !error && <TareaTabla tareas={tareas} />}

      <div className="paginacion">
        <button disabled={meta.page <= 1} onClick={() => cambiarPagina(meta.page - 1)}>Anterior</button>
        <span>Pagina {meta.page} de {meta.totalPages} - Total: {meta.total}</span>
        <button disabled={meta.page >= meta.totalPages} onClick={() => cambiarPagina(meta.page + 1)}>Siguiente</button>
      </div>
    </section>
  );
}
