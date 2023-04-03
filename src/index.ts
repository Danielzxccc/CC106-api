import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import { playlistRouter } from './playlists/playlist.router'
const PORT: number = parseInt('8000' as string, 10)

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/playlist', playlistRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
