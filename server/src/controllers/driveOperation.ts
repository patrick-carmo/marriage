import { Request, Response } from 'express'
import knex from '../config/database'
import client from '../config/redis'

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
  } catch {
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    client.del(`progress-${uuid}`)
  }
}

const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params

  await deleteFile(id)
  await knex('images').where({ id }).del()

  return res.status(204).send()
}

const postProgress = async (req: Request, res: Response) => {
  const { progress, uuid } = req.body

  await client.set(`progress_id-${uuid}`, progress, { EX: 60 })

  res.status(204).send()
}

const getProgress = async (req: Request, res: Response) => {
  const { uuid } = req.params
  const progressRedis = await client.get(`progress_id-${uuid}`)

  if (!progressRedis) {
    return res.status(200).json({ progress: 0 })
  }

  res.status(200).json({ progress: Number(progressRedis) })
}

export default deleteVideo

export { uploadVideo, deleteVideo, postProgress, getProgress }
