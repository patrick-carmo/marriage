import { Request, Response } from 'express'
import { User } from '../interfaces/user'

const profile = async (req: Request, res: Response) => {
  const user = req.user as User
  const { name, picture } = user

  return res.status(200).json({ name, picture })
}

export { profile }
