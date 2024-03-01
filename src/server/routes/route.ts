import { Router } from 'express'
import path from 'path'
import { multerVideo } from '../utils/multer'
import { uploadVideo } from '../controllers/upload'
import validateRequest from '../middlewares/validateRequest'
import videoSchema from '../schemas/videoSchema'

const route: Router = Router()

route.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'))
})

route.get('/teste', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '../../client/pages/teste.html'))
})

route.post('/upload', multerVideo, validateRequest(videoSchema), uploadVideo)

export default route
