const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/Cotizacion');
const Filamento = require('../models/Filamento'); // Importar el modelo Filamento

// Crear una nueva cotización
router.post('/', async (req, res) => {
    try {
      const { nombreProducto, descripcion, horas, costoTotal, filamentoUtilizado, pesoFilamentoUtilizado, nombreCliente } = req.body;
  
      // Encontrar el filamento y actualizar el stock
      const filamento = await Filamento.findById(filamentoUtilizado);
      if (!filamento) {
        return res.status(404).json({ message: 'Filamento no encontrado' });
      }
  
      if (filamento.peso < pesoFilamentoUtilizado) {
        return res.status(400).json({ message: 'Stock insuficiente de filamento' });
      }
  
      filamento.peso -= pesoFilamentoUtilizado;
      await filamento.save();
  
      // Crear la cotización
      const nuevaCotizacion = new Cotizacion({
        nombreProducto,
        descripcion,
        horas,
        costoTotal,
        filamentoUtilizado,
        pesoFilamentoUtilizado,
        nombreCliente,
      });
  
      await nuevaCotizacion.save();
      res.status(201).json(nuevaCotizacion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find().populate('filamentoUtilizado'); // Traer los detalles del filamento utilizado
    res.json(cotizaciones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar una cotización
router.patch('/:id', async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    Object.assign(cotizacion, req.body);
    await cotizacion.save();
    res.json(cotizacion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una cotización
router.delete('/:id', async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndDelete(req.params.id);
    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
