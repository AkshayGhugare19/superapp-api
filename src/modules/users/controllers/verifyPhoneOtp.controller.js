const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const statusCodeMap = require('../../../utilities/statusCodeMap');
const userService = require("../services");

const verifyPhoneOtpController = catchAsync(async (req, res) => {
	const { phone, countryCode, otp, role } = req.body;

	const result = await userService.verifyPhoneOtp({ phone, countryCode, otp, role });

	if (result?.status) {
		sendResponse(res, statusCodeMap[result.code], result.data, null);
	} else {
		sendResponse(res, statusCodeMap[result.code], null, result.msg);
	}
});

module.exports = verifyPhoneOtpController;
