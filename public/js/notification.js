document.addEventListener("DOMContentLoaded", () => {
  const bellBtn = document.getElementById("notificationBell");
  const menu = document.getElementById("notificationMenu");

  // Si no existen en esta página, salimos sin tirar error
  if (!bellBtn || !menu) return;

  bellBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita que el '#' te scrollee la página arriba
    e.stopPropagation();

    const isVisible = menu.style.display === "block";
    menu.style.display = isVisible ? "none" : "block";
  });

  // Cerrar el menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== bellBtn) {
      menu.style.display = "none";
    }
  });
});
