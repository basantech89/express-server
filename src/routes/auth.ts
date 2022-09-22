import express from 'express'

import { login, logout, register } from '../controllers/auth'
import { authenticate } from './../utils/index'

const authRouter = express.Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.delete('/logout', authenticate, logout)

export default authRouter
