import express from 'express'
import type { Request, Response } from 'express'

import * as PlaylistService from './playlist.service'
export const playlistRouter = express.Router()

playlistRouter.get('/', async (req: Request, res: Response) => {
  try {
    const playlists = await PlaylistService.ListPlaylists()

    return res.status(200).json(playlists)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

playlistRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const playlist = req.body
    const create = await PlaylistService.CreatePlaylist(playlist)
    res.status(201).json(create)
  } catch (error: any) {
    if (error.detail) return res.status(500).json({ message: error.detail })
    return res.status(500).json({ message: error.message })
  }
})
