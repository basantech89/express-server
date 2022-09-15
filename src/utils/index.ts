import { NextFunction, Request, Response } from 'express'
export const sessions = {}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies?.sessionId
  const userEmail = sessions[sessionId]
  if (userEmail) {
    return next()
  } else {
    return res.status(401).json({ success: false, message: 'User not authenticated.' })
  }
}
