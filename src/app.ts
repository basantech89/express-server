import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, NextFunction, Response } from 'express'
import session from 'express-session'
import createError from 'http-errors'
import Redis from 'ioredis'
import logger from 'morgan'
import path from 'path'

import { errors } from './constants/errors'
import indexRouter, { authRouter, usersRouter } from './routes'

const app: Express = express()

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

const RedisStore = connectRedis(session)
const redisClient = new Redis({
  db: 0,
  port: 18427,
  host: 'redis-18427.c301.ap-south-1-1.ec2.cloud.redislabs.com',
  username: 'default',
  password: 'RPDOnFh9GPCW4A6glIZMW5EoK5xlMn5H'
})

app.use(
  session({
    name: 'user_id',
    secret: process.env.SESSION_SECRET || '3018bb28-5ea8-4485-9627-b21bd7b6cec3',
    saveUninitialized: false,
    resave: false,
    store: new RedisStore({ client: redisClient }),
    cookie: {
      sameSite: 'none',
      secure: true,
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
