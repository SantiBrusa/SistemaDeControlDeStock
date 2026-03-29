import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
});

export default mongoose.model("Brand", brandSchema);
