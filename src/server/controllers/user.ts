import { Request, Response } from 'express'
import { User } from '../interfaces/user'

const profile = (req: Request, res: Response) => {
  const user = req.user as User
  
  return res.status(200).json(user)
}

export { profile }
