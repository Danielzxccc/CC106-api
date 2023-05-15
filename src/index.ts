import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import KnexSessionStore from 'connect-session-knex'
// import MemoryStore from 'memorystore'
dotenv.config()

import { paymentRouter } from './payment/payment.router'
import { reservationRouter } from './reservation/reservation.router'
import { authRouter } from './auth/auth.router'
import { corsOptions } from '../config/cors'
import { client } from '../config/db'
const PORT: number = 8080

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

interface Store extends session.Store {
  // add any additional properties or methods you need here
}

const store: Store = new (KnexSessionStore(session))({
  knex: client,
  tablename: 'sessions', // optional, defaults to 'sessions'
})

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
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
