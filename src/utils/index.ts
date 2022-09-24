import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { errors } from './../constants/errors'
export const sessions = {}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function (err) {
      if (err) {
        return res.status(403).json({ success: false, message: errors.INVALID_TOKEN })
      }

      next()
    })
  } else {
    return res.status(401).json({ success: false, message: errors.UNAUTHORIZED_ACCESS })
  }
}
