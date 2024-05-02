import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

const validateRequest = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = Object.keys(req.body).length
    const params = Object.keys(req.params).length
    const query = Object.keys(req.query).length
    if (req.method !== 'GET' && body === 0 && params === 0 && query === 0 && !req.file) {
      return res.status(400).json({ message: 'Enter the fields' })
    }

    if (req.file) {
      await schema.validateAsync({ body: req.file })
    }

    if (params) {
      await schema.validateAsync({ params: req.params })
    }

    next()
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

export default validateRequest
