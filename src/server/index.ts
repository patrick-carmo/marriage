import 'dotenv/config'
import express, { Express } from 'express'

import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'

import path from 'path'
import RedisStore from 'connect-redis'
import client from '../config/redis'

const app: Express = express()
const PORT = process.env.PORT || 3000

import route from './routes/route'

client.connect()

app.use(cookieParser())
app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client, ttl: 3600 }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.json())
app.use(route)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
