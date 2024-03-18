import { Request, Response } from 'express'
import knex from '../../config/database'
import client from '../../config/redis'

import { createFolder, uploadFile, deleteFile } from '../services/drive'

import { User } from '../interfaces/user'
import { ImageFolder } from '../interfaces/image'

const uploadVideo = async (req: Request, res: Response) => {
  const file = req.file!
  const { uuid } = req.body
  const { id, name } = req.user as User

  try {
    const userFolder: ImageFolder = await knex('image_folder').where({ user_id: id }).first()

    const folderId: string = userFolder ? userFolder.id : await createFolder(name)

    const data = await uploadFile(file, uuid, folderId)

    if (!userFolder) {
      await knex('image_folder').insert({ id: folderId, user_id: id })
    }

    await knex('images').insert({ id: data.id, url: data.url, user_id: id, folder_id: folderId })

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  } finally {
    client.del(`progress_id=${uuid}`)
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
