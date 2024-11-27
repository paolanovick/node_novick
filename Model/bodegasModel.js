import mongoose from "mongoose";

const bodegaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, 
  vinos: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Vino" } 
  ],
  cantidad: { type: Number, required: true, default: 0 }, 
});

export default mongoose.model("Bodegas", bodegaSchema);
