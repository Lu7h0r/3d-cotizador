require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const filamentosRoutes = require('./routes/filamentos'); // Importar rutas para filamentos
const cotizacionesRoutes = require('./routes/cotizaciones'); // Importar rutas para cotizaciones

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true // Desactivar la verificación SSL para pruebas
  })
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error de conexión:', err);
  });
  

// Middleware
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta "public"

// Rutas
app.use('/api/filamentos', filamentosRoutes);
app.use('/api/cotizaciones', cotizacionesRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});