document.addEventListener("DOMContentLoaded", () => {
  const bellBtn = document.getElementById("notificationBell");
  const menu = document.getElementById("notificationMenu");

  if (!bellBtn || !menu) return;

  bellBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isVisible = menu.style.display === "block";
    menu.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== bellBtn) {
      menu.style.display = "none";
    }
  });
});
