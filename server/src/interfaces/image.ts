interface ImageFolder {
  id: number
  folder_id: string
  user_id: number
  created_at: string
}

interface Images {
  id: number
  image_id: string
  url: string
  user_id: number
  folder_id: string
  created_at: string
}

interface ImagesData {
  image_id: string
  url: string
}

export { ImageFolder, Images, ImagesData }
