export const getActivityMessage = (action, details = {}) => {
  // Extraemos de forma segura los índices para los reordenamientos
  const oldPos = details.oldIndex !== undefined ? details.oldIndex + 1 : 0
  const newPos = details.newIndex !== undefined ? details.newIndex + 1 : 0

  const messages = {
    LIST_CREATE: `Creaste la lista "${details.name}".`,
    LIST_UPDATE_NAME: `Modificaste el nombre de la lista a "${details.name}".`,
    LIST_UPDATE_COLOR: `Modificaste el color de la lista a "${details.color}".`,
    LIST_ARCHIVE: `Archivaste la lista "${details.name}".`,
    LIST_RESTORE: `Restauraste la lista "${details.name}".`,
    LIST_DELETE: `Eliminaste la lista "${details.name}".`,
    LIST_REORDER: `Reordenaste las listas. "${details.draggedName}" pasó de la posición ${oldPos} a la ${newPos}.`,

    TASK_CREATE: `Añadiste la tarea "${details.taskName}" en "${details.listName}".`,
    TASK_UPDATE: `Modificaste la tarea "${details.taskName}".`,
    TASK_DELETE: `Eliminaste la tarea "${details.taskName}".`,
    TASK_TOGGLE: `Marcaste la tarea "${details.taskName}" como ${details.status}.`,
    TASK_REORDER: `Reordenaste las tareas en "${details.listName}". "${details.draggedName}" pasó de la posición ${oldPos} a la ${newPos}.`
  }

  return messages[action] || 'Actividad realizada.'
}
