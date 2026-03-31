import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// LOGIN
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// VALIDAR LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.render("login", {
      layout: "login",
      error: "Usuario no encontrado",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render("login", {
      layout: "login",
      error: "Contraseña incorrecta",
    });
  }

  req.session.user = user.username;

  res.redirect("/productos");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

export default router;
