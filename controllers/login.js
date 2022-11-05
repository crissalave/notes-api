const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.get('/', (req, res) => {
  res.send('Login API')
})

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!(username && password)) {
    return res.status(401).json({
      error: 'password and username are required!'
    })
  }

  const user = await User.findOne({ username })
  console.log(user)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // check is the user exist and the password is correct
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  // is possible to limit the validity of the token {expriresIn: time}
  const token = await jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter
