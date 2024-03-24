import { Request, Response, NextFunction } from 'express'
import client from '../../config/redis'
import env from '../../config/envConfig'

const rateLimiter = async (req: Request, res: Response, next: Function) => {
  const ip = req.headers['x-forwarded-for'] ?? req.ip

  const key = `${env.SERVER}-rate-limit-${ip}`

  const current = Number((await client.get(key)) ?? 0) + 1

  await client.set(key, current, { EX: 60 * 15 })

  if (current > 5) {
    return res.status(429).json({ message: 'Many requests, please try again later.' })
  }

  return next()
}

export default rateLimiter