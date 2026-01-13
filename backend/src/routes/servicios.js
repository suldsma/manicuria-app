import express from 'express';
import Servicio from '../models/Servicio.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const servicios = await Servicio.find().sort({ nombre: 1 });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const servicio = new Servicio(req.body);
    await servicio.save();
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear servicio' });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar servicio' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ mensaje: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

export default router;