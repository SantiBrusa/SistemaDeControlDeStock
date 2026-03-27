let productosAñadidos = [];

window.agregarProducto = function (nombre, precio, stock, index) {
  const cantidadInput = document.getElementById("cantidad-" + index);
  const cantidad = parseInt(cantidadInput.value);

  if (!cantidad || cantidad <= 0) return;

  const productoExistente = productosAñadidos.find((p) => p.nombre === nombre);

  if (productoExistente) {
    if (productoExistente.cantidad + cantidad > stock) {
      alert("No hay suficiente stock disponible");
      return;
    }

    productoExistente.cantidad += cantidad;
  } else {
    if (cantidad > stock) {
      alert("No hay suficiente stock disponible");
      return;
    }

    productosAñadidos.push({
      nombre,
      precio,
      cantidad,
      stock,
    });
  }

  renderTabla();
};

function renderTabla() {
  const tabla = document.getElementById("tablaAñadidos");
  tabla.innerHTML = "";

  let total = 0;

  productosAñadidos.forEach((p, i) => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    tabla.innerHTML += `
    <tr>
        <td>
            ${p.nombre}
            <input type="hidden" name="productos[${i}].[nombre]" value="${p.nombre}">
            <input type="hidden" name="productos[${i}].[precio]" value="${p.precio}">
            <input type="hidden" name="productos[${i}].[cantidad]" value="${p.cantidad}">
        </td>
        <td>$${p.precio}</td>
        <td>${p.cantidad}</td>
        <td>$${p.precio * p.cantidad}</td>
        <td>
            <button type="button" onclick="restarUno(${i})">❌</button>
            <button type="button" onclick="eliminarProducto(${i})">🗑</button>
        </td>
    </tr>
`;
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

  inputBusqueda.addEventListener("keyup", function () {
    const valorBusqueda = this.value.toLowerCase();
    // Seleccionamos todas las filas de la tabla de "disponibles"
    const filas = document.querySelectorAll(
      ".avaibleProductsContainer .tableAvaible tbody tr",
    );

    filas.forEach((fila) => {
      // Obtenemos el texto de la primera celda (Nombre del producto)
      const nombreProducto = fila
        .querySelector("td:first-child")
        .textContent.toLowerCase();

      // Si el nombre coincide con la búsqueda, se muestra, si no, se oculta
      if (nombreProducto.includes(valorBusqueda)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });
});
