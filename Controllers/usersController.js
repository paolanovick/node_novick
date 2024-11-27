import User from "../Model/usersModelMongo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET;

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Excluir contraseña por seguridad
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId, { password: 0 }); // Excluir contraseña por seguridad
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear el nuevo usuario con contraseña hasheada
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};


// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

   
//     if (!email || !password) {
//       return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
//     }

    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

  
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(401).json({ message: "Contraseña incorrecta" });
//     }

  
//     const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "1h" });

//     res.json({
//       token,
//       name: user.name,
//       email: user.email,
//     });

//     res.status(200).json({ message: "Inicio de sesión exitoso", token });
//   } catch (error) {
//     console.error("Error al iniciar sesión:", error);
//     res.status(500).json({ message: "Error al iniciar sesión" });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen los datos necesarios
    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "1h" });

    // Responder con el token y los datos del usuario
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};




// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Buscar el usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hashear nueva contraseña
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: "Usuario actualizado exitosamente", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Buscar y eliminar el usuario
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
