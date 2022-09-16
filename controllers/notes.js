const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes).end()
})

notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  // similar to the find method
  const note = await Note.findById(id)
  if (note) return res.json(note).end()
  res.status(404).end()
})

notesRouter.post('/', async (req, res, next) => {
  const { content, important } = req.body

  if (content === undefined) {
    return res.status(400).json({
      error: 'Content missing'
    }).end()
  }

  const note = new Note({
    content,
    important: important || false,
    date: new Date()
  })

  const noteSaved = await note.save()
  res.status(201).json(noteSaved).end()
})

notesRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params
  const { content, important } = req.body

  // findByIdAndUpdate method receives a regular JavaScript object as its parameter
  const newNote = {
    content,
    important
  }

  // by default this method return the object before the update
  // (optionally) change that with returnDocument: 'after'
  const noteUpdated = await Note.findByIdAndUpdate(
    id, newNote, { returnDocument: 'after', new: true }
  )
  res.status(202).json(noteUpdated)
})

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  // the method name is explicid
  await Note.findByIdAndRemove(id)
  res.status(204).end()
})

module.exports = notesRouter