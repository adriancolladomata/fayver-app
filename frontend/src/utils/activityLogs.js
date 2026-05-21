export const getActivityMessage = (action, details = {}) => {
  const messages = {
    LIST_CREATE: `Creaste la lista "${details.name}".`,
    LIST_UPDATE_NAME: `Modificaste el nombre de la lista a "${details.name}".`,
    LIST_UPDATE_COLOR: `Modificaste el color de la lista a "${details.color}".`,
    LIST_ARCHIVE: `Archivaste la lista "${details.name}".`,
    LIST_RESTORE: `Restauraste la lista "${details.name}".`,
    LIST_DELETE: `Eliminaste la lista "${details.name}".`,
    LIST_REORDER: 'Reordenaste las listas en el tablero.',
    TASK_CREATE: `Añadiste la tarea "${details.taskName}" en "${details.listName}".`,
    TASK_UPDATE: `Modificaste la tarea "${details.taskName}".`,
    TASK_DELETE: `Eliminaste la tarea "${details.taskName}".`,
    TASK_TOGGLE: `Marcaste la tarea "${details.taskName}" como ${details.status}.`
  }
  return messages[action] || 'Actividad realizada'
}
