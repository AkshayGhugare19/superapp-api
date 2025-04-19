const httpStatus = require("http-status");

const statusCodeMap = {
	200: httpStatus.OK,
	201: httpStatus.CREATED,
	204: httpStatus.NO_CONTENT,
	500: httpStatus.INTERNAL_SERVER_ERROR,
	404: httpStatus.NOT_FOUND,
	401: httpStatus.UNAUTHORIZED,
	400: httpStatus.BAD_REQUEST,
	402: httpStatus.PAYMENT_REQUIRED,
	403: httpStatus.UNAUTHORIZED,
};

module.exports = statusCodeMap;