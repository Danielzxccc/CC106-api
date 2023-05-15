import { client } from '../../config/db'

export type User = {
  id: number
  username: string
  password?: string
  role: string
}

export async function findUser(username: string): Promise<User[]> {
  return client('users').where({ username })
}
