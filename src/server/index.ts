import 'dotenv/config'
import env from '../config/envConfig'
import express, { Express } from 'express'

import session from 'express-session'
import passport from 'passport'

import path from 'path'
import RedisStore from 'connect-redis'
import client from '../config/redis'

const app: Express = express()

import route from './routes/route'

client.connect()

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

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.json())
app.use(route)

app.listen(env.PORT, () => {
  console.log(`The server is running on port ${env.PORT}`)
})
