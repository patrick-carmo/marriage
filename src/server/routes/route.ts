import { Router, request } from 'express'
import { Response } from 'express'

import path from 'path'
import { multerVideo } from '../middlewares/multer'
import requestLimiter from '../middlewares/rateLimiter'
import { uploadVideo, deleteVideo, progressPost, progressGet } from '../controllers/driveOperation'
import validateRequest from '../middlewares/validateRequest'
import { videoSchema, paramsSchema } from '../schemas/videoSchema'

const route: Router = Router()

route.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'))
})

route.post('/progress', progressPost)
route.get('/progress', progressGet)

route.post('/upload', requestLimiter, multerVideo('data'), validateRequest(videoSchema), uploadVideo)

route.delete('/delete/:id', requestLimiter, validateRequest(paramsSchema), deleteVideo)

export default route
