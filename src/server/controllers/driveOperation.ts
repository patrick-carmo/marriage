import { Request, Response } from 'express'
import knex from '../../config/database'
import client from '../../config/redis'
import env from '../../config/envConfig'

import { User } from '../interfaces/user'

import { uploadFile, deleteFile } from '../services/drive'
import { getOrCreateFolder, saveImageData } from '../utils/driveOperation/fileRecorder'

const uploadVideo = async (req: Request, res: Response) => {
  const file = req.file!
  const { uuid } = req.body
  const { id: user_id, name } = req.user as User

  try {
    const folder_id = await getOrCreateFolder(user_id, name)

    const data = await uploadFile(file, uuid, folder_id)

    await saveImageData(data, user_id, folder_id)

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  } finally {
    client.del(`${env.SERVER}-progress-${uuid}`)
  }
}

const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await deleteFile(id)
    await knex('images').where({ id }).del()

    return res.status(204).send()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

const postProgress = async (req: Request, res: Response) => {
  const { progress, uuid } = req.body

  try {
    await client.set(`${env.SERVER}-progress_id-${uuid}`, progress, { EX: 60 })

    res.status(204).send()
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getProgress = async (req: Request, res: Response) => {
  const { uuid } = req.params
  try {
    const progressRedis = await client.get(`${env.SERVER}-progress_id-${uuid}`)

    if (!progressRedis) {
      return res.status(200).json({ progress: 0 })
    }

    res.status(200).json({ progress: Number(progressRedis) })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default deleteVideo

export { uploadVideo, deleteVideo, postProgress, getProgress }
