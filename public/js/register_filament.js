document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrarFilamentoForm');
  
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      // Capturar los datos del formulario
      const nombre = document.getElementById('nombre').value;
      const costo = parseFloat(document.getElementById('costo').value);
      const color = document.getElementById('color').value;
      const tipo = document.getElementById('tipo').value;
      const peso = parseFloat(document.getElementById('peso').value);
  
      const filamentoData = {
        nombre,
        costo,
        color,
        tipo,
        peso,
      };
  
      try {
        // Enviar los datos al backend para registrarlos en MongoDB
        const response = await fetch('/api/filamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filamentoData),
        });
  
        if (response.ok) {
          alert('Filamento registrado exitosamente');
          form.reset();
        } else {
          const errorData = await response.json();
          alert(`Error al registrar el filamento: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el filamento');
      }
    });
  });
  