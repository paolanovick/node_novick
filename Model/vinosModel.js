import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true }, 
  bodega: { type: mongoose.Schema.Types.ObjectId, ref: "Bodegas" }, 
  precio: { type: Number, required: true, min: 0 }, 
  imageUrl: { type: String, required: false },
  descripcion: { type: String, required: false },
});

export default mongoose.model("Vino", vinoSchema);
