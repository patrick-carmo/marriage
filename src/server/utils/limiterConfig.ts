import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many requests from this IP, please try again after 15 minutes'
})

export default limiter