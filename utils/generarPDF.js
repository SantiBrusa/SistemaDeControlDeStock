import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generarPDF = (presupuesto, res) => {
  // Definimos márgenes para controlar mejor el espacio
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Presupuesto-${presupuesto.cliente}.pdf`);

  doc.pipe(res);

  // --- CABECERA ---
  try {
    doc.image(path.join(__dirname, "../public/img/motosprint.jpeg"), 50, 40, { width: 80 });
  } catch (e) {
    doc.fontSize(20).text("MOTO SPRINT", 50, 40);
  }

  // Info del Local (Limpiamos los emojis para evitar caracteres extraños)
  doc.fillColor("#333").fontSize(9);
  doc.text("AV. RIZZUTO 626 - RIO SECO - C.P.: 5248", 50, 115);
  doc.text("TEL: 351 6230854", 50, 128);

  // Titulo Presupuesto
  doc.fillColor("#000").fontSize(22).text("Presupuesto", 350, 40, { align: "right" });
  doc.fontSize(10).text("Documento no válido como factura", 350, 65, { align: "right" });
  doc.fontSize(11).text(`Fecha: ${new Date(presupuesto.fecha).toLocaleDateString("es-AR")}`, 350, 85, { align: "right" });

  doc.moveTo(40, 150).lineTo(550, 150).stroke("#e5e5e5");

  // --- DATOS DEL CLIENTE ---
  doc.moveDown(2);
  doc.fillColor("#000").fontSize(12).text(`Cliente: ${presupuesto.cliente.toUpperCase()}`, 50, 170);
  doc.text(`Domicilio: ${presupuesto.domicilio || "---"}`, 50, 185);

  // --- TABLA DE PRODUCTOS ---
  const tableTop = 220;
  const col1 = 50;  const col2 = 230; const col3 = 330; const col4 = 390; const col5 = 480;

  doc.rect(40, tableTop - 5, 520, 20).fill("#111111");
  doc.fillColor("#ffffff").fontSize(10);
  doc.text("Producto", col1, tableTop);
  doc.text("Marca", col2, tableTop);
  doc.text("Cant.", col3, tableTop);
  doc.text("Precio U.", col4, tableTop);
  doc.text("Subtotal", col5, tableTop);

  let position = tableTop + 25;
  doc.fillColor("#000");

  presupuesto.productos.forEach((p) => {
    doc.text(p.nombre.toUpperCase(), col1, position, { width: 170 });
    doc.text(p.marca ? p.marca.nombre : "---", col2, position);
    doc.text(p.cantidad.toString(), col3, position);
    doc.text(`$${p.precio}`, col4, position);
    doc.text(`$${p.subtotal}`, col5, position);

    position += 25;
    doc.moveTo(40, position - 5).lineTo(560, position - 5).strokeColor("#eeeeee").stroke();
  });

  // --- SECCIÓN FINAL (FORZADA AL PIE DE PÁGINA) ---
  // Usamos coordenadas fijas cerca del final del A4 (aprox 842px de alto)
  const footerStart = 680; 

  // Línea de cierre antes del total
  doc.moveTo(40, footerStart - 10).lineTo(560, footerStart - 10).strokeColor("#000").stroke();

  // Total
  doc.fontSize(14).fillColor("#000").text(`Total: $${presupuesto.total}`, 400, footerStart, { align: "right", width: 150 });

  // Recuadro de Advertencia (Importante)
  const boxTop = footerStart + 30;
  doc.rect(50, boxTop, 500, 45).stroke("#666666");
  
  doc.fontSize(8).fillColor("#444");
  const advertencia = "IMPORTANTE! LOS PRODUCTOS ELECTRICOS (Tales como REGULADORES, CDI, BATERIAS, LAMPARAS, BUJIAS, TABLEROS) NO TIENEN CAMBIO, NI GARANTIA Y TAMPOCO ADMITEN DEVOLUCION. Gracias por comprender.";
  
  doc.text(advertencia, 60, boxTop + 10, {
    width: 480,
    align: "justify",
    lineGap: 2
  });

  doc.end();
};