import { useState, useEffect } from 'react';
import { Plus, Edit, User, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function ListaClientas() {
  const [clientas, setClientas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', nota: '' });

  useEffect(() => {
    cargarClientas();
  }, []);

  const cargarClientas = async () => {
    try {
      const data = await api.getClientas();
      setClientas(data);
    } catch (error) {
      alert('Error al cargar clientas');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editando) {
        await api.updateClienta(editando, formData);
        alert('Clienta actualizada');
      } else {
        await api.createClienta(formData);
        alert('Clienta creada');
      }
      
      resetForm();
      cargarClientas();
    } catch (error) {
      alert('Error al guardar clienta');
    }
  };

  const editar = (clienta) => {
    setFormData({ nombre: clienta.nombre, telefono: clienta.telefono, nota: clienta.nota || '' });
    setEditando(clienta._id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', telefono: '', nota: '' });
    setEditando(null);
    setMostrarForm(false);
  };

  return (
    
      
        👩‍🦰 Clientas
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
           Nueva Clienta
        
      

      {mostrarForm && (
        
          
            
              Nombre *
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            

            
              Teléfono *
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            
          

          
            Nota
            <input
              type="text"
              value={formData.nota}
              onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
              placeholder="Ej: Alérgica al acrílico, prefiere diseños florales..."
            />
          

          
            
              Cancelar
            
            
              {editando ? 'Actualizar' : 'Crear'} Clienta
            
          
        
      )}

      
        {clientas.map((clienta) => (
          
            
              
            
            
              {clienta.nombre}
               {clienta.telefono}
              {clienta.nota && 📝 {clienta.nota}}
            
            <button onClick={() => editar(clienta)} className="btn-icon">
              
            
          
        ))}
      
    
  );
}