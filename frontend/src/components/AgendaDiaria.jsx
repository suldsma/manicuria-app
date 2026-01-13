import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AgendaDiaria({ onNuevoTurno }) {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTurnos();
  }, [fecha]);

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await api.getTurnos(fecha);
      setTurnos(data);
    } catch (error) {
      alert('Error al cargar turnos');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    if (!confirm(`¿Confirmar cambio de estado?`)) return;
    
    try {
      await api.cambiarEstadoTurno(id, estado);
      cargarTurnos();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const eliminarTurno = async (id) => {
    if (!confirm('¿Eliminar este turno?')) return;
    
    try {
      await api.deleteTurno(id);
      alert('Turno eliminado');
      cargarTurnos();
    } catch (error) {
      alert('Error al eliminar turno');
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'confirmado': return 'estado-confirmado';
      case 'finalizado': return 'estado-finalizado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'confirmado': return 'Confirmado';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  if (loading) return Cargando turnos...;

  return (
    
      
        📅 Agenda Diaria
        
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="date-input"
          />
          
             Nuevo Turno
          
        
      

      {turnos.length === 0 ? (
        
          
          No hay turnos para este día
          
            Agregar Turno
          
        
      ) : (
        
          {turnos.map((turno) => (
            
              
                
                  
                  {turno.horaInicio} - {turno.horaFin}
                
                {turno.duracion} min
              

              
                
                  
                    
                    {turno.clienta.nombre}
                  
                  
                    💅 {turno.servicio.nombre}
                  
                  
                    ${turno.precio.toLocaleString()}
                  
                  {turno.observaciones && (
                    
                      📝 {turno.observaciones}
                    
                  )}
                

                
                  {getEstadoTexto(turno.estado)}
                
              

              
                {turno.estado === 'confirmado' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(turno._id, 'finalizado')}
                      className="btn-icon btn-success"
                      title="Finalizar"
                    >
                      
                    
                    <button
                      onClick={() => cambiarEstado(turno._id, 'cancelado')}
                      className="btn-icon btn-danger"
                      title="Cancelar"
                    >
                      
                    
                  </>
                )}
                <button
                  onClick={() => eliminarTurno(turno._id)}
                  className="btn-icon btn-danger"
                  title="Eliminar"
                >
                  
                
              
            
          ))}
        
      )}
    
  );