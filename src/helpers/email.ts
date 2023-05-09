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

export async function sendInvoice(toEmail: string, invoice: string) {
  console.log(process.env.EMAIL as string)
  await transporter.sendMail({
    from: 'no-reply-capturego@gmail.com',
    to: toEmail,
    subject: 'Your invoice',
    html: `<p>Here's your invoice ${invoice}</p>`,
  })
}
