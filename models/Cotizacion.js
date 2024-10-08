const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  nombreProducto: String, // Nombre del producto a cotizar
  descripcion: String,
  horas: Number,
  costoTotal: Number,
  filamentoUtilizado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Filamento'
  },
  pesoFilamentoUtilizado: Number, // Peso de filamento utilizado en gramos
  nombreCliente: String,
  estado: {
    type: String,
    default: 'Cotización'
  },
  idPedidoWooCommerce: String, // ID de pedido de WooCommerce
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cotizacion', CotizacionSchema);
