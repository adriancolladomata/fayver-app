export const getActivityMessage = (action, details = {}) => {
  // Extraemos de forma segura los índices para los reordenamientos (sumamos 1 para el usuario)
  const oldPos = details.oldIndex !== undefined ? details.oldIndex + 1 : 0
  const newPos = details.newIndex !== undefined ? details.newIndex + 1 : 0

  // Fragmentos reutilizables de contexto espacial
  const boardCtx = details.boardName ? ` en "${details.boardName}"` : ''
  const listCtx = details.listName ? ` en la lista "${details.listName}"` : ''

  const messages = {
    // ACCIONES DE LISTAS
    LIST_CREATE: `Creaste la lista "${details.name}"${boardCtx}.`,
    LIST_UPDATE_NAME: `Modificaste el nombre de la lista a "${details.name}"${boardCtx}.`,
    LIST_UPDATE_COLOR: `Modificaste el color de la lista a "${details.color}"${boardCtx}.`,
    LIST_ARCHIVE: `Archivaste la lista "${details.name}"${boardCtx}.`,
    LIST_RESTORE: `Restauraste la lista "${details.name}"${boardCtx}.`,
    LIST_DELETE: `Eliminaste la lista "${details.name}"${boardCtx}.`,
    LIST_REORDER: `Reordenaste las listas. "${details.draggedName}" pasó de la posición ${oldPos} a la ${newPos}${boardCtx}.`,

    // ACCIONES DE TAREAS
    TASK_CREATE: `Añadiste la tarea "${details.taskName || details.name}"${listCtx}${boardCtx}.`,
    TASK_UPDATE: `Modificaste la tarea "${details.taskName || details.name}"${listCtx}${boardCtx}.`,
    TASK_DELETE: `Eliminaste la tarea "${details.taskName || details.name}"${listCtx}${boardCtx}.`,
    TASK_TOGGLE: `Marcaste la tarea "${details.taskName || details.name}" como ${details.status || 'actualizada'}${listCtx}${boardCtx}.`,
    TASK_REORDER: `Reordenaste las tareas en "${details.listName}". "${details.draggedName}" pasó de la posición ${oldPos} a la ${newPos}${boardCtx}.`
  }

  return messages[action] || 'Actividad realizada.'
}
