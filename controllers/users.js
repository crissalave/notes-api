const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate({
      path: 'notes',
      select: ['content', 'date']
    })

  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (Object.keys(req.body).length !== 3) {
    return res.status(400).json({
      error: 'username, name and password are required!'
    })
  }

  if (username === '' || name === '' || password === '') {
    return res.status(400).json({
      error: 'username, name or password is missed'
    })
  }

  // Check if the username already exist
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username already exist'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
