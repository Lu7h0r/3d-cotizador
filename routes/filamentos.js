// Importar dependencias
const express = require('express');
const router = express.Router();
const Filamento = require('../models/Filamento'); // Importar el modelo Filamento
const Cotizacion = require('../models/Cotizacion'); // Importar el modelo Cotizacion

// Crear un nuevo filamento
router.post('/registrar', async (req, res) => {
    try {
        const { nombre, costo, color, tipo, peso } = req.body;
        
        // Crear un nuevo objeto de Filamento
        const nuevoFilamento = new Filamento({
            nombre,
            costo,
            color,
            tipo,
            peso
        });

        // Guardar el filamento en la base de datos
        await nuevoFilamento.save();
        res.status(201).json({ message: 'Filamento registrado exitosamente', filamento: nuevoFilamento });
    } catch (error) {
        console.error('Error al registrar el filamento:', error);
        res.status(500).json({ message: 'Error al registrar el filamento' });
    }
});

// Crear una nueva cotización
router.post('/cotizar', async (req, res) => {
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
            nombreCliente
        });
        
        // Guardar la cotización en la base de datos
        await nuevaCotizacion.save();
        res.status(201).json({ message: 'Cotización creada exitosamente', cotizacion: nuevaCotizacion });
    } catch (error) {
        console.error('Error al crear la cotización:', error);
        res.status(500).json({ message: 'Error al crear la cotización' });
    }
});

// Obtener todos los filamentos
router.get('/listar', async (req, res) => {
    try {
        const filamentos = await Filamento.find();
        res.status(200).json(filamentos);
    } catch (error) {
        console.error('Error al obtener los filamentos:', error);
        res.status(500).json({ message: 'Error al obtener los filamentos' });
    }
});

module.exports = router;
