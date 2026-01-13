import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Configuracion from './models/Configuracion.js';
import Servicio from './models/Servicio.js';
import Clienta from './models/Clienta.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    // Limpiar base de datos
    await Configuracion.deleteMany({});
    await Servicio.deleteMany({});
    await Clienta.deleteMany({});
    
    // Crear configuración
    await Configuracion.create({
      email: 'admin@manicura.com',
      password: 'Admin123!',
      nombreNegocio: 'Nails & Beauty'
    });
    console.log('✅ Configuración creada');
    console.log('📧 Email: admin@manicura.com');
    console.log('🔑 Contraseña: Admin123!');
    
    // Crear servicios
    await Servicio.insertMany([
      { nombre: 'Kapping', duracion: 90, precio: 8000, observaciones: 'Incluye esmaltado semipermanente' },
      { nombre: 'Soft Gel', duracion: 60, precio: 6000, observaciones: 'Refuerzo natural' },
      { nombre: 'Esculpidas', duracion: 120, precio: 10000, observaciones: 'Uñas acrílicas' },
      { nombre: 'Esmaltado Simple', duracion: 30, precio: 3000 },
      { nombre: 'Esmaltado Semipermanente', duracion: 45, precio: 4500 },
      { nombre: 'Relleno', duracion: 60, precio: 5000 },
      { nombre: 'Retiro', duracion: 30, precio: 2000 }
    ]);
    console.log('✅ Servicios creados');
    
    // Crear clientas de ejemplo
    await Clienta.insertMany([
      { nombre: 'María González', telefono: '341-5551234', nota: 'Prefiere diseños florales' },
      { nombre: 'Laura Fernández', telefono: '341-5555678', nota: 'Alérgica al acrílico' },
      { nombre: 'Ana Martínez', telefono: '341-5559012' },
      { nombre: 'Sofía López', telefono: '341-5553456', nota: 'Cliente frecuente' },
      { nombre: 'Valentina Rodríguez', telefono: '341-5557890' }
    ]);
    console.log('✅ Clientas creadas');
    
    console.log('\n🎉 Base de datos lista!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();