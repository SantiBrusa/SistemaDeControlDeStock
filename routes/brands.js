import express from "express";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// Ver y gestionar marcas
router.get("/marcas", isAuth, async (req, res) => {
  const marcas = await Brand.find().sort({ nombre: 1 }).lean();
  res.render("marcas", { marcas });
});

// Crear marca
router.post("/marcas", isAuth, async (req, res) => {
  const { nombre } = req.body;
  try {
    await Brand.create({ nombre: nombre.toUpperCase() });
    res.redirect("/marcas");
  } catch (err) {
    res.render("marcas", { error_msg: "La marca ya existe" });
  }
});

// Eliminar marca
router.get("/marcas/eliminar/:id", isAuth, async (req, res) => {
  const tieneProductos = await Product.findOne({ marca: req.params.id });

  if (tieneProductos) {
    return res.redirect("/marcas");
  }

  await Brand.findByIdAndDelete(req.params.id);
  res.redirect("/marcas");
});

export default router;
