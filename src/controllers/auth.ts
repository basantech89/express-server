import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import dbClient from '../utils/db'
import { sessions } from './../utils/index'

const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body
  try {
    if (!first_name || !email || !password) {
      return res.status(406).json({ success: false, error: 'Pl send user information' })
    }

    const { rows } = await dbClient.query(`SELECT * FROM users WHERE email = $1;`, [email])
    if (rows.length > 0) {
      return res.status(409).json({ success: false, error: `User ${email} already exists.` })
    } else {
      bcrypt
        .hash(password, 10)
        .then(async hashedPassword => {
          dbClient
            .query(
              `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);`,
              [first_name, last_name, email, hashedPassword]
            )
            .then(() =>
              res.status(201).json({ success: true, message: 'User successfully signed up.' })
            )
            .catch(() => {
              res.status(500).json({
                success: false,
                error: 'User could not be added to the database.'
              })
            })
        })
        .catch(() =>
          res.status(500).json({
            success: false,
            error: 'User could not be added to the database.'
          })
        )
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(406).json({ success: false, error: 'Credentials are not supplied.' })
    }

    const { rows } = await dbClient.query(`SELECT * FROM users WHERE email = $1;`, [email])
    if (rows.length === 0) {
      res.status(406).json({ success: false, error: 'Incorrect credentials supplied.' })
    } else {
      const user = rows[0]
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: '1h'
        })

        const sessionId = randomBytes(16).toString('base64')
        sessions[sessionId] = email

        return res
          .cookie('sessionId', sessionId)
          .status(200)
          .json({
            success: true,
            message: 'User signed in successfully.',
            data: {
              id: user.user_id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              token: token
            }
          })
      } else {
        res.status(406).json({
          success: false,
          error: 'Incorrect credentials supplied.'
        })
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error.' })
  }
}

const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies?.sessionId

  if (sessionId) {
    delete sessions[sessionId]
    res.clearCookie('sessionId')
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized access.' })
  }
}

export { login, logout, register }
