//import Bodegas from "../Model/bodegasModel.js";
import mongoose from "mongoose";

import { bodegasValidacion } from "../validation/bodegasValidations.js";
//import Vino from "../Model/vinosModel.js"; // Asegúrate de que este import sea necesario

import Bodegas from "../Model/bodegasModel.js";
import Vino from "../Model/vinosModel.js";

// Crear una nueva bodega
export const crearBodega = async (req, res) => {
  try {
    const nuevaBodega = new Bodegas({
      nombre: req.body.nombre,
      userId: req.user.id,
      vinos: req.body.vinos,
      cantidad: req.body.cantidad,
    });

    const bodegaGuardada = await nuevaBodega.save();
    res.status(201).json(bodegaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la bodega" });
  }
};

export const obtenerBodegas = async (req, res) => {
  try {
    // Obtener los parámetros de consulta de la URL
    const { tipoVino, nombreBodega } = req.query;

    // Crear una consulta dinámica basada en los filtros proporcionados
    let query = {};

    // Filtrar por el nombre de la bodega (Bianchi, Norton, Rutini, etc.)
    if (nombreBodega) {
      query.nombre = new RegExp(nombreBodega, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    }

    // Filtrar por el tipo de vino (tinto, blanco, rosado)
    if (tipoVino) {
      query["vinos.tipo"] = new RegExp(tipoVino, "i"); // 'vinos.tipo' es el campo donde guardas el tipo de vino
    }

    // Buscar las bodegas en la base de datos que coincidan con los filtros
    const bodegas = await Bodegas.find(query).populate("vinos");

    // Devolver las bodegas en formato JSON
    res.json(bodegas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener bodegas" });
  }
};

// Obtener una bodega por ID
export const obtenerBodegaPorId = async (req, res) => {
  try {
    const bodega = await Bodegas.findById(req.params.id);
    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }
    res.json(bodega);
  } catch (err) {
    console.error(err); // Añadido para depuración
    res.status(500).json({ error: "Error al obtener la bodega" }); // Cambié a 500
  }
};

export const obtenerBodegaPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    // Busca por el nombre de la bodega
    const bodega = await Bodegas.findOne({ nombre: nombre }).populate("vinos");

    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }

    res.json(bodega);
  } catch (err) {
    console.error("Error al obtener la bodega:", err);
    res.status(500).json({ error: "Error al obtener la bodega" });
  }
};

// Actualizar una bodega por ID
export const actualizarBodega = async (req, res) => {
  try {
    const bodega = await Bodegas.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }

    res.json(bodega);
  } catch (err) {
    console.error("Error al actualizar la bodega:", err); // Depuración
    res.status(500).json({ error: "Error al actualizar la bodega" });
  }
};

// Eliminar una bodega por ID
export const eliminarBodega = async (req, res) => {
  try {
    const bodega = await Bodegas.findByIdAndDelete(req.params.id);
    if (!bodega) {
      return res.status(404).json({ error: "Bodega no encontrada" });
    }
    res.json({ message: "Bodega eliminada correctamente" });
  } catch (err) {
    console.error(err); // Añadido para depuración
    res.status(500).json({ error: "Error al eliminar la bodega" }); // Cambié a 500
  }
};

// Ruta para agregar un vino a la bodega
// export const agregarVinoABodega = async (req, res) => {
//   try {
//     const { vinoId } = req.body;
//     const bodegaId = req.params.id;

//     // Actualiza la bodega para agregar el vino
//     await Bodegas.findByIdAndUpdate(bodegaId, { $push: { vinos: vinoId } });
//     res.status(200).json({ mensaje: "Vino agregado a la bodega exitosamente" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

/*

export const agregarVinoABodega = async (req, res) => {
  const { id } = req.params; // ID de la bodega
  const { vinoId } = req.body; // ID del vino que quieres agregar

  try {
    // Verificar si la bodega existe
    const bodega = await Bodega.findById(id);
    if (!bodega) {
      return res.status(404).json({ message: 'Bodega no encontrada' });
    }

    // Verificar si el vino existe
    const vino = await Vino.findById(vinoId);
    if (!vino) {
      return res.status(404).json({ message: 'Vino no encontrado' });
    }

    // Agregar el ID del vino a la lista de vinos de la bodega
    if (!bodega.vinos.includes(vinoId)) {
      bodega.vinos.push(vinoId);
      await bodega.save();
    }

    res.status(200).json({
      message: 'Vino agregado a la bodega exitosamente',
      bodega,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el vino a la bodega', error });
  }
};


*/

export const agregarVinoABodega = async (req, res) => {
  const { id } = req.params; // ID de la bodega
  const { vinoId } = req.body; // ID del vino

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(vinoId)
  ) {
    return res
      .status(400)
      .json({ message: "El ID de la bodega o del vino no es válido" });
  }

  try {
    const bodega = await Bodegas.findById(id);
    if (!bodega) {
      return res.status(404).json({ message: "Bodega no encontrada" });
    }

    // Inicializar vinos si no está definido
    if (!Array.isArray(bodega.vinos)) {
      bodega.vinos = [];
    }

    const vino = await Vino.findById(vinoId);
    if (!vino) {
      return res.status(404).json({ message: "Vino no encontrado" });
    }

    if (!bodega.vinos.includes(vinoId)) {
      bodega.vinos.push(vinoId);
      await bodega.save();
    } else {
      return res
        .status(400)
        .json({ message: "El vino ya está asociado a esta bodega" });
    }

    res.status(200).json({
      message: "Vino agregado a la bodega exitosamente",
      bodega,
    });
  } catch (error) {
    console.error("Error al agregar el vino a la bodega:", error);
    res.status(500).json({
      message: "Error al agregar el vino a la bodega",
      error: error.message,
    });
  }
};

// Ruta para eliminar un vino de la bodega
export const eliminarVinoDeBodega = async (req, res) => {
  try {
    const { vinoId } = req.body;
    const bodegaId = req.params.id;

    // Actualiza la bodega para eliminar el vino
    await Bodegas.findByIdAndUpdate(bodegaId, { $pull: { vinos: vinoId } });
    res
      .status(200)
      .json({ mensaje: "Vino eliminado de la bodega exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerBodegasConPaginado = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res
        .status(400)
        .json({ error: "Page y limit deben ser números válidos" });
    }

    // Obtener bodegas con paginación
    const bodegas = await Bodegas.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .populate({
        path: "vinos",
        select: "nombre tipo", // Seleccionar solo los campos necesarios
      });

    const totalBodegas = await Bodegas.countDocuments();

    res.status(200).json({
      bodegas,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBodegas / limitNumber),
      totalBodegas,
    });
  } catch (error) {
    console.error("Error al obtener bodegas con paginado:", error);
    res.status(500).json({ error: "Error al obtener las bodegas" });
  }
};

export const listarTodasLasBodegas = async (req, res) => {
  try {
    const bodegas = await Bodegas.find(); // Obtener todas las bodegas sin paginado
    res.status(200).json(bodegas);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener bodegas" });
  }
};
