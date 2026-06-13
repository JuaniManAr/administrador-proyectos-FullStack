import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'colaborador'
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      await register(form);
      setOk('Usuario registrado correctamente. Ya podes iniciar sesion.');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar');
    }
  }

  return (
    <section className="card form-card">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <label>Rol</label>
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="colaborador">colaborador</option>
          <option value="lider">lider</option>
        </select>

        <button>Registrar</button>
      </form>

      {ok && <p className="ok">{ok}</p>}
      {error && <p className="error">{error}</p>}
      <p className="ayuda"><Link to="/login">Volver al login</Link></p>
    </section>
  );
}
