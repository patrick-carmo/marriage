import fs from 'fs'
import { google } from 'googleapis'
import { ImagesData } from '../interfaces/image'

const authorization = async () => {
  try {
    const jwt = new google.auth.JWT(process.env.DRIVE_EMAIL, undefined, process.env.DRIVE_KEY, process.env.DRIVE_SCOPE)
    await jwt.authorize()

    return jwt
  } catch (error: any) {
    throw error
  }
}

const searchFolder = async (folder: string): Promise<string | null> => {
  try {
    const service = google.drive({ version: 'v3', auth: await authorization() })

    const file = await service.files.get({
      fileId: folder,
      fields: 'id',
    })

    if (!file.data.id) {
      return null
    }

    return file.data.id
  } catch (error: any) {
    return null
  }
}

const createFolder = async (name: string): Promise<string> => {
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
): Promise<ImagesData> => {
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

    const { id: image_id } = file.data

    if (!image_id) {
      throw new Error('Error uploading file')
    }

    const image: ImagesData = {
      image_id,
      url: `https://drive.google.com/file/d/${image_id}/preview`,
    }

    return image
  } catch (error: any) {
    throw error
  }
}

const deleteFile = async (fileId: string) => {
  try {
    const service = google.drive({ version: 'v3', auth: await authorization() })

    await service.files.delete({
      fileId,
    })
  } catch (error: any) {
    throw error
  }
}

const deleteAllFiles = async () => {
  try {
    const service = google.drive({ version: 'v3', auth: await authorization() })

    const file = await service.files.list({
      q: `'${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id, name, webViewLink)',
    })
    const files = file.data.files

    if (!files || files.length === 0) {
      return console.log('No files found.')
    }
    console.log(files)

    for (const file of files) {
      await service.files.delete({
        fileId: file.id as string,
      })
      console.log(`File "${file.name}" deleted.`)
    }

    console.log('All files deleted')
  } catch (error: any) {
    console.error(error.message)
  }
}

// deleteAllFiles()

export { uploadFile, deleteFile, createFolder, searchFolder }
