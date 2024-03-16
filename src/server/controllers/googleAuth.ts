import passport from '../services/googleAuth'
import { Request, Response } from 'express'

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

const callback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/auth/google/failure',
})

const failure = (req: Request, res: Response) => {
  return res.redirect('/login')
}

export { googleAuth, callback, failure }
