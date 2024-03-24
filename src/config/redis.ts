import { createClient } from 'redis'
import env from './envConfig'

const client = createClient({
  // password: env.REDIS_PASSWORD,
  // socket: {
  //   host: env.REDIS_HOST,
  //   port: env.REDIS_PORT,
  // },
  url: env.REDIS_URL,
})

export default client
