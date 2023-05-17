import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()

import { paymentRouter } from './payment/payment.router'
import { reservationRouter } from './reservation/reservation.router'
import { authRouter } from './auth/auth.router'
import { corsOptions } from '../config/cors'
import verifyJWT from './middlewares/verifyJWT'
const PORT: number = 8080

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use('/api/payment', verifyJWT, paymentRouter)
app.use('/api/reservation', verifyJWT, reservationRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
