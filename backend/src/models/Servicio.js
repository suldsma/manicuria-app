import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  duracion: {
    type: Number,
    required: true,
    min: 15
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  observaciones: {
    type: String,
    default: ''
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Servicio', servicioSchema);