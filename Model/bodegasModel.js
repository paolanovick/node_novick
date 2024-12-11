import mongoose from "mongoose";

const bodegaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Refers to the User model
    ref: "User", // Name of the model being referenced
    required: true,
  },
  vinos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vino" }],
  cantidad: { type: Number, required: true, default: 0 },
});

export default mongoose.model("Bodegas", bodegaSchema);
