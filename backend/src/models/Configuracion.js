import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const configuracionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombreNegocio: {
    type: String,
    default: 'Mi Salón de Manicura'
  },
  horarioLaboral: {
    lunes: { activo: true, inicio: '09:00', fin: '18:00' },
    martes: { activo: true, inicio: '09:00', fin: '18:00' },
    miercoles: { activo: true, inicio: '09:00', fin: '18:00' },
    jueves: { activo: true, inicio: '09:00', fin: '18:00' },
    viernes: { activo: true, inicio: '09:00', fin: '18:00' },
    sabado: { activo: true, inicio: '09:00', fin: '14:00' },
    domingo: { activo: false, inicio: '09:00', fin: '18:00' }
  },
  feriados: [Date]
}, { timestamps: true });

configuracionSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

configuracionSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('Configuracion', configuracionSchema);