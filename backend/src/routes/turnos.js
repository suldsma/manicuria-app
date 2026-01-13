import express from 'express';
import Turno from '../models/Turno.js';
import Servicio from '../models/Servicio.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Función para calcular hora fin
function calcularHoraFin(horaInicio, duracion) {
  const [horas, minutos] = horaInicio.split(':').map(Number);
  const totalMinutos = horas * 60 + minutos + duracion;
  const nuevasHoras = Math.floor(totalMinutos / 60);
  const nuevosMinutos = totalMinutos % 60;
  return `${String(nuevasHoras).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
}

// Verificar disponibilidad
async function verificarDisponibilidad(fecha, horaInicio, horaFin, turnoId = null) {
  const query = {
    fecha: new Date(fecha),
    estado: 'confirmado',
    $or: [
      { horaInicio: { $lt: horaFin }, horaFin: { $gt: horaInicio } }
    ]
  };
  
  if (turnoId) {
    query._id = { $ne: turnoId };
  }
  
  const turnosSuperpuestos = await Turno.find(query);
  return turnosSuperpuestos.length === 0;
}

router.get('/', verificarToken, async (req, res) => {
  try {
    const { fecha, semana } = req.query;
    let query = { estado: { $ne: 'cancelado' } };
    
    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      query.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }
    
    const turnos = await Turno.find(query)
      .populate('clienta')
      .populate('servicio')
      .sort({ fecha: 1, horaInicio: 1 });
    
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const { clienta, servicio, fecha, horaInicio, observaciones } = req.body;
    
    const servicioData = await Servicio.findById(servicio);
    if (!servicioData) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    const horaFin = calcularHoraFin(horaInicio, servicioData.duracion);
    
    const disponible = await verificarDisponibilidad(fecha, horaInicio, horaFin);
    if (!disponible) {
      return res.status(400).json({ error: 'Ya hay un turno en ese horario' });
    }
    
    const turno = new Turno({
      clienta,
      servicio,
      fecha: new Date(fecha),
      horaInicio,
      horaFin,
      duracion: servicioData.duracion,
      precio: servicioData.precio,
      observaciones,
      estado: 'confirmado'
    });
    
    await turno.save();
    await turno.populate('clienta servicio');
    
    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear turno' });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { fecha, horaInicio, servicio } = req.body;
    const turnoActual = await Turno.findById(req.params.id);
    
    if (!turnoActual) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    let horaFin = turnoActual.horaFin;
    let duracion = turnoActual.duracion;
    
    if (servicio && servicio !== turnoActual.servicio.toString()) {
      const servicioData = await Servicio.findById(servicio);
      duracion = servicioData.duracion;
      horaFin = calcularHoraFin(horaInicio || turnoActual.horaInicio, duracion);
    } else if (horaInicio && horaInicio !== turnoActual.horaInicio) {
      horaFin = calcularHoraFin(horaInicio, duracion);
    }
    
    const disponible = await verificarDisponibilidad(
      fecha || turnoActual.fecha,
      horaInicio || turnoActual.horaInicio,
      horaFin,
      req.params.id
    );
    
    if (!disponible) {
      return res.status(400).json({ error: 'Ya hay un turno en ese horario' });
    }
    
    const turno = await Turno.findByIdAndUpdate(
      req.params.id,
      { ...req.body, horaFin, duracion },
      { new: true, runValidators: true }
    ).populate('clienta servicio');
    
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar turno' });
  }
});

router.patch('/:id/estado', verificarToken, async (req, res) => {
  try {
    const { estado } = req.body;
    const turno = await Turno.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate('clienta servicio');
    
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: 'Error al cambiar estado' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const turno = await Turno.findByIdAndDelete(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    res.json({ mensaje: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar turno' });
  }
});

export default router;