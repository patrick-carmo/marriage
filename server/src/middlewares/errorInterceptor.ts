import { Request, Response, NextFunction } from 'express'

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({ message: 'Internal server error'})
}
