document.addEventListener('DOMContentLoaded', async function () {
  await cargarFilamentosEnSelect();
  updateStockTable();
  updateTotals();
});

async function cargarFilamentosEnSelect() {
  try {
    const response = await fetch('/api/filamentos');
    if (response.ok) {
      const filamentos = await response.json();
      const materialSelect = document.getElementById('material');
      materialSelect.innerHTML = '';

      filamentos.forEach(filamento => {
        const option = document.createElement('option');
        option.value = filamento._id;
        option.setAttribute('data-price', filamento.costo);
        option.textContent = `${filamento.nombre} - ${filamento.costo} COP/kg`;
        materialSelect.appendChild(option);
      });
    } else {
      alert('Error al cargar los filamentos');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los filamentos');
  }
}

document.getElementById('calcular').addEventListener('click', function () {
  calcularCosto();
});

document.getElementById('agregar').addEventListener('click', function () {
  agregarAStock();
});

function calcularCosto() {
  const nombreImpresion = document.getElementById('nombreImpresion').value;
  const nombreCliente = document.getElementById('nombreCliente').value;
  const materialSelect = document.getElementById('material');
  const precioMaterial = parseFloat(materialSelect.options[materialSelect.selectedIndex].getAttribute('data-price')) / 1000; // Precio por gramo

  // Obtener horas y minutos
  const horas = parseFloat(document.getElementById('horas').value) || 0;
  const minutos = parseFloat(document.getElementById('minutos').value) || 0;
  const horasImpresion = horas + (minutos / 60); // Convertir todo a horas

  const precioKwh = parseFloat(document.getElementById('precioKwh').value);
  const metraje = parseFloat(document.getElementById('metraje').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const costoPostProcesado = parseFloat(document.getElementById('costoPostProcesado').value);
  const costoServicios = parseFloat(document.getElementById('costoServicios').value);
  const margenGanancia = parseFloat(document.getElementById('margenGanancia').value) / 100;

  // Cálculo del costo del filamento
  const pesoFilamento = metraje ? metraje * (1000 / 334) : peso;
  const costoFilamento = pesoFilamento * precioMaterial;

  // Cálculo del costo de la energía
  const consumoEnergia = horasImpresion * 1; // Consumo de la impresora por hora en kWh
  const costoEnergia = consumoEnergia * precioKwh;
  const costoEnergiaPorHora = 1 * precioKwh; // Costo por hora de impresión

  // Cálculo del costo total antes de margen de ganancia
  const costoTotal = costoFilamento + costoEnergia + costoPostProcesado + costoServicios;

  // Aplicación del margen de ganancia
  const precioFinal = costoTotal * (1 + margenGanancia);

  // Mostrar el resultado
  document.getElementById('resultado').innerText = `Costo Total: $${Math.round(precioFinal).toLocaleString('es-CO')}`;
  document.getElementById('costoPorHora').innerText = `Costo por Hora de Impresión: $${Math.round(costoEnergiaPorHora).toLocaleString('es-CO')}`;
  document.getElementById('costoSinGanancia').innerText = `Costo sin Ganancia: $${Math.round(costoTotal).toLocaleString('es-CO')}`;

  return {
    nombreProducto: nombreImpresion,
    descripcion: `Impresión de ${nombreImpresion}`,
    horas: horasImpresion.toFixed(2),
    costoTotal: Math.round(precioFinal),
    filamentoUtilizado: materialSelect.value,
    pesoFilamentoUtilizado: pesoFilamento.toFixed(2),
    nombreCliente: nombreCliente
  };
}

async function agregarAStock() {
  const resultado = calcularCosto();

  try {
    const response = await fetch('/api/cotizaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resultado)
    });

    if (response.ok) {
      alert('Cotización agregada exitosamente');
      await updateStockTable(); // Actualizar tabla después de agregar cotización
      updateTotals();
    } else {
      const errorData = await response.json();
      console.error('Error al agregar la cotización:', errorData);
      alert(`Error al agregar la cotización: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al agregar la cotización');
  }
}

async function updateStockTable() {
  try {
    const response = await fetch('/api/cotizaciones');
    if (response.ok) {
      const stock = await response.json();
      const stockTable = document.getElementById('stockTable');
      stockTable.innerHTML = '';

      stock.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-4 py-2">${item.nombreProducto}</td>
          <td class="px-4 py-2">${item.horas}</td>
          <td class="px-4 py-2">$${Math.round(item.costoTotal).toLocaleString('es-CO')}</td>
          <td class="px-4 py-2">${item.pesoFilamentoUtilizado}</td>
          <td class="px-4 py-2">${item.nombreCliente}</td>
          <td class="px-4 py-2">
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="eliminarDeStock('${item._id}')">Eliminar</button>
          </td>
        `;
        stockTable.appendChild(row);
      });
    } else {
      alert('Error al cargar las cotizaciones');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar las cotizaciones');
  }
}

async function eliminarDeStock(id) {
  try {
    const response = await fetch(`/api/cotizaciones/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Cotización eliminada exitosamente');
      updateStockTable();
      updateTotals();
    } else {
      alert('Error al eliminar la cotización');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar la cotización');
  }
}

async function updateTotals() {
  try {
    const response = await fetch('/api/cotizaciones');
    if (response.ok) {
      const stock = await response.json();
      let totalHoras = 0;
      let totalCosto = 0;
      let totalFilamento = 0;

      stock.forEach(item => {
        totalHoras += parseFloat(item.horas);
        totalCosto += Math.round(item.costoTotal);
        totalFilamento += parseFloat(item.pesoFilamentoUtilizado);
      });

      document.getElementById('totalHoras').innerText = `Total Horas: ${totalHoras.toFixed(2)} h`;
      document.getElementById('totalCosto').innerText = `Total Costo: $${totalCosto.toLocaleString('es-CO')}`;
      document.getElementById('totalFilamento').innerText = `Total Filamento: ${totalFilamento.toFixed(2)} g`;
    } else {
      alert('Error al actualizar los totales');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar los totales');
  }
}