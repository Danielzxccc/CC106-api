import { CorsOptions } from 'cors'

const allowedOrigins: string[] = [process.env.CLIENT_URL]

export const corsOptions: CorsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, value: boolean) => void
  ) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by Cors'), false)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
