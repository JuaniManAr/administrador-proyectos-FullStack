import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { crearTarea, editarTarea, getTarea } from '../services/tareas.service';
import { getProyectos } from '../services/proyectos.service';
import { getUsuarios } from '../services/usuarios.service';

const emptyForm = {
  proyectoId: '',
  titulo: '',
  descripcion: '',
  responsableId: '',
  prioridad: 'media',
  estado: 'pendiente',
  fechaLimite: ''
};

export default function TareaForm() {
  const { id } = useParams();
  const editMode = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [proys, users] = await Promise.all([getProyectos(), getUsuarios()]);
      setProyectos(proys);
      setUsuarios(users);

      if (editMode) {
        const tarea = await getTarea(id);
        setForm({
          proyectoId: tarea.proyectoId,
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          responsableId: tarea.responsableId,
          prioridad: tarea.prioridad,
          estado: tarea.estado,
          fechaLimite: tarea.fechaLimite
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar el formulario');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const proyectoSeleccionado = useMemo(
    () => proyectos.find((p) => p.id === form.proyectoId),
    [proyectos, form.proyectoId]
  );

  const responsablesDelProyecto = useMemo(() => {
    if (!proyectoSeleccionado) return [];
    return usuarios.filter((u) => proyectoSeleccionado.integrantes.includes(u.id));
  }, [usuarios, proyectoSeleccionado]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'proyectoId') {
      // Al cambiar el proyecto, borro el responsable para evitar combinaciones invalidas.
      setForm({ ...form, proyectoId: value, responsableId: '' });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setOk('');

      if (editMode) {
        await editarTarea(id, form);
        setOk('Tarea editada correctamente');
      } else {
        await crearTarea(form);
        setOk('Tarea creada correctamente');
      }

      setTimeout(() => navigate('/tareas'), 600);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar la tarea');
    }
  }

  if (loading) return <p className="card">Cargando...</p>;

  return (
    <section className="card form-card grande">
      <Link to="/tareas">← Volver</Link>
      <h1>{editMode ? 'Editar tarea' : 'Nueva tarea'}</h1>

      <form onSubmit={handleSubmit}>
        <label>Proyecto</label>
        <select name="proyectoId" value={form.proyectoId} onChange={handleChange} disabled={editMode}>
          <option value="">Seleccione proyecto</option>
          {proyectos
            .filter((p) => editMode || p.estado === 'activo')
            .map((p) => (
              <option key={p.id} value={p.id}>{p.codigo} - {p.nombre}</option>
            ))}
        </select>

        <label>Titulo</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} />

        <label>Descripcion</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />

        <label>Responsable</label>
        <select name="responsableId" value={form.responsableId} onChange={handleChange}>
          <option value="">Seleccione responsable</option>
          {responsablesDelProyecto.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
          ))}
        </select>

        <label>Prioridad</label>
        <select name="prioridad" value={form.prioridad} onChange={handleChange}>
          <option value="baja">baja</option>
          <option value="media">media</option>
          <option value="alta">alta</option>
          <option value="critica">critica</option>
        </select>

        <label>Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange} disabled={!editMode}>
          <option value="pendiente">pendiente</option>
          {editMode && <option value="en_progreso">en_progreso</option>}
          {editMode && <option value="bloqueada">bloqueada</option>}
          {editMode && <option value="finalizada">finalizada</option>}
          {editMode && <option value="cancelada">cancelada</option>}
        </select>

        <label>Fecha limite</label>
        <input name="fechaLimite" type="date" value={form.fechaLimite} onChange={handleChange} />

        <button>{editMode ? 'Guardar cambios' : 'Crear tarea'}</button>
      </form>

      {ok && <p className="ok">{ok}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
