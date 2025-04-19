const express = require('express');
const rateLimit = require('express-rate-limit');



// Custom rate limiter key generator
const getUserKey = (req) => {
    return req.body.phone || req.ip;
  };

// Define the rate limiter
const resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1, 
  keyGenerator: getUserKey,
  message: { code: 429, message: "You have already sent the request Please wait for 10 minutes then Try again", status: false }
});

module.exports = { resendOtpLimiter }