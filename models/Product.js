import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  precio: Number,
  stock: Number,
});

export default mongoose.model("Product", productSchema);
