import { createTransport } from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

const transporter = createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

type Schedule = {
  date: string
  time: string
}

export async function sendInvoice(
  toEmail: string,
  invoice: string,
  schedule: Schedule
) {
  await transporter.sendMail({
    from: 'danie.araojo022@gmail.com',
    to: toEmail,
    subject: 'Your invoice',
    html: `
    <h1>Here's your invoice Please go to this schedule :</h1>
    <h2>${schedule.date} ${schedule.time}</h2>
    <p>${invoice}</p>`,
  })
}
