import cors from 'cors'
import express, { Express, NextFunction, Response } from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import path from 'path'

import { errors } from './constants/errors'
import indexRouter, { authRouter, usersRouter } from './routes'

const app: Express = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(logger('dev'))
app.use(express.json())
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res: Response, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log(err)
  res.status(err.status || 500).json({ success: false, error: errors.SERVER_ERROR })
})

export default app
