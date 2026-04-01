import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isAuth } from "../middleware/auth.js";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/importar", isAuth, (req, res) => {
  res.render("importarProductos");
});

router.post(
  "/importar/procesar",
  isAuth,
  upload.single("listaImagen"),
  async (req, res) => {
    if (!req.file) return res.status(400).send("No se subió ninguna imagen.");
    const pathImagen = req.file.path;

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const imageParts = [
        {
          inlineData: {
            data: fs.readFileSync(pathImagen).toString("base64"),
            mimeType: req.file.mimetype,
          },
        },
      ];

      const prompt =
        "Analiza esta imagen y extrae los productos en un array JSON con campos: nombre, precio y stock. Si no hay nada, devuelve [].";

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const textoJson = response.text();

      const jsonLimpio = textoJson
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      let productosExtraidos = JSON.parse(jsonLimpio);

      if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);

      const marcas = await Brand.find().sort({ nombre: 1 }).lean();

      res.render("confirmarImportacion", {
        productos: productosExtraidos,
        marcas: marcas,
      });
    } catch (error) {
      console.error("ERROR DETALLADO DE GOOGLE:", error);
      if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);

      res
        .status(500)
        .send(
          "Error de comunicación con la IA. Puede que hallas alcanzado el maximo de peticiones diario.",
        );
    }
  },
);

router.post("/importar/confirmar", isAuth, async (req, res) => {
  try {
    const { productos } = req.body;
    if (!productos) return res.redirect("/productos");

    const lista = Array.isArray(productos)
      ? productos
      : Object.values(productos);

    await Promise.all(
      lista.map(async (p) => {
        const nombre = p.nombre.trim();
        const marcaId = p.marca;
        const nuevoStock = Number(p.stock) || 0;
        const precio = Number(p.precio) || 0;

        return Product.findOneAndUpdate(
          {
            nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
            marca: marcaId,
          },
          {
            $inc: { stock: nuevoStock },
            $set: { precio: precio },
            $setOnInsert: { nombre: nombre },
          },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          },
        );
      }),
    );

    res.redirect("/productos?importado=success");
  } catch (error) {
    console.error("Error al procesar importación:", error);
    res.status(500).send("Error al actualizar la base de datos.");
  }
});

export default router;
