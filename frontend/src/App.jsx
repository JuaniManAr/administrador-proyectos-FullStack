import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tareas from './pages/Tareas';
import TareaDetalle from './pages/TareaDetalle';
import TareaForm from './pages/TareaForm';
import Resumen from './pages/Resumen';
import NotFound from './pages/NotFound';

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="nav">
        <Link to="/tareas">Tareas</Link>
        <Link to="/resumen">Resumen</Link>
        {user ? (
          <>
            <span>{user.nombre} ({user.rol})</span>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/tareas" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route path="/tareas" element={
          <ProtectedRoute>
            <Tareas />
          </ProtectedRoute>
        } />

        <Route path="/tareas/nueva" element={
          <ProtectedRoute roles={['admin', 'lider']}>
            <TareaForm />
          </ProtectedRoute>
        } />

        <Route path="/tareas/:id" element={
          <ProtectedRoute>
            <TareaDetalle />
          </ProtectedRoute>
        } />

        <Route path="/tareas/:id/editar" element={
          <ProtectedRoute>
            <TareaForm />
          </ProtectedRoute>
        } />

        <Route path="/resumen" element={
          <ProtectedRoute roles={['admin', 'lider']}>
            <Resumen />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
