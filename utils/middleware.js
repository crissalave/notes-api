const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('------------------')
  next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown enpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).send({
      error: 'token expired'
    })
  }

  logger.error(error.message)

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
