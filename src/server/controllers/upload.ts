import { Request, Response } from 'express'
import { uploadFile } from '../services/drive'

const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file!
    const data = await uploadFile(file)

    return res.json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export { uploadVideo }
