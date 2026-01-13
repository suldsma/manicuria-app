import { useState, useEffect } from 'react';
import { LogOut, Calendar, Users, Briefcase } from 'lucide-react';
import { api } from './services/api';
import Login from './components/Login';
import AgendaDiaria from './components/AgendaDiaria';
import NuevoTurno from './components/NuevoTurno';
import ListaServicios from './components/ListaServicios';
import ListaClientas from './components/ListaClientas';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [vistaActual, setVistaActual] = useState('agenda');
  const [mostrarNuevoTurno, setMostrarNuevoTurno] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombreNegocio');
    if (token) {
      setAutenticado(true);
      setNombreNegocio(nombre || 'Mi Salón');
    }
  }, []);

  const handleLogin = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('nombreNegocio', data.nombreNegocio);
    setNombreNegocio(data.nombreNegocio);
    setAutenticado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreNegocio');
    setAutenticado(false);
  };

  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>💅 {nombreNegocio}</h1>
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut size={18} /> Salir
        </button>
      </nav>

      <div className="tabs">
        <button
          className={vistaActual === 'agenda' ? 'tab-active' : 'tab'}
          onClick={() => setVistaActual('agenda')}
        >
          <Calendar size={20} /> Agenda
        </button>
        <button
          className={vistaActual === 'servicios' ? 'tab-active' : 'tab'}
          onClick={() => setVistaActual('servicios')}
        >
          <Briefcase size={20} /> Servicios
        </button>
        <button
          className={vistaActual === 'clientas' ? 'tab-active' : 'tab'}
          onClick={() => setVistaActual('clientas')}
        >
          <Users size={20} /> Clientas
        </button>
      </div>

      <main className="main-content">
        {vistaActual === 'agenda' && (
          <AgendaDiaria onNuevoTurno={() => setMostrarNuevoTurno(true)} />
        )}
        {vistaActual === 'servicios' && <ListaServicios />}
        {vistaActual === 'clientas' && 