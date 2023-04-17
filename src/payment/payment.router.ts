import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})
import express from 'express'
import type { Request, Response } from 'express'
export const paymentRouter = express.Router()

paymentRouter.post(
  '/create-checkout-session',
  async (req: Request, res: Response) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: req.body.priceid,
            quantity: 1,
          },
        ],
        customer_email: 'test123@gmail.com',
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
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
    const products = await stripe.products.list()
    res.json(products.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

paymentRouter.get('/save', async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id as string
    )
    res.status(200).json(session)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
