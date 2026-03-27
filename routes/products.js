import express from "express";
import Product from "../models/Product.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// VER PRODUCTOS
router.get("/productos", isAuth, async (req, res) => {
  const search = req.query.search || "";

  const productos = await Product.find({
    $or: [
      { nombre: { $regex: search, $options: "i" } },
      { marca: { $regex: search, $options: "i" } },
    ],
  })
    .sort({ nombre: 1 })
    .lean();

  res.render("productos", {
    productos,
    search,
    user: req.session.user,
  });
});

// NUEVO
router.get("/productos/nuevo", isAuth, (req, res) => {
  res.render("nuevoProducto");
});

router.post("/productos/nuevo", isAuth, async (req, res) => {
  const { nombre, marca, precio, stock } = req.body;

  await Product.create({
    nombre,
    marca,
    precio,
    stock,
  });

  res.redirect("/productos");
});

// EDITAR
router.get("/productos/editar/:id", isAuth, async (req, res) => {
  const producto = await Product.findById(req.params.id).lean();

  res.render("editarProducto", {
    producto,
  });
});

router.post("/productos/editar/:id", isAuth, async (req, res) => {
  const { nombre, marca, precio, stock } = req.body;

  await Product.findByIdAndUpdate(req.params.id, {
    nombre,
    marca,
    precio,
    stock,
  });

  res.redirect("/productos");
});

// ELIMINAR
router.get("/productos/eliminar/:id", isAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.redirect("/productos");
});

export default router;
