import express from 'express'

import authRouter from './auth'
import usersRouter from './users'

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

export default router

export { authRouter, usersRouter }
