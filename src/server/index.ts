import 'dotenv/config'
import express, { Express } from 'express'
import route from './routes/route'
const app: Express = express()
const PORT = process.env.PORT || 3000
import path from 'path'

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.json())
app.use(route)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
