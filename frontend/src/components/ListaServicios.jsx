import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    duracion: 60,
    precio: 0,
    observaciones: '',
    activo: true
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await api.getServicios();
      setServicios(data);
    } catch (error) {
      alert('Error al cargar servicios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editando) {
        await api.updateServicio(editando, formData);
        alert('Servicio actualizado');
      } else {
        await api.createServicio(formData);
        alert('Servicio creado');
      }
      
      resetForm();
      cargarServicios();
    } catch (error) {
      alert('Error al guardar servicio');
    }
  };

  const editar = (servicio) => {
    setFormData(servicio);
    setEditando(servicio._id);
    setMostrarForm(true);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    
    try {
      await api.deleteServicio(id);
      alert('Servicio eliminado');
      cargarServicios();
    } catch (error) {
      alert('Error al eliminar servicio');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', duracion: 60, precio: 0, observaciones: '', activo: true });
    setEditando(null);
    setMostrarForm(false);
  };

  return (
    
      
        💅 Servicios
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
           Nuevo Servicio
        
      

      {mostrarForm && (
        
          
            
              Nombre *
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            

            
              Duración (min) *
              <input
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: parseInt(e.target.value) })}
                min="15"
                step="15"
                required
              />
            

            
              Precio *
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                min="0"
                step="100"
                required
              />
            
          

          
            Observaciones
            <input
              type="text"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Ej: Incluye diseño, refuerzo..."
            />
          

          
            
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              {' '}Servicio activo
            
          

          
            
              Cancelar
            
            
              {editando ? 'Actualizar' : 'Crear'} Servicio
            
          
        
      )}

      
        {servicios.map((servicio) => (
          
            
              {servicio.nombre}
              {!servicio.activo && Inactivo}
            
            
              ⏱️ {servicio.duracion} minutos
              💰 ${servicio.precio.toLocaleString()}
              {servicio.observaciones && 📝 {servicio.observaciones}}
            
            
              <button onClick={() => editar(servicio)} className="btn-icon">
                
              
              <button onClick={() => eliminar(servicio._id)} className="btn-icon btn-danger">
                
              
            
          
        ))}
      
    
  );
}