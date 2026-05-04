import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { TaskModel } from '../models/task-model.js'
import { randomUUID } from 'node:crypto'
import { validateComment, validatePartialComment } from '../schemas/comment-schema.js'
import { CommentModal } from '../models/comment-model.js'

export const createComment = async (req, res) => {
  const { boardId, listId, taskId } = req.params
  const userId = req.user.id
  const validation = validateComment(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors })
  }

  try {
    const { content } = validation.data

    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, userId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    const commentId = randomUUID()
    await CommentModal.createComment(commentId, taskId, userId, content)

    return res.status(201).json({ message: 'Comentario creado con éxito' })

  } catch (error) {
    return res.status(500).json({ message: error.message})
  }
}

export const showComment = async (req, res) => {
  const { boardId, listId, taskId, commentId} = req.params
  const userId = req.user.id

  try {
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, userId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    Validation.noCommentId(commentId)
    const comment = await CommentModal.getComment(commentId, taskId)
    Validation.noComment(comment)
    Validation.isDeleted(comment)

    res.json(comment)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const showComments = async (req, res) => {
  const { boardId, listId, taskId } = req.params
  const userId = req.user.id

  try {
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, userId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    const tasks = await CommentModal.getComments(taskId)

    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const modifyComment = async (req, res) => {
  const { boardId, listId, taskId, commentId } = req.params
  const userId = req.user.id
  const validation = validatePartialComment(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors })
  }

  try {
    const { content } = validation.data

    // Si no hay content en el body validado, significa que no enviaron nada útil
    if (content === undefined) {
      return res.status(400).json({
        message: 'No se proporcionaron campos válidos para actualizar (ej: content)'
      })
    }

    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, userId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    Validation.noCommentId(commentId)
    const comment = await CommentModal.getComment(commentId, taskId)
    Validation.noComment(comment)
    Validation.isDeleted(comment)

    const updatedComment = await CommentModal.updateComment(commentId, taskId, content)

    if (updatedComment.affectedRows === 0) {
      res.status(400).json({ messgae: 'No se pudo actualizar el comentario. '})
    }

    const newComment = { ...comment, updatedContent: content}

    return res.status(200).json({ message: 'Comentario actualizado.', newComment })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deletComment = async (req, res) => {
  const { boardId, listId, taskId, commentId } = req.params
  const userId = req.user.id

  try {
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, userId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    Validation.noCommentId(commentId)
    const comment = await CommentModal.getComment(commentId, taskId)
    Validation.noComment(comment)
    Validation.isDeleted(comment)

    await CommentModal.deleteComment(commentId, taskId)

    return res.status(200).json({ message: 'Comentario eliminado.'})
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

class Validation {
  static isDeleted (element) {
    if (element.deleted_at !== null) throw new Error ('El elemento se encuentra eliminado desde: ' + element.deleted_at)
  }

  static noBoardId (boardId) {
    if (!boardId) throw new Error ('Se requiere el ID del tablón')
  }

  static noBoard (board) {
    if (!board) throw new Error ('Tablón no encontrado')
  }

  static noListId (listId) {
    if (!listId) throw new Error ('Se requiere el ID de la lista')
  }

  static noList (list) {
    if (!list) throw new Error ('Lista no encontrada')
  }

  static noTaskId (taskId) {
    if (!taskId) throw new Error ('Se requiere el ID de la tarea')
  }

  static noTask (task) {
    if (!task) throw new Error ('Tarea no encontrada')
  }

  static noCommentId (commentId) {
    if (!commentId) throw new Error ('Se requiere el ID del comentario')
  }

  static noComment (comment) {
    if (!comment) throw new Error ('Comentario no encontrado')
  }
}
