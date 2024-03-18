interface ImageFolder {
  id: string;
  user_id: number;
  created_at: string;
}

interface Images {
  id: string;
  url: string;
  user_id: number;
  folder_id: string;
  created_at: string;
}

export { ImageFolder, Images }