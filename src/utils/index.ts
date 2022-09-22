import { NextFunction, Request, Response } from 'express'

import { errors } from './../constants/errors'
export const sessions = {}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log('req session', req.session.user, req.cookies.user_id)

  const user = req.session.user
  if (user && req.cookies.user_id) {
    return next()
  } else {
    return res.status(401).json({ success: false, message: errors.UNAUTHORIZED_ACCESS })
  }
}
