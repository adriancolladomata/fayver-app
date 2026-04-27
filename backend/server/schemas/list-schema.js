import { z } from 'zod'

const listSchema = z.object({
  name: z.string({
    invalid_type_error: 'El nombre tiene que ser una cadena de texto',
    required_error: 'El nombre es obligatorio'
  })
    .trim()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'EL nombre debe tener menos de 100 caractéres'),

  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, {
    message: 'Debe ser un código de color hexadecimal válido (ej: #ffae00)'
  }).default('#ffffff'),

  // Validamos isShowed como un número que solo puede ser 0 o 1 (TINYINT)
  is_showed: z.number().int().min(0).max(1).default(1),

  // Validamos order como un entero que empieza en 0
  order: z.number().int().min(0, 'El orden no puede ser negativo').optional()
})

const reorderSchema = z.array(
  z.object({
    id: z.string().uuid('ID de lista inválido'),
    order: z.number().int().min(0, 'El orden no puede ser negativo')
  })
).min(1, 'La lista no puede estar vacía')

export function validateReorder (object) {
  return reorderSchema.safeParse(object)
}

export function validateList (object) {
  return listSchema.safeParse(object)
}

export function validatePartialList (object) {
  return listSchema.partial().safeParse(object)
}
