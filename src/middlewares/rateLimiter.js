const httpStatus = require('http-status');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const sendResponse = require('../utilities/responseHandler');

const MAX_REQUEST_LIMIT = 500; // Maximum number of requests allowed
const MAX_REQUEST_WINDOW = 60; // 1 minute window
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests';

const options = {
	duration: MAX_REQUEST_WINDOW, // Duration of the window in seconds
	points: MAX_REQUEST_LIMIT, // Maximum number of points (requests)
};

const rateLimiter = new RateLimiterMemory(options);

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.consume(req.ip)
		.then((rateLimiterRes) => {
			res.setHeader('Retry-After', Math.ceil(rateLimiterRes.msBeforeNext / 1000));
			res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT);
			res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
			res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
			next();
		})
		.catch(() => {
			console.log("Too many requests from IP:", req.ip);
			sendResponse(res, httpStatus.TOO_MANY_REQUESTS, null, TOO_MANY_REQUESTS_MESSAGE)
			// res.status(httpStatus.TOO_MANY_REQUESTS).json({ message: TOO_MANY_REQUESTS_MESSAGE });
		});
};

module.exports = {
	rateLimiterMiddleware,
};
