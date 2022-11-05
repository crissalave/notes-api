const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate({
      path: 'user',
      select: ['username', 'name']
    })

  res.json(notes).end()
})

notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  // similar to the find method
  const note = await Note.findById(id)
  if (!note) return res.status(404).end()

  res.json(note).end()
})

const getTokenFrom = (req) => {
  const authScheme = 'bearer '
  const auth = req.get('authorization')

  if (auth && auth.toLowerCase().startsWith(authScheme)) {
    return auth.substring(authScheme.length)
  }

  return null
}

notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body

  if (content === undefined) {
    return res.status(400).json({
      error: 'Content missing'
    })
  }

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
    user: user._id
  })

  const noteSaved = await note.save()
  user.notes = [...user.notes, noteSaved._id]
  await user.save()

  res.status(201).json(noteSaved).end()
})

notesRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { content, important } = req.body

  // findByIdAndUpdate method receives a regular JavaScript object as its parameter
  const newNote = {
    content,
    important
  }

  const options = {
    returnDocument: 'after',
    new: true
  }

  // by default this method return the object before the update
  // (optionally) change that with returnDocument: 'after'
  const noteUpdated = await Note.findByIdAndUpdate(id, newNote, options)
  res.status(202).json(noteUpdated)
})

notesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  // the method's name is explicid
  await Note.findByIdAndRemove(id)
  res.status(204).end()
})

module.exports = notesRouter
