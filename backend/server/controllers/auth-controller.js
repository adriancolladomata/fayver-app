import bcrypt from 'bcrypt'
import { UserModel } from '../models/user-model.js'
import { validateUser, validatePartialUser, validateLogin } from '../schemas/user-schema.js'
import { SALT_ROUNDS, SECRET_JWT_KEY, NODE_ENV } from '../../config.js'
import jwt from 'jsonwebtoken'

// Método para el registro del usuario
export const register = async (req, res) => {
  const validation = validateUser(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    //Istanciación de los campos mediante validation.data (schema zod)
    const { name, email, password, confirmPassword } = validation.data

    // Validación de que ambas contraseñas son iguales
    Validation.matchPasswords(password, confirmPassword)

    // Filtro para saber si el usuario está registrado o no
    const newUser = await UserModel.findByEmail(email)

    if (newUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado '})
    }

    // Hasheo de la contraseña para mayor seguridad
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    await UserModel.createUser(name, email, passwordHash)

    return res.status(201).json({ message: 'Usuario registrado correctamente'})
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Método para el inicio de sesión del usuario
export const login = async (req, res) => {
  const validation = validateLogin(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    const { email, password } = validation.data

    // Filtro para saber si el usuario está registrado o no
    const user = await UserModel.findByEmail(email)

    if (!user) {
      return res.status(400).json({ message: 'El usuario no está registrado'})
    }

    // bcrypt.compare() para saber si la contraseña introducida coincide con la de la base de datos (hasehadas)
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(400).json({ message: 'La contraseña es incorrecta'})
    }

    // Instanciación del JSON Web Token, que contiene el id y el email, el secreto del jwt y que expira cada hora
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      SECRET_JWT_KEY,
      {
        expiresIn: '8h'
      }
    )

    // Se limpia la contraseña para no enviarla al cliente
    const { password_hash: _, ...publicUser} = user

    // Enviaos el usuario junto con su token en la respuesta JSON
    return res.json({
      user: publicUser,
      token: token
    })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await UserModel.getUserById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }
}


export const logout = async (req, res) => {
  try {
    // Ahora el logout en backend solo avisa que todo fue bien, el frontend limpiará el LocalStorage
    return res.status(200).json({ message: 'Logout correcto' })
  } catch (error) {
    return res.status(500).json({ message: 'Error al hacer logout' })
  }
}

class Validation {
  static matchPasswords (password, confirmPassword) {
    if (password !== confirmPassword) throw new Error('Las contraseñas no coinciden')
  }
}
