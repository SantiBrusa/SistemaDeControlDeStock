let productosAñadidos = [];

window.agregarProducto = function (nombre, precio, stock, index, marcaId, marcaNombre) {
  const cantidadInput = document.getElementById("cantidad-" + index);
  const cantidad = parseInt(cantidadInput.value);

  if (!cantidad || cantidad <= 0) return;

  // --- LÓGICA DEL AVISO TEMPORAL ---
  if (stock <= 0 || cantidad > stock) {
    const divAviso = document.getElementById("aviso-stock");
    
    // 1. Lo mostramos agregando la clase de CSS
    divAviso.classList.add("aviso-visible");
    divAviso.style.display = "block"; // Aseguramos que no esté en none

    // 2. Lo ocultamos automáticamente después de 3 segundos (3000ms)
    setTimeout(() => {
        divAviso.classList.remove("aviso-visible");
    }, 3000);
  }

  // Lógica de siempre para añadir al array...
  const productoExistente = productosAñadidos.find(
    (p) => p.nombre === nombre && p.marcaId === marcaId
  );

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    productosAñadidos.push({
      nombre, precio, cantidad, stock, marcaId, marcaNombre,
    });
  }

  renderTabla();
};

function renderTabla() {
  const tabla = document.getElementById("tablaAñadidos");
  if (!tabla) return;
  
  tabla.innerHTML = "";
  let total = 0;

  productosAñadidos.forEach((p, i) => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    tabla.innerHTML += `
    <tr>
        <td>
            ${p.nombre}
            <input type="hidden" name="productos[${i}][nombre]" value="${p.nombre}">
            <input type="hidden" name="productos[${i}][precio]" value="${p.precio}">
            <input type="hidden" name="productos[${i}][cantidad]" value="${p.cantidad}">
            <input type="hidden" name="productos[${i}][marca]" value="${p.marcaId}">
        </td>
        <td>${p.marcaNombre}</td>
        <td>$${p.precio}</td>
        <td>${p.cantidad}</td>
        <td>$${subtotal}</td>
        <td class="btnsElim">
            <button type="button" class="btn-res" onclick="restarUno(${i})">-1</button>
            <button type="button" class="btn-del" onclick="eliminarProducto(${i})">X</button>
        </td>
    </tr>`;
  });

  document.getElementById("total").innerText = total;
}

window.restarUno = function (index) {
  if (productosAñadidos[index].cantidad > 1) {
    productosAñadidos[index].cantidad -= 1;
  } else {
    productosAñadidos.splice(index, 1);
  }
  renderTabla();
};

window.eliminarProducto = function (index) {
  productosAñadidos.splice(index, 1);
  renderTabla();
};

document.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.getElementById("inputBusquedaPres");
  
  if (!inputBusqueda) return; 

  inputBusqueda.addEventListener("keyup", function () {
    const valorBusqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll(".avaibleProductsContainer .tableAvaible tbody tr");

    filas.forEach((fila) => {
      const nombreProducto = fila.querySelector("td:first-child").textContent.toLowerCase();
      const marcaProducto = fila.querySelector("td:nth-child(2)").textContent.toLowerCase();

      if (nombreProducto.includes(valorBusqueda) || marcaProducto.includes(valorBusqueda)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });
});