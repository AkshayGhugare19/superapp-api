const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const statusCodeMap = require('../../../utilities/statusCodeMap');
const userService = require("../services");

const verifyEmailOtpController = catchAsync(async (req, res) => {
	const { email, otp, role } = req.body;

	const result = await userService.verifyEmailOtp({ email, otp, role });

	if (result?.status) {
		sendResponse(res, statusCodeMap[result.code], result.data, null);
	} else {
		sendResponse(res, statusCodeMap[result.code], null, result.msg);
	}
});

module.exports = verifyEmailOtpController;
