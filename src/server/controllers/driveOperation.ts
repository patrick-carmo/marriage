import { Request, Response } from 'express'
import { uploadFile, deleteFile } from '../services/drive'
import * as redis from 'redis'

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})

redisClient.connect()

redisClient.on('error', error => {
  console.error('Erro ao conectar ao servidor Redis', error)
})

redisClient.on('connect', () => {
  console.log('Conectado ao servidor Redis')
})

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
  const { progress } = req.body

  try {
    await redisClient.set('progress', progress.toString())
    res.status(200).send()
  } catch (error) {
    console.error('Erro ao definir o progresso do upload:', error)
    res.status(500).send()
  }
}

const progressGet = async (_: Request, res: Response) => {
  try {
    const progress = await redisClient.get('progress')
    res.status(200).json({ progress: parseInt(progress || '0') })
  } catch (error) {
    console.error('Erro ao obter o progresso do upload:', error)
    res.status(500).send()
  }
}

export default deleteVideo

export { uploadVideo, deleteVideo, progressPost, progressGet }
