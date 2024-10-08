const mongoose = require('mongoose');

const FilamentoSchema = new mongoose.Schema({
  nombre: String,
  costo: Number, // Costo por kilogramo
  color: String, // Color del filamento
  tipo: String, // Tipo del filamento (e.g., PLA, ABS)
  peso: Number, // Peso disponible del filamento en gramos
  fechaRegistro: {
    type: Date,
    default: Date.now // Fecha en la que se registra el filamento
  }
});

module.exports = mongoose.model('Filamento', FilamentoSchema);
