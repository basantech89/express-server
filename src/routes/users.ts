import express from 'express'

import { getUser, getUsers } from '../controllers/users'

const usersRouter = express.Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:user_id', getUser)

export default usersRouter
