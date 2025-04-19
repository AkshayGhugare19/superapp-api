const httpStatus = require('http-status');
const sendResponse = require('../utilities/responseHandler');

const allowedDomain = process.env.REMOTE_BASE_URL; // Replace with your allowed domain

const domainCheckerMiddleware = (req, res, next) => {
	const origin = req.get('Origin');
	const referer = req.get('Referer');

	if (origin && origin !== undefined) {
		// Check Origin header
		try {
			if (new URL(origin).origin !== allowedDomain) {
				return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Origin');
			}
		} catch (error) {
			return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Origin');
		}
	} else if (referer && referer !== undefined) {
		// Check Referer header
		try {
			const refererUrl = new URL(referer);
			if (refererUrl.origin !== allowedDomain) {
				return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Referer');
			}
		} catch (error) {
			return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Referer');
		}
	} 
	// else {
	// 	// If neither Origin nor Referer header is present
	// 	return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Missing Origin/Referer');
	// }

	next();
};

module.exports = {
	domainCheckerMiddleware,
};
