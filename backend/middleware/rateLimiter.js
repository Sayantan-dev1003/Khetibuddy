const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter
 * Limits all API requests to 100 per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Stricter limiter for expensive GROQ API calls (Chat, Disease Detection)
 * Limits to 10 requests per 10 minutes
 */
const groqLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,


  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'We are experiencing high traffic on our AI services. Please wait a few minutes before trying again.'
  },
  skipSuccessfulRequests: false, // Count all attempts
});

/**
 * Brute-force protection for Auth routes (Login, Signup)
 * Limits to 5 attempts per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

module.exports = {
  apiLimiter,
  groqLimiter,
  authLimiter
};
