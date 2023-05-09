import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})
import express from 'express'
import type { Request, Response } from 'express'
import { create, get } from '../reservation/reservation.service'
import { sendInvoice } from '../helpers/email'
export const paymentRouter = express.Router()

paymentRouter.post(
  '/create-checkout-session',
  async (req: Request, res: Response) => {
    const { hour, priceid, date, email } = req.body
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [
          {
            price: priceid,
            quantity: 1,
          },
        ],
        invoice_creation: { enabled: true },
        client_reference_id: 'shit',
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&hour=${hour}&date=${date}&price=${priceid}`,
      })
      res.json(session)
    } catch (error) {
      res.status(400).json({
        message: error.message,
      })
    }
  }
)

paymentRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await stripe.invoices.retrieve(
      'in_1MxtYmLZfLpJv2G9aCj75XeX'
    )
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

paymentRouter.post('/save', async (req: Request, res: Response) => {
  const { session_id, dateofreservation, timerange, product_id } = req.body
  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string
    )

    // Retrieve the invoice associated with the payment intent
    const invoice = await stripe.invoices.retrieve(session.invoice as string)

    const checkDuplicate = await get(product_id, dateofreservation, timerange)

    if (checkDuplicate.length)
      return res
        .status(409)
        .json({ error: true, message: 'The Schedule was already taken' })

    const createReservation = await create({
      dateofreservation,
      timerange,
      product_id,
    })

    await sendInvoice(session.customer_email, invoice.hosted_invoice_url)

    res.status(201).json({
      invoice_link: invoice.hosted_invoice_url,
      details: createReservation,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
