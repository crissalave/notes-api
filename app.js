const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const mongoose = require('mongoose')

logger.info(`connecting to ${config.MONGODB_URI}`)

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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
