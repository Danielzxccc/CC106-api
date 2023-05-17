import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})
import express from 'express'
import type { Request, Response } from 'express'
import { create, get } from '../reservation/reservation.service'
import { sendInvoice } from '../helpers/email'
import { CustomRequest } from '../auth/auth.router'
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
        metadata: {
          schedule: hour,
          date,
        },
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

paymentRouter.get('/payments', async (req: CustomRequest, res: Response) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 20 })
    const succeededPaymentIntents = paymentIntents.data.filter(
      (paymentIntent) => paymentIntent.metadata.productname !== undefined
    )
    res.status(200).json(succeededPaymentIntents)

    // const product = await stripe.products.retrieve()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

paymentRouter.get('/graph', async (req: Request, res: Response) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 20 })
    const succeededPaymentIntents = paymentIntents.data.filter(
      (paymentIntent) => paymentIntent.metadata.productname !== undefined
    )

    const dataChart = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    }

    succeededPaymentIntents.forEach((element) => {
      const date = new Date(element.metadata.dateofreservation)
      const month = date.getMonth()
      switch (month) {
        case 0:
          dataChart.January = dataChart.January + 1
          break
        case 1:
          dataChart.February = dataChart.February + 1
          break
        case 2:
          dataChart.March = dataChart.March + 1
          break
        case 3:
          dataChart.April = dataChart.April + 1
          break
        case 4:
          dataChart.May = dataChart.May + 1
          break
        case 5:
          dataChart.June = dataChart.June + 1
          break
        case 6:
          dataChart.July = dataChart.July + 1
          break
        case 7:
          dataChart.August = dataChart.August + 1
          break
        case 8:
          dataChart.September = dataChart.September + 1
          break
        case 9:
          dataChart.October = dataChart.October + 1
          break
        case 10:
          dataChart.November = dataChart.November + 1
          break
        case 11:
          dataChart.December = dataChart.December + 1
          break
        default:
          break
      }
    })
    res.status(200).json(dataChart)
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

    const product = invoice.lines.data[0].price.product

    const retrieveProduct = await stripe.products.retrieve(product as string)

    const productname = retrieveProduct.name

    // update payment intent

    await stripe.paymentIntents.update(invoice.payment_intent as string, {
      metadata: {
        dateofreservation,
        timerange,
        productname,
      },
    })

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

    await sendInvoice(session.customer_email, invoice.hosted_invoice_url, {
      date: dateofreservation,
      time: timerange,
    })

    res.status(201).json({
      invoice_link: invoice.hosted_invoice_url,
      details: createReservation,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
