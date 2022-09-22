import { NextFunction, Request, Response } from 'express'
export const sessions = {}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log('req session', req.session.user, req.cookies.user_id)

  const user = req.session.user
  if (user) {
    return next()
  } else {
    return res.status(401).json({ success: false, message: 'User not authenticated.' })
  }
}
