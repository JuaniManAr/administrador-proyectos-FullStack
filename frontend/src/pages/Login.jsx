import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { saveLogin } = useAuth();
  const [form, setForm] = useState({ email: 'admin@dds.com', password: '123456' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      const data = await login(form);
      saveLogin(data);
      navigate('/tareas');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesion');
    }
  }

  return (
    <section className="card form-card">
      <h1>Iniciar sesion</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <button>Entrar</button>
      </form>

      {error && <p className="error">{error}</p>}
      <p className="ayuda">Tambien podes <Link to="/registro">registrar un usuario</Link>.</p>
    </section>
  );
}
