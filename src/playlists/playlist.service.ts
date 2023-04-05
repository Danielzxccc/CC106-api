import { client } from '../../config/db'

export type Playlist = {
  id: number
  title: string
  link: string
  sentby: string
  description: string
  likes: number
  dislike: number
  date_added: string
  imgsrc: string
  embedsrc: string
}

export const ListPlaylists = async (): Promise<Playlist[]> => {
  return client.queryBuilder().select('*').from('playlist')
}

export const CreatePlaylist = async (
  playlist: Omit<Playlist, 'id'>
): Promise<Playlist[]> => {
  return client.queryBuilder().insert(playlist).into('playlist').returning('*')
}
