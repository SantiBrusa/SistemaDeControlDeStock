import express from "express";
import Presupuesto from "../models/Presupuesto.js";
import Product from "../models/Product.js";
import { generarPDF } from "../utils/generarPDF.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// ----------------
// LISTA
// ----------------

router.get("/presupuestos", isAuth, async (req, res) => {
  const presupuestos = await Presupuesto.find().lean();

  res.render("presupuestos", {
    presupuestos,
  });
});

// ----------------
// NUEVO PRESUPUESTO
// ----------------

router.get("/presupuestos/nuevo", isAuth, async (req, res) => {
  const productos = await Product.find().lean();

  res.render("nuevoPresupuesto", {
    productos,
  });
});

// ----------------
// GUARDAR
// ----------------

router.post("/presupuestos/nuevo", isAuth, async (req, res) => {
  try {
    const { cliente, domicilio, productos } = req.body;

    // VALIDACIÓN CRÍTICA: Si no hay productos, frenamos antes del Object.values
    if (!productos) {
      // Puedes redirigir con un mensaje de error si quieres
      return res.status(400).send("No se seleccionaron productos.");
    }

    let total = 0;

    // Convertimos lo que venga en un array seguro
    const listaProductos = Object.values(productos);

    const productosFinal = listaProductos.map((p) => {
      // Aseguramos que los valores sean números para evitar NaN
      const precioUnitario = Number(p.precio) || 0;
      const cant = Number(p.cantidad) || 0;
      const subtotal = precioUnitario * cant;

      total += subtotal;

      return {
        nombre: p.nombre,
        cantidad: cant,
        precio: precioUnitario,
        subtotal: subtotal,
      };
    });

    await Presupuesto.create({
      cliente,
      domicilio,
      productos: productosFinal,
      total,
    });

    res.redirect("/presupuestos");
  } catch (error) {
    console.error("Error al guardar presupuesto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// ----------------
// VER
// ----------------

router.get("/presupuestos/ver/:id", isAuth, async (req, res) => {
  const presupuesto = await Presupuesto.findById(req.params.id).lean();

  presupuesto.fechaFormateada = new Date(presupuesto.fecha).toLocaleDateString(
    "es-AR",
  );

  res.render("verPresupuesto", {
    presupuesto,
  });
});

// ----------------
// PDF
// ----------------

router.get("/presupuestos/pdf/:id", isAuth, async (req, res) => {
  const presupuesto = await Presupuesto.findById(req.params.id).lean();

  generarPDF(presupuesto, res);
});

// ELIMINAR PRESUPUESTO
router.get("/presupuestos/eliminar/:id", isAuth, async (req, res) => {
  await Presupuesto.findByIdAndDelete(req.params.id);

  res.redirect("/presupuestos");
});
export default router;
