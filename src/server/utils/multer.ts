import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import os from 'os'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir())
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true)
  } else {
    cb(new Error('O arquivo enviado não é um vídeo. Por favor, envie um arquivo de vídeo.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
})

const multerVideo = (req: Request, res: Response, next: NextFunction) => {
  upload.single('data')(req, res, (error: any) => {
    if (error) {
      return res.status(500).json({ message: error.message })
    }
    next()
  })
}

export { multerVideo }
