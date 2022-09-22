import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, NextFunction, Response } from 'express'
import session from 'express-session'
import createError from 'http-errors'
import logger from 'morgan'
import path from 'path'
import fileStore from 'session-file-store'

import indexRouter, { authRouter, usersRouter } from './routes'

const app: Express = express()

const FileStore = fileStore(session)

app.use(logger('dev'))
app.use(express.json())
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    name: 'user_id',
    secret: process.env.COOKIE_SECRET || '08ab59f0-1822-42c2-8a66-0fdd09673211',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: {
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
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

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
