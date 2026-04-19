import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../config.js';

// Middleware para buscar el toquen en todas las rutas
export const requireAuth = (req, res, next) => {
  // Busca una cookie llamada access_token /// ? -> Si req.cookies es undefined no da error, sigue el programa
  const token = req.cookies?.access_token

  // Si no hay token devuelve un error de 'No autenticado'
  if (!token) {
    return res.status(401).json({ message: 'No autenticado' })
  }

  // Si hay token y es valido lo decodifica y mete los datos del usuario en req.user
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)

    req.user = {
      id: data.id,
      email: data.email
    };

    // Sigue con el resto del archivo gracias a la funcion next()
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
