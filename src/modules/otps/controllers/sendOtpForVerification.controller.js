const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpService = require('../services'); // Import the service for OTP handling
const pick = require('../../../utilities/pick');

const sendOtpForVerification = catchAsync(async (req, res) => {
	// Extract phoneNumber and other necessary parameters from the request body
	let { phoneNumber = "" } = pick(req?.body, ["phoneNumber"]);

	// Check if phoneNumber is provided
	if (!phoneNumber || phoneNumber === undefined) {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, "Phone number is required.");
	}

	let otpResult = await otpService.sendOtpForVerification(phoneNumber);

	if (otpResult?.status) {
		sendResponse(res,
			otpResult.code === 201 ? httpStatus.CREATED : httpStatus.OK,
			otpResult?.data?.user ? {
				phone: otpResult?.data?.user?.phone,
				msg: otpResult?.data?.msg
			} : otpResult.data,
			null
		);
	} else {
		sendResponse(res,
			otpResult.code === 404 ? httpStatus.NOT_FOUND
				: otpResult.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
			null,
			otpResult.msg
		);
	}
});

module.exports = sendOtpForVerification;