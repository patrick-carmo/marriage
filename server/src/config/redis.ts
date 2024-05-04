import { createClient } from 'redis'
import env from './envConfig'

const client = createClient({
  // password: env.REDIS_PASSWORD,
  // socket: {
  //   host: env.REDIS_HOST,
  //   port: env.REDIS_PORT,
  // },
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 20) {
        console.log('Too many attempts to reconnect. Redis connection was terminated')
        return new Error('Too many retries.')
      } else return retries * 500
    },
  },
  url: env.REDIS_URL,
})

client.on('error', error => console.error(`Redis connection error: ${error.message}`))

export default client
