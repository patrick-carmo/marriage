import { Request, Response } from 'express'
import { uploadFile, deleteFile } from '../services/drive'
import client from '../../config/redis'

const uploadVideo = async (req: Request, res: Response) => {
  const file = req.file!
  const { uuid } = req.body

  try {
    const data = await uploadFile(file, uuid)

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  } finally {
    await client.del(`progress_id=${uuid}`)
  }
}

const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await deleteFile(id)

    return res.status(204).send()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

const postProgress = async (req: Request, res: Response) => {
  const { progress, uuid } = req.body

  try {
    await client.set(`progress_id=${uuid}`, progress, { EX: 60 })

    res.status(204).send()
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const getProgress = async (req: Request, res: Response) => {
  const { uuid } = req.params
  try {
    const progressRedis = await client.get(`progress_id=${uuid}`)

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
