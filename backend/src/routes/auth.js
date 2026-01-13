import express from 'express';
import jwt from 'jsonwebtoken';
import Configuracion from '../models/Configuracion.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const config = await Configuracion.findOne({ email });
    if (!config) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    const esValido = await config.compararPassword(password);
    if (!esValido) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    const token = jwt.sign({ id: config._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      nombreNegocio: config.nombreNegocio
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;