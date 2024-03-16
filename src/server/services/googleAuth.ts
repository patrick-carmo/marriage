import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { User } from '../interfaces/user'
import knex from '../../config/database'
import client from '../../config/redis'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, email, picture } = profile

      const userData = { google_id: id, email, name: displayName, picture, last_login: new Date() }

      const user = await knex<User>('users').where({ google_id: id }).first()

      if (!user) {
        await knex<User>('users').insert(userData)

        client.set(id, JSON.stringify(userData), {
          EX: 3600 * 24,
        })

        return done(null, userData)
      }

      await knex<User>('users').where({ google_id: id }).update(userData)

      client.set(id, JSON.stringify(userData), {
        EX: 3600 * 24,
      })

      return done(null, userData)
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
