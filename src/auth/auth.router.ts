import express from 'express'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import { User, findUser } from './auth.service'
import { Session } from 'express-session'
export const authRouter = express.Router()

interface SessionData {
  user: User
}

interface CustomRequest extends Request {
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

    req.session.user = user[0]
    res.status(200).json({
      message: 'Success',
      user: req.session.user,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})

authRouter.get('/refresh', async (req: CustomRequest, res: Response) => {
  if (req.session.user) {
    res.json({ token: true, user: req.session.user })
  } else {
    res.json({ token: false })
  }
})
