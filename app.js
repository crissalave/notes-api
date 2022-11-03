const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// Routers
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

logger.info(`Connecting to ${config.MONGODB_URI}`)

mongoose
  .connect(config.MONGODB_URI)
  .then(res => {
    logger.info('Connected to MongoDB')
  })
  .catch(err => {
    logger.error('error connecting MongoDB:', err.message)
  })

app.use(express.static('build'))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
