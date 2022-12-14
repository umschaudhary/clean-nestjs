import { INestApplication } from '@nestjs/common'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

let allowedOrigins = ['*']
const hosts = process.env.ALLOWED_HOSTS
if (hosts) {
  allowedOrigins = allowedOrigins.concat(hosts.split(','))
}

const setupSecurity = (app: INestApplication) => {
  // Set security-related HTTP headers
  app.use(helmet())
  // Enable Cross-origin resource sharing for a list of domains
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true)
      } else {
        callback(new Error('Origin not allowed by CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  // Limit repeated requests for brute-force attacks
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message:
        'Too many requests created from this IP, please try again after 5 minutes',
    }),
  )
}

export { setupSecurity }
