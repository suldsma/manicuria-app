import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      
        
          
            
          
          Bienvenida
          Ingresá para gestionar tus turnos
        

        
          
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          

          
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          

          {error && {error}}

          
            {loading ? 'Ingresando...' : 'Ingresar'}
          
        

        
          💅 Datos de prueba:
          Email: admin@manicura.com
          Contraseña: Admin123!
        
      
    
  );
