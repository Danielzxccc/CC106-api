import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import { paymentRouter } from './payment/payment.router'
const PORT: number = 8080

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/payment', paymentRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
