import { z } from 'zod'

const commentSchema = z.object({
  // Validación del contenido del comentario
  content: z.string({
    invalid_type_error: 'El comentario debe ser una cadena de texto',
    required_error: 'El comentario no puede estar vacío'
  })
    .trim()
    .min(1, 'El comentario debe tener al menos 1 carácter')
    .max(2000, 'El comentario no puede superar los 2000 caracteres')
})

export function validateComment (object) {
  return commentSchema.safeParse(object)
}

export function validatePartialComment (object) {
  return commentSchema.partial().safeParse(object)
}
