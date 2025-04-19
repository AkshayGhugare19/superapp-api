const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const sendOTP = catchAsync(async (req, res) => {
	const { phone, countryCode, email, type } = pick(req.body, ["phone", "countryCode", "email", "type"]);

	const userResult = await userService.sendOTP({ phone, countryCode, email, type });

	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.msg, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg);
	}
});

module.exports = sendOTP;
