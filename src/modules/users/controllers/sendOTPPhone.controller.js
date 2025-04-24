const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const statusCodeMap = require('../../../utilities/statusCodeMap');

const sendOTPPhone = catchAsync(async (req, res) => {
	const { phone, countryCode } = req.body;

	const result = await userService.sendOTPPhone({ phone, countryCode });

	if (result.status) {
		sendResponse(res, statusCodeMap[result.code], result.msg, null);
	} else {
		sendResponse(res, statusCodeMap[result.code], null, result.msg);
	}
});

module.exports = sendOTPPhone;
