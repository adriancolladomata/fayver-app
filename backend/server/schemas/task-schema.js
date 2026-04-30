import { z } from 'zod'

const taskSchema = z.object({
  // Validación del nombre
  name: z.string({
    invalid_type_error: 'El nombre tiene que ser una cadena de texto',
    required_error: 'El nombre es obligatorio'
  })
    .trim()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'EL nombre debe tener menos de 100 caractéres'),

  // Validación del contenido de la tarea
  content: z.string({
    invalid_type_error: 'El contenido debe ser una cadena de texto'
  })
    .nullable().optional(),

  // Validación del color y asignación de un color por defecto en caso de que no se asigne ninguno
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, {
    message: 'Debe ser un código de color hexadecimal válido (ej: #ffffff)'
  })
    .default('#ffffff'),

  // Validación de las etiqueta que se le puede asignar a la tarea
  label: z.string().max(50, 'La etiqueta no puede superar los 50 caracteres')
    .nullable()
    .optional(),

  // Validación de los estados que se le pueden asignar a la tarea, asignado 'Por hacer' por defecto
  status: z.enum(['Por hacer', 'En curso', 'Hecho'])
    .default('Por hacer'),

  // validación para que is_archived solo pueda ser si o no (0 = false, 1 = true).. Por defecto no está archivado
  is_archived: z.number()
    .int()
    .min(0)
    .max(1)
    .default(0),

  // Validación del orden de la tarea
  order: z.number()
    .int()
    .min(0, 'El orden no puede ser negativo')
    .optional()
})

// Esquema para el reordenamiento (Drag & Drop). Sigue el mismo patrón que el list-schema
const reorderTasksSchema = z.array(
  z.object({
    id: z.string().uuid('ID de tarea inválido'),
    order: z.number().int().min(0, 'El orden no puede ser negativo')
  })
).min(1, 'La lista de tareas no puede estar vacía')

export function validateTask (object) {
  return taskSchema.safeParse(object)
}

export function validatePartialTask (object) {
  return taskSchema.partial().safeParse(object)
}

export function validateReorderTasks (object) {
  return reorderTasksSchema.safeParse(object)
}
