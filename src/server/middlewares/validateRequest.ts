import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

const validateRequest = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync({ body: req.file })
    next()
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

export default validateRequest
