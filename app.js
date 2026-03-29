import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { engine } from "express-handlebars";
import session from "express-session";
import { create } from "express-handlebars";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import { checkLowStock } from "./middleware/stockMiddleware.js";

import "./database/mongo.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import presupuestosRoutes from "./routes/presupuestos.js";
import importarRoutes from "./routes/importar.js";
import brandRoutes from "./routes/brands.js";

const app = express();

// ----------------
// rutas absolutas
// ----------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiKey = process.env.GEMINI_API_KEY;

// ----------------
// body parser
// ----------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------
// archivos estaticos
// ----------------

app.use(express.static(path.join(__dirname, "public")));

// ----------------
// handlebars
// ----------------

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"), // Agregamos esto aquí
  helpers: {
    eq: (a, b) => {
      if (a && b) {
        return a.toString() === b.toString();
      }
      return false;
    },
  },
});

// USAMOS hbs.engine en lugar de engine()
app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ----------------
// session
// ----------------

app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  }),
);

// ----------------
// usuario global
// ----------------

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});
// ----------------
// ruta inicial
// ----------------

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/productos");
  }
  res.redirect("/login");
});

// ----------------
// rutas
// ----------------

app.use(checkLowStock);
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", presupuestosRoutes);
app.use("/", brandRoutes);
app.use(importarRoutes);

// ----------------
// server
// ----------------

app.listen(8080, () => {
  console.log("Servidor en http://localhost:8080");
});
