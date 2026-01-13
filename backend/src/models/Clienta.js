import mongoose from 'mongoose';

const clientaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  nota: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Clienta', clientaSchema);