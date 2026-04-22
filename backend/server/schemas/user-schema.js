import { z } from 'zod'

export const userSchema = z.object({
  // Validación del nombre
  name: z.string({
    invalid_type_error: 'El nombre tiene que ser una cadena de texto',
    required_error: 'El nombre es obligatorio'
  })
    .trim() // Elimina espacios en blanco
    .min(2, 'El nombre es demasiado corto')
    .max(50, 'El nombre es demasiado largo'),
  email: z.string({
    required_error: 'El email es obligatorio'
  })
    .trim()
    .email('El formato del email no es válido') // Valida en formato email
    .toLowerCase(), // Evita duplicados por mayúsculas
  password: z.string({
    required_error: 'La contraseña es obligatoria'
  })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga') // Protección básica contra DoS
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'La contraseña debe contener al menos un carácter especial (@, $, !, %, etc.)')
    .trim(),
  confirmPassword: z.string({
    required_error: 'Debes confirmar la contraseña'
  })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

export function validateLogin (object) {
  const loginSchema = userSchema.pick({ // pick() te permite coger campos de un esquema ya existente y los añade a otro distinto
    email: true,
    password: true
  })
  return loginSchema.safeParse(object)
}
