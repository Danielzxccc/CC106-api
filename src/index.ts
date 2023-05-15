import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
dotenv.config()

import { paymentRouter } from './payment/payment.router'
import { reservationRouter } from './reservation/reservation.router'
import { authRouter } from './auth/auth.router'
import { corsOptions } from '../config/cors'
const PORT: number = 8080

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.set('trust proxy', 1)

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

app.use('/api/payment', paymentRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
