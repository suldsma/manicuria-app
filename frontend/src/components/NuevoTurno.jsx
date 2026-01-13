import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

export default function NuevoTurno({ onClose, onSuccess }) {
  const [clientas, setClientas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    clienta: '',
    servicio: '',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [mostrarNuevaClienta, setMostrarNuevaClienta] = useState(false);
  const [nuevaClienta, setNuevaClienta] = useState({ nombre: '', telefono: '', nota: '' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [clientasData, serviciosData] = await Promise.all([
        api.getClientas(),
        api.getServicios()
      ]);
      setClientas(clientasData);
      setServicios(serviciosData.filter(s => s.activo));
    } catch (error) {
      alert('Error al cargar datos');
    }
  };

  const crearClienta = async () => {
    if (!nuevaClienta.nombre || !nuevaClienta.telefono) {
      alert('Completá nombre y teléfono');
      return;
    }

    try {
      const clienta = await api.createClienta(nuevaClienta);
      setClientas([...clientas, clienta]);
      setFormData({ ...formData, clienta: clienta._id });
      setMostrarNuevaClienta(false);
      setNuevaClienta({ nombre: '', telefono: '', nota: '' });
    } catch (error) {
      alert('Error al crear clienta');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clienta || !formData.servicio) {
      alert('Seleccioná clienta y servicio');
      return;
    }

    setLoading(true);
    try {
      await api.createTurno(formData);
      alert('✅ Turno creado correctamente');
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      
        
          Nuevo Turno
          
            
          
        

        
          
            Clienta *
            
              <select
                value={formData.clienta}
                onChange={(e) => setFormData({ ...formData, clienta: e.target.value })}
                required
              >
                Seleccionar clienta
                {clientas.map(c => (
                  
                    {c.nombre} - {c.telefono}
                  
                ))}
              
              <button
                type="button"
                onClick={() => setMostrarNuevaClienta(!mostrarNuevaClienta)}
                className="btn-secondary"
              >
                {mostrarNuevaClienta ? 'Cancelar' : '+ Nueva'}
              
            
          

          {mostrarNuevaClienta && (
            
              <input
                type="text"
                placeholder="Nombre"
                value={nuevaClienta.nombre}
                onChange={(e) => setNuevaClienta({ ...nuevaClienta, nombre: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={nuevaClienta.telefono}
                onChange={(e) => setNuevaClienta({ ...nuevaClienta, telefono: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nota (opcional)"
                value={nuevaClienta.nota}
                onChange={(e) => setNuevaClienta({ ...nuevaClienta, nota: e.target.value })}
              />
              
                Guardar Clienta
              
            
          )}

          
            Servicio *
            <select
              value={formData.servicio}
              onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
              required
            >
              Seleccionar servicio
              {servicios.map(s => (
                
                  {s.nombre} - {s.duracion} min - ${s.precio.toLocaleString()}
                
              ))}
            
          

          
            
              Fecha *
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            

            
              Hora *
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                required
              />
            
          

          
            Observaciones
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Ej: Trae diseño, arreglo de uña rota..."
              rows="3"
            />
          

          
            
              Cancelar
            
            
              {loading ? 'Guardando...' : 'Crear Turno'}
            
          
        
      
    
  );
}