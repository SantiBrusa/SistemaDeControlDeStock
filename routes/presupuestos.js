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
  const productos = await Product.find().populate("marca").lean();

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

    if (!productos) {
      return res.status(400).send("No se seleccionaron productos.");
    }

    let total = 0;

    const listaProductos = Object.values(productos);

    const productosFinal = listaProductos.map((p) => {
      const precioUnitario = Number(p.precio) || 0;
      const cant = Number(p.cantidad) || 0;
      const subtotal = precioUnitario * cant;

      total += subtotal;

      return {
        nombre: p.nombre,
        marca: p.marca,
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
  const presupuesto = await Presupuesto.findById(req.params.id)
    .populate("productos.marca")
    .lean();

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
  try {
    const presupuesto = await Presupuesto.findById(req.params.id)
      .populate("productos.marca") 
      .lean();

    if (!presupuesto) return res.redirect("/presupuestos");

    generarPDF(presupuesto, res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el PDF");
  }
});

router.get("/presupuestos/vender/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { forzar } = req.query; 

    const presupuesto = await Presupuesto.findById(id).populate("productos.marca").lean();
    if (!presupuesto) return res.status(404).send("Presupuesto no encontrado");

    let productosFaltantes = [];
    let actualizaciones = [];

    for (const item of presupuesto.productos) {
      const productoDB = await Product.findOne({ 
        nombre: item.nombre, 
        marca: item.marca._id
      });

      if (!productoDB) continue;

      if (productoDB.stock < item.cantidad && !forzar) {
        productosFaltantes.push({
          nombre: item.nombre,
          marcaNombre: item.marca.nombre,
          pedido: item.cantidad,
          disponible: productoDB.stock
        });
      }

      actualizaciones.push({
        id: productoDB._id,
        cantidadVenta: item.cantidad,
        stockActual: productoDB.stock
      });
    }

    if (productosFaltantes.length > 0) {
      return res.render("confirmarVenta", {
        id,
        productosFaltantes
      });
    }

    for (const act of actualizaciones) {
      let nuevoStock = Math.max(0, act.stockActual - act.cantidadVenta);
      await Product.findByIdAndUpdate(act.id, { stock: nuevoStock });
    }

    await Presupuesto.findByIdAndUpdate(id, { estado: 'Vendido' });

    res.redirect("/presupuestos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar la venta.");
  }
});

// ELIMINAR PRESUPUESTO
router.get("/presupuestos/eliminar/:id", isAuth, async (req, res) => {
  await Presupuesto.findByIdAndDelete(req.params.id);

  res.redirect("/presupuestos");
});
export default router;
