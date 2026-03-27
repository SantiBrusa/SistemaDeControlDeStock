import mongoose from "mongoose";

const productoPresupuestoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  cantidad: {
    type: Number,
    required: true,
  },

  precio: {
    type: Number,
    required: true,
  },

  subtotal: {
    type: Number,
    required: true,
  },
});

const presupuestoSchema = new mongoose.Schema({
  numero: {
    type: Number,
    default: 0,
  },

  cliente: {
    type: String,
    required: true,
  },

  domicilio: {
    type: String,
  },

  fecha: {
    type: Date,
    default: Date.now,
  },

  productos: [productoPresupuestoSchema],

  total: {
    type: Number,
    required: true,
  },

  observaciones: {
    type: String,
  },
});

export default mongoose.model("Presupuesto", presupuestoSchema);
