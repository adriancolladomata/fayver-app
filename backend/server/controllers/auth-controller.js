import bcrypt from 'bcrypt'
import { UserModel } from '../models/user-model.js'
import { SALT_ROUNDS, SECRET_JWT_KEY } from '../../config.js'
import jwt from 'jsonwebtoken'

// Método para el registro del usuario
export const register = async (req, res) => {
  const { name, email, password, confirmPassword} = req.body

  // Validaciones de los parámetros
  Validation.name(name)
  Validation.email(email)
  Validation.password(password)
  Validation.password(confirmPassword)
  Validation.matchPasswords(password, confirmPassword)

  try {
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
  const { email, password } = req.body

  // Validaciones de los parámetros
  Validation.email(email)
  Validation.password(password)

  try {
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
        expiresIn: '1h'
      }
    )

    const options = {
      httpOnly: true, // La cookie solo es accesible en el servidor
      secure: process.env.NODE_ENV === 'production', // La cookie solo es accesible en https
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Lax permit navegacion normal, formularios y evita problemas con localhost
      maxAge: 1000 * 60 * 60 // La cookie tiene un tiempo de validez de 1 hora
    }

    // Envia una cookie al navegador del usuario
    res.cookie('access_token', token, options)

    // Desestructuración con rest operator. _ extrae la propiedad password y la guarda en una variable _ (La saca pero no la usa)
    // ...publicUser almacena el resto de datos de user. mostraria:
    // Función: Mostrar todo el usuario menos la contraseña
    const { password_hash: _, ...publicUser} = user
    return res.json(publicUser) // publicUser = {id: ---, name: ---, email: ---}

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const logout = async (req, res) => {
  const options = {
    httpOnly: true, // La cookie solo es accesible en el servidor
    secure: process.env.NODE_ENV === 'production', // La cookie solo es accesible en https
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Lax permit navegacion normal, formularios y evita problemas con localhost
    maxAge: 1000 * 60 * 60 // La cookie tiene un tiempo de validez de 1 hora
  }

  try {
    res.clearCookie('access_token', options)

    return res.status(200).json({ message: 'Logout correcto '})
  } catch (error) {
    return res.status(500).json({ message: 'Error al hacer logout'})
  }
}

class Validation {
  static name (name) {
    if (typeof name !== 'string') throw new Error ('El nombre tiene que ser una cadena de texto')
    if (name.length < 3) throw new Error ('El nombre tiene que tener un mínimo de 3 carácteres')
  }

  static email (email) {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (typeof email !== 'string') throw new Error('El email debe ser una cadena de texto')
    if (!email.match(emailFormat)) throw new Error('El email introducido no es válido')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('La contraseña debe de ser una cadena de texto')
    if (password.length < 8) throw new Error('La contraseña tiene que tener al menos 8 caractéres')
  }

  static matchPasswords (password, confirmPassword) {
    if (password !== confirmPassword) throw new Error('Las contraseñas no coinciden')
  }
}
