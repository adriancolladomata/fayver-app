import { z } from 'zod'

const boardSchema = z.object({
  name: z.string({
    invalid_type_error: 'El nombre tiene que ser una cadena de texto',
    required_error: 'El nombre es obligatorio'
  })
    .trim()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'EL nombre debe tener menos de 100 caractéres')
})

export function validateBoard (object) {
  return boardSchema.safeParse(object)
}

export function validatePartialBoard (object) {
  return boardSchema.partial().safeParse(object)
}
