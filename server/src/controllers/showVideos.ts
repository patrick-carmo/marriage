import { Request, Response } from 'express'
import knex from '../config/database'

const showVideos = async (req: Request, res: Response) => {
  const data = await knex('images')
    .select('images.url', 'users.name', 'users.picture')
    .leftJoin('users', 'images.user_id', 'users.id')

  return res.status(200).json(data)
}

export { showVideos }
