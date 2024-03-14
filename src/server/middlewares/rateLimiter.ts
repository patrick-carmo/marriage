import rateLimit from 'express-rate-limit'

const requestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later' })
  }
})

export default requestLimiter