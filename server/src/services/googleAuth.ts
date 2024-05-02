import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { User } from '../interfaces/user'
import knex from '../config/database'
import client from '../config/redis'
import env from '../config/envConfig'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, email, picture } = profile
      const newUserData = { google_id: id, email, name: displayName, picture, last_login: new Date() }

      const foundUser = await knex<User>('users').where({ google_id: id }).first()

      if (!foundUser) {
        const user = await knex<User>('users').insert(newUserData).returning('*')

        await client.set(`${env.SERVER}-${id}`, JSON.stringify(user[0]), {
          EX: 3600 * 24,
        })

        return done(null, user[0])
      }

      const user = await knex<User>('users').where({ google_id: id }).update(newUserData).returning('*')

      await client.set(`${env.SERVER}-${id}`, JSON.stringify(user[0]), {
        EX: 3600 * 24,
      })

      return done(null, user[0])
    }
  )
)

passport.serializeUser((user: any, done: any) => {
  done(null, user)
})

passport.deserializeUser((user: any, done: any) => {
  done(null, user)
})

export default passport
