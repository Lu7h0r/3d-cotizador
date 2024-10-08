const mongoose = require('mongoose');

// URI de conexión proporcionada
const uri = 'mongodb+srv://abautixta:OXmxXwVpOR9wRihT@craftprintero.blzw4.mongodb.net/craftprinter?retryWrites=true&w=majority&appName=Craftprintero';

mongoose.connect(uri, {
    tlsAllowInvalidCertificates: true // Desactivar la verificación SSL para pruebas
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error de conexión:', err);
  });