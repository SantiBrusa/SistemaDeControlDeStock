import express from "express";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js"; // Importamos el nuevo modelo
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// --- VER PRODUCTOS ---
router.get("/productos", isAuth, async (req, res) => {
  const search = req.query.search || "";

  try {
    let productos = await Product.find()
      .populate("marca")
      .sort({ nombre: 1 }) 
      .lean();

    if (search) {
      const termino = search.toUpperCase(); 
      productos = productos.filter((p) => {
        const coincideNombre = p.nombre.includes(termino);
        const coincideMarca = p.marca && p.marca.nombre.toUpperCase().includes(termino);
        return coincideNombre || coincideMarca;
      });
    }

    res.render("productos", {
      productos,
      search,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// --- NUEVO PRODUCTO ---
router.get("/productos/nuevo", isAuth, async (req, res) => {
  const marcas = await Brand.find().sort({ nombre: 1 }).lean();
  res.render("nuevoProducto", { marcas });
});

router.post("/productos/nuevo", isAuth, async (req, res) => {
  const { nombre, marca, precio, stock } = req.body;

  try {
    const nombreNormalizado = nombre.trim().toUpperCase();

    const productoExistente = await Product.findOne({
      nombre: { $regex: new RegExp(`^${nombreNormalizado}$`, "i") },
      marca: marca,
    });

    if (productoExistente) {
      const marcas = await Brand.find().sort({ nombre: 1 }).lean();
      return res.render("nuevoProducto", {
        error_msg: `El producto "${nombreNormalizado}" ya existe para esta marca.`,
        marcas,
        datos: req.body,
      });
    }

    await Product.create({
      nombre: nombreNormalizado, 
      marca,
      precio: Number(precio) || 0,
      stock: Number(stock) || 0,
    });

    res.redirect("/productos?success=true");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar el producto.");
  }
});

// --- EDITAR PRODUCTO ---
router.get("/productos/editar/:id", isAuth, async (req, res) => {
  const producto = await Product.findById(req.params.id).lean();
  const marcas = await Brand.find().sort({ nombre: 1 }).lean();

  res.render("editarProducto", {
    producto,
    marcas,
  });
});

router.post("/productos/editar/:id", isAuth, async (req, res) => {
  const { nombre, marca, precio, stock } = req.body;

  try {
    await Product.findByIdAndUpdate(req.params.id, {
      nombre: nombre.trim().toUpperCase(), 
      marca,
      precio,
      stock,
    });

    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al editar el producto.");
  }
});

// --- ELIMINAR PRODUCTO ---
router.get("/productos/eliminar/:id", isAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/productos");
});

export default router;
