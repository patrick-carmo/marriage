import { ImageFolder, ImagesData } from '../../interfaces/image'
import knex from '../../config/database'
import { createFolder, searchFolder } from '../../services/drive'

const getOrCreateFolder = async (user_id: number, name: string): Promise<string> => {
  const userFolder: ImageFolder = await knex('image_folder').where({ user_id }).first()

  const searchResult: string | null = userFolder ? await searchFolder(userFolder.folder_id) : null

  const folder_id = searchResult || (await createFolder(name))

  return folder_id
}

const saveImageData = async (data: ImagesData, user_id: number, folder_id: string) => {
  const image_folder = await saveImageFolder(user_id, folder_id)

  await knex('images').insert({ image_id: data.image_id, url: data.url, user_id, image_folder })
}

const saveImageFolder = async (user_id: number, folder_id: string): Promise<number> => {
  const existingFolder = await knex('image_folder').where({ user_id }).first()

  if (!existingFolder) {
    const newFolder = await knex<ImageFolder>('image_folder').insert({ folder_id, user_id }).returning('id')

    return newFolder[0].id
  }
  
  await knex('image_folder').where({ user_id }).update({ folder_id })

  return existingFolder.id
}

export { getOrCreateFolder, saveImageData }
