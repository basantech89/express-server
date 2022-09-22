import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, NextFunction, Response } from 'express'
import session from 'express-session'
import createError from 'http-errors'
import logger from 'morgan'
import path from 'path'
import fileStore from 'session-file-store'

import { errors } from './constants/errors'
import indexRouter, { authRouter, usersRouter } from './routes'

const app: Express = express()

const FileStore = fileStore(session)

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

const oneHour = 60 * 60 * 1000

app.use(logger('dev'))
app.use(express.json())
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    name: 'user_id',
    secret: process.env.SESSION_SECRET || '3018bb28-5ea8-4485-9627-b21bd7b6cec3',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: {
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      signed: true,
      maxAge: oneHour
    }
  })
)

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

  res.status(err.status || 500).json({ success: false, error: errors.SERVER_ERROR })
})

export default app
