import { Request, Response, NextFunction } from 'express'
import limiter from '../utils/limiterConfig'

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  limiter(req, res, (error: any) => {
    if (error) {
      return res.status(429).json({ message: error.message })
    }
    next()
  })
}

export default rateLimiter