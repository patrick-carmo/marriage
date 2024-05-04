import 'dotenv/config'
import 'express-async-errors'

import env from './config/envConfig'
import express, { Express } from 'express'
import cors from 'cors'

import session from 'express-session'
import passport from 'passport'

import path from 'path'
import RedisStore from 'connect-redis'
import client from './config/redis'

const app: Express = express()

import route from './routes/route'

import errorMiddleware from './middlewares/errorInterceptor'

client.connect()

app.use(
  cors({
    origin: env.SERVER.replace(/\/$/, ''),
    credentials: true,
  })
)

app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
    rolling: true,
    store: new RedisStore({ client, ttl: 86400 }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '../../client/www')))
app.use(express.json())

app.use('/api', route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/www/index.html'))
})

app.use(errorMiddleware)

const server = app.listen(env.PORT, () => {
  console.log(`The server is running on port ${env.PORT}`)
})

process.on('SIGINT', () => {
  client.quit()
  console.log('Redis connection closed')
  server.close(() => {
    console.log('Server stopped')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  client.quit()
  console.log('Redis connection closed')
  server.close(() => {
    console.log('Server stopped')
    process.exit(0)
  })
})
