let productosAñadidos = [];

window.agregarProducto = function (nombre, precio, stock, index, marcaId, marcaNombre) {
  const cantidadInput = document.getElementById("cantidad-" + index);
  const cantidad = parseInt(cantidadInput.value);

  if (!cantidad || cantidad <= 0) return;

  if (stock <= 0) {
    alert(`No se puede añadir "${nombre}": No hay stock disponible.`);
    return;
  }

  if (cantidad > stock) {
    alert(`Solo hay ${stock} unidades disponibles de este producto.`);
    return;
  }

  const productoExistente = productosAñadidos.find(
    (p) => p.nombre === nombre && p.marcaId === marcaId
  );

  if (productoExistente) {
    if (productoExistente.cantidad + cantidad > stock) {
      alert("La suma total en el presupuesto supera el stock disponible");
      return;
    }
    productoExistente.cantidad += cantidad;
  } else {
    productosAñadidos.push({
      nombre,
      precio,
      cantidad,
      stock,
      marcaId,
      marcaNombre,
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