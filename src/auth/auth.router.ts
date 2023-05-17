import express from 'express'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import { User, findUser } from './auth.service'
import { Session } from 'express-session'
export const authRouter = express.Router()

interface SessionData {
  users: User
}

export interface CustomRequest extends Request {
  session: Session & Partial<SessionData>
}

authRouter.post('/login', async (req: CustomRequest, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await findUser(username)
    if (!user.length)
      return res.status(400).json({
        message: 'Invalid Credentials',
      })

    const compare = await bcrypt.compare(password, user[0].password)

    if (!compare)
      return res.status(401).json({
        error: true,
        message: 'Unauthorized Access!',
      })

    req.session.users = user[0]
    res.status(200).json({
      message: 'Success',
      user: req.session.users,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})

authRouter.get('/refresh', async (req: CustomRequest, res: Response) => {
  if (req.session.users) {
    res.json({ token: true, user: req.session.users })
  } else {
    res.json({ token: false })
  }
})

authRouter.delete('/logout', async (req: CustomRequest, res: Response) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: 'unable to logout' })
      } else {
        res.status(200).json({ message: 'logout successfully' })
      }
    })
  }
})
