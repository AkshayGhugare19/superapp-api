const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const statusCodeMap = require('../../../utilities/statusCodeMap');

const sendOTPEmail = catchAsync(async (req, res) => {
	const { email } = req.body;

	const result = await userService.sendOTPEmail(email);

	if (result.status) {
		sendResponse(res, statusCodeMap[result.code], result.msg, null);
	} else {
		sendResponse(res, statusCodeMap[result.code], null, result.msg);
	}
});

module.exports = sendOTPEmail;
