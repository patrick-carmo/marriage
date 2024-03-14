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

    await redisClient.del('progress')

    return res.status(200).json(data)
  } catch (error: any) {
    await redisClient.del('progress')
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

const postProgress = async (req: Request, res: Response) => {
  const { progress } = req.body as { progress: number }

  try {
    await redisClient.set(`progress`, progress)
    res.status(204).send()
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const getProgress = async (_: Request, res: Response) => {
  try {
    const progressRedis = await redisClient.get(`progress`)

    if (progressRedis === null) {
      return res.status(200).json({ progress: 0 })
    }

    res.status(200).json({ progress: Number(progressRedis) })
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export default deleteVideo

export { uploadVideo, deleteVideo, postProgress, getProgress }
