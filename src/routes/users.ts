import express from 'express'

import { getUser, getUsers } from '../controllers/users'
import { authenticate } from './../utils/index'

const usersRouter = express.Router()

usersRouter.get('/', authenticate, getUsers)
usersRouter.get('/:user_id', authenticate, getUser)

export default usersRouter
