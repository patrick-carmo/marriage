import { Request, Response, NextFunction } from 'express'

const loginVerify = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }

  req.session.touch()
  return next()
}

export default loginVerify
