import { Router } from 'express'
import { Response } from 'express'

import path from 'path'
import { multerVideo } from '../middlewares/multer'
import limiterRate from '../middlewares/rateLimiter'
import { uploadVideo } from '../controllers/upload'
import validateRequest from '../middlewares/validateRequest'
import videoSchema from '../schemas/videoSchema'

const route: Router = Router()

route.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'))
})

route.post('/upload', limiterRate, multerVideo('data'), validateRequest(videoSchema), uploadVideo)

export default route
