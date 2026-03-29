import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: String,
  marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  precio: Number,
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
