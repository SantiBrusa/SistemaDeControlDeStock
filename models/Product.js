import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  precio: Number,
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
