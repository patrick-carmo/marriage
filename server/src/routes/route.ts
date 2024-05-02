import { Router } from 'express'

import { multerVideo } from '../middlewares/multer'
// import rateLimiter from '../middlewares/rateLimiter'
import { videoSchema, paramsSchema } from '../schemas/videoSchema'

import { googleAuth, callback, failure } from '../controllers/googleAuth'
import { logout } from '../controllers/googleAuth'
import { profile } from '../controllers/profile'

import validateRequest from '../middlewares/validateRequest'
import loginVerify from '../middlewares/loginVerify'

import { uploadVideo, deleteVideo, getProgress, postProgress } from '../controllers/driveOperation'
import rateLimiter from '../middlewares/rateLimiter'
// import { showVideos } from '../controllers/showVideos'

const route: Router = Router()

route.get('/auth/google', googleAuth)
route.get('/auth/google/callback', callback)
route.get('/auth/google/failure', failure)

route.get('/logout', logout)

route.post('/progress', postProgress)
route.get('/progress/:uuid', getProgress)

route.use(loginVerify)

route.get('/profile', profile)

route.post('/upload', multerVideo('data'), validateRequest(videoSchema), uploadVideo)
route.delete('/delete/:id', validateRequest(paramsSchema), deleteVideo)

// route.get('/showVideos', showVideos)

export default route
