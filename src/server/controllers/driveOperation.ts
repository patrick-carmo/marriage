import { Request, Response } from 'express'
import { uploadFile, deleteFile } from '../services/drive'
import client from '../../config/redis'

declare module 'express-session' {
  interface SessionData {
    passport?: any
  }
}

const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file!

    const data = await uploadFile(file)

    client.del(`progress_id=${req.session.passport.user.google_id}`)

    return res.status(200).json(data)
  } catch (error: any) {
    client.del(`progress_id=${req.session.passport.user.google_id}`)
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
    const id = req.session.passport.user.google_id

    await client.set(`progress_id=${id}`, progress, { EX: 60 })

    res.status(204).send()
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const getProgress = async (req: Request, res: Response) => {
  try {
    const id = req.session.passport.user.google_id

    const progressRedis = await client.get(`progress_id=${id}`)

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
