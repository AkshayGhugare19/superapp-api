const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const verifyOTP = catchAsync(async (req, res) => {
	const { phone, countryCode, email, otp, role, type } = pick(req.body, ["phone", "countryCode", "email", "otp", "role", "type"]);

	const userResult = await userService.verifyOTP({ phone, countryCode, email, otp, role, type });

	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg);
	}
});

module.exports = verifyOTP;
