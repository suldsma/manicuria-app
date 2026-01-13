const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  // AUTH
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Error al iniciar sesión');
    return res.json();
  },

  // SERVICIOS
  getServicios: async () => {
    const res = await fetch(`${API_URL}/servicios`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener servicios');
    return res.json();
  },
  
  createServicio: async (data) => {
    const res = await fetch(`${API_URL}/servicios`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear servicio');
    return res.json();
  },
  
  updateServicio: async (id, data) => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar servicio');
    return res.json();
  },
  
  deleteServicio: async (id) => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar servicio');
  },

  // CLIENTAS
  getClientas: async () => {
    const res = await fetch(`${API_URL}/clientas`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener clientas');
    return res.json();
  },
  
  createClienta: async (data) => {
    const res = await fetch(`${API_URL}/clientas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear clienta');
    return res.json();
  },
  
  updateClienta: async (id, data) => {
    const res = await fetch(`${API_URL}/clientas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar clienta');
    return res.json();
  },
  
  getHistorialClienta: async (id) => {
    const res = await fetch(`${API_URL}/clientas/${id}/historial`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener historial');
    return res.json();
  },

  // TURNOS
  getTurnos: async (fecha) => {
    const url = fecha ? `${API_URL}/turnos?fecha=${fecha}` : `${API_URL}/turnos`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener turnos');
    return res.json();
  },
  
  createTurno: async (data) => {
    const res = await fetch(`${API_URL}/turnos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al crear turno');
    }
    return res.json();
  },
  
  updateTurno: async (id, data) => {
    const res = await fetch(`${API_URL}/turnos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al actualizar turno');
    }
    return res.json();
  },
  
  cambiarEstadoTurno: async (id, estado) => {
    const res = await fetch(`${API_URL}/turnos/${id}/estado`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ estado })
    });
    if (!res.ok) throw new Error('Error al cambiar estado');
    return res.json();
  },
  
  deleteTurno: async (id) => {
    const res = await fetch(`${API_URL}/turnos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar turno');
  },

  // CONFIGURACIÓN
  getConfiguracion: async () => {
    const res = await fetch(`${API_URL}/configuracion`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener configuración');
    return res.json();
  }
};