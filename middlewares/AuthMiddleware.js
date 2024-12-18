import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET;

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No se proporcionó token" });

  jwt.verify(token, secretKey, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    const email = payload.email;

    req.user = { id: payload.id, email: payload.email };
    next();
  });
};
