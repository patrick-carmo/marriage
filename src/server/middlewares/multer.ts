import { Request, Response, NextFunction } from 'express'
import { uploadVideo } from '../utils/multer/multerConfig'

const multerVideo = (field: string) => (req: Request, res: Response, next: NextFunction) => {
  uploadVideo.single(field)(req, res, (error: any) => {
    if (error) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Apenas um arquivo é permitido' })
      }
      return res.status(400).json({ message: error.message })
    }
    next()
  })
}

export { multerVideo }
