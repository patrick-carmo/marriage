import { Request } from 'express'
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
    return
  }
  cb(new Error('O arquivo enviado não é um vídeo. Por favor, envie um arquivo de vídeo.'))
}

const uploadVideo = multer({
  storage,
  fileFilter,
})

export { uploadVideo }
