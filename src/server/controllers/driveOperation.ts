import { Request, Response } from 'express'
import { uploadFile, deleteFile } from '../services/drive'
import * as redis from 'redis'

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})

redisClient.connect()

const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file!
    const data = await uploadFile(file)

    return res.json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteFile(id)

    return res.status(204).send()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

const progressPost = async (req: Request, res: Response) => {
  const { progress } = req.body as { progress: number }

  try {
    await redisClient.set('progress', progress)
    res.status(200).send()
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const progressGet = async (_: Request, res: Response) => {
  try {
    const progressRedis = await redisClient.get('progress')
    const progress = Number(progressRedis)
    
    if (progress >= 99) {
      await redisClient.del('progress')
      return res.status(200).json({ progress: 100 })
    }

    res.status(200).json({ progress })
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export default deleteVideo

export { uploadVideo, deleteVideo, progressPost, progressGet }
