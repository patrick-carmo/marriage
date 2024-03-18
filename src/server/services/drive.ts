import fs from 'fs'
import { google } from 'googleapis'
import { Images } from '../interfaces/image'

const authorization = async () => {
  try {
    const jwt = new google.auth.JWT(process.env.DRIVE_EMAIL, undefined, process.env.DRIVE_KEY, process.env.DRIVE_SCOPE)
    await jwt.authorize()

    return jwt
  } catch (error: any) {
    throw error
  }
}

const createFolder = async (name: string) => {
  const service = google.drive({ version: 'v3', auth: await authorization() })

  const fileMetaData = {
    name,
    parents: [process.env.DRIVE_FOLDER as string],
    mimeType: process.env.DRIVE_MIMETYPE,
  }

  try {
    const file = await service.files.create({
      requestBody: fileMetaData,
      fields: 'id',
    })

    if (!file.data.id) {
      throw new Error('Error creating folder')
    }

    return file.data.id
  } catch (error: any) {
    throw error
  }
}

const uploadFile = async (
  fileData: Express.Multer.File,
  uuid: string,
  folder_id: string
): Promise<Pick<Images, 'id' | 'url'>> => {
  try {
    const { path, mimetype: mimeType, originalname: name } = fileData

    const service = google.drive({ version: 'v3', auth: await authorization() })

    const requestBody = {
      name,
      parents: [folder_id],
    }

    const media = {
      mimeType,
      body: fs.createReadStream(path),
    }

    let lastProgress: number = 0

    const file = await service.files.create(
      {
        requestBody,
        media,
        fields: 'id',
      },
      {
        onUploadProgress: event => {
          const progress = Math.round((event.bytesRead / fileData.size) * 100)
          const absoluteUrl = process.env.PROGRESS_URL as string

          if (progress >= lastProgress + 2) {
            lastProgress = progress

            fetch(absoluteUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ progress, uuid }),
            })
          }
        },
      }
    )

    const { id } = file.data

    if (!id) {
      throw new Error('Error uploading file')
    }

    const image = {
      id,
      url: `https://drive.google.com/file/d/${id}/preview`,
    }

    return image
  } catch (error: any) {
    throw error
  }
}

const deleteFile = async (fileId: string) => {
  try {
    const drive = google.drive({ version: 'v3', auth: await authorization() })

    await drive.files.delete({
      fileId,
    })

  } catch (error: any) {
    throw error
  }
}

const deleteAllFiles = async () => {
  try {
    const drive = google.drive({ version: 'v3', auth: await authorization() })

    const response = await drive.files.list({
      q: `'${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id, name, webViewLink)',
    })
    const files = response.data.files

    if (!files || files.length === 0) {
      return console.log('Nenhum arquivo encontrado.')
    }
    console.log(files)

    for (const file of files) {
      await drive.files.delete({
        fileId: file.id as string,
      })
      console.log(`Arquivo "${file.name}" excluído.`)
    }

    console.log('Todas os arquivos foram excluídos.')
  } catch (error: any) {
    console.error(error.message)
  }
}

// deleteAllFiles()

export { uploadFile, deleteFile, createFolder }
