import passport from '../services/googleAuth'
import { Request, Response } from 'express'

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

const callback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/api/auth/google/failure',
})

const failure = (req: Request, res: Response) => {
  return res.status(401).json({ message: 'Unauthorized' })
}

const logout = (req: Request, res: Response) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  })

  return res.status(204).send()
}

export { googleAuth, callback, failure, logout }
