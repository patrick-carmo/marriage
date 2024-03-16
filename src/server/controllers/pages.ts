import { Request, Response } from 'express'
import path from 'path'

const index = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'))
}

const login = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/pages/login.html'))
}

const logout = (req: Request, res: Response) => {
  req.logout(err => {
    if (err) {
      console.error(err)
    }
    return res.redirect('/login')
  })
}

export { index, login, logout }