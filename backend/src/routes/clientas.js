import express from 'express';
import Clienta from '../models/Clienta.js';
import Turno from '../models/Turno.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const clientas = await Clienta.find().sort({ nombre: 1 });
    res.json(clientas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientas' });
  }
});

router.get('/:id/historial', verificarToken, async (req, res) => {
  try {
    const turnos = await Turno.find({ clienta: req.params.id })
      .populate('servicio')
      .sort({ fecha: -1 });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const clienta = new Clienta(req.body);
    await clienta.save();
    res.status(201).json(clienta);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear clienta' });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const clienta = await Clienta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clienta) {
      return res.status(404).json({ error: 'Clienta no encontrada' });
    }
    res.json(clienta);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar clienta' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const clienta = await Clienta.findByIdAndDelete(req.params.id);
    if (!clienta) {
      return res.status(404).json({ error: 'Clienta no encontrada' });
    }
    res.json({ mensaje: 'Clienta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar clienta' });
  }
});

export default router;