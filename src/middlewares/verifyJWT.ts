import { NextFunction } from 'express'
import type { Request, Response } from 'express'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const splitPem = process.env.CLERK_JWT_VERIFICATION_KEY.match(/.{1,64}/g)
  console.log(process.env.CLERK_JWT_VERIFICATION_KEY)
  const publicKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    splitPem.join('\n') +
    '\n-----END PUBLIC KEY-----'

  const cookies = new Cookies(req, res)

  const sessToken = cookies.get('__session')
  if (!sessToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' })
  }

  try {
    jwt.verify(sessToken, publicKey)

    next()
  } catch (error) {
    res.status(401).json({
      error: 'Invalid Token',
    })
  }
}

export default verifyJWT
