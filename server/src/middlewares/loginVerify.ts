import { Request, Response, NextFunction } from 'express'

const loginVerify = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return next()
}

export default loginVerify
