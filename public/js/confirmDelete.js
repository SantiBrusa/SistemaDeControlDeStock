document.addEventListener("click", (e) => {
  // Verificamos si el clic fue en un botón de eliminar
  if (e.target.classList.contains("btnDelete")) {
    const respuesta = confirm("¿Estás seguro de eliminar este producto?");

    if (!respuesta) {
      e.preventDefault(); // Si dice que NO, cancelamos el envío del form
    }
  }
});
