import PDFDocument from "pdfkit";

export const generarPDF = (presupuesto, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=presupuesto.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text("Presupuesto");

  doc.moveDown();

  doc.text(`Cliente: ${presupuesto.cliente}`);
  doc.text(`Telefono: ${presupuesto.telefono}`);
  doc.text(`Fecha: ${presupuesto.fecha}`);

  doc.moveDown();

  presupuesto.productos.forEach((p) => {
    doc.text(`${p.nombre} - ${p.cantidad} x ${p.precio} = ${p.subtotal}`);
  });

  doc.moveDown();

  doc.fontSize(16).text(`Total: $${presupuesto.total}`);

  doc.end();
};
