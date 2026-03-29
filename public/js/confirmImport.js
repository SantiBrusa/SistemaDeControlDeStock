document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("tableConfirm");

  const tableBody = table.querySelector("tbody");
  if (!tableBody) return;

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-remove-row");

    if (btn) {
      const row = btn.closest("tr");
      if (confirm("¿Quieres quitar este producto de la lista?")) {
        row.remove();
        checkEmptyTable(tableBody);
      }
    }
  });
});

function checkEmptyTable(body) {
  if (body.querySelectorAll("tr").length === 0) {
    body.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #888;">
                    No hay productos para confirmar. 
                    <br><a href="/importar" style="color: #3498db;">Volver a intentar</a>
                </td>
            </tr>
        `;
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
  }
}
