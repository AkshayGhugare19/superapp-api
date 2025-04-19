const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const verifyOTP = catchAsync(async (req, res) => {

	const { phone, countryCode, otp, role } = pick(req.body, ["phone", "countryCode", "otp", "role"]);

	const userResult = await userService.verifyOTP({ phone, countryCode, otp, role })
	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg)
	}
});

module.exports = verifyOTP