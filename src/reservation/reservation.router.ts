import express from 'express'
import type { Request, Response } from 'express'
import { check, create } from './reservation.service'
import verifyJWT from '../middlewares/verifyJWT'

export const reservationRouter = express.Router()

reservationRouter.post('/reserve', async (req: Request, res: Response) => {
  try {
    const { dateofreservation, timerange, product_id } = req.body

    const createReservation = await create({
      dateofreservation,
      timerange,
      product_id,
    })

    res.status(201).json(createReservation)
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    })
  }
})

reservationRouter.get('/get/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { date } = req.query
    const getReservations = await check(id as string, date as string)
    res.status(200).json(getReservations)
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    })
  }
})
