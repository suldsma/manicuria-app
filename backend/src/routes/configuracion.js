import express from 'express';
import Configuracion from '../models/Configuracion.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const config = await Configuracion.findOne().select('-password');
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

router.put('/', verificarToken, async (req, res) => {
  try {
    const config = await Configuracion.findOneAndUpdate(
      {},
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(config);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar configuración' });
  }
});

export default router;