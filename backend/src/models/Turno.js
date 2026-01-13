import mongoose from 'mongoose';

const turnoSchema = new mongoose.Schema({
  clienta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clienta',
    required: true
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFin: {
    type: String,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['confirmado', 'cancelado', 'finalizado'],
    default: 'confirmado'
  },
  observaciones: {
    type: String,
    default: ''
  }
}, { timestamps: true });

turnoSchema.index({ fecha: 1, horaInicio: 1 });

export default mongoose.model('Turno', turnoSchema);