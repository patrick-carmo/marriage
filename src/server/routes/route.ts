import { Router } from 'express'
import { Response } from 'express'

import path from 'path'
import { multerVideo } from '../middlewares/multer'
import requestLimiter from '../middlewares/rateLimiter'
import { uploadVideo, deleteVideo, getProgress, postProgress } from '../controllers/driveOperation'
import validateRequest from '../middlewares/validateRequest'
import { videoSchema, paramsSchema } from '../schemas/videoSchema'

const route: Router = Router()

route.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'))
})

route.post('/progress', postProgress)
route.get('/progress', getProgress)

route.post('/upload', multerVideo('data'), validateRequest(videoSchema), uploadVideo)
route.delete('/delete/:id', validateRequest(paramsSchema), deleteVideo)

export default route
