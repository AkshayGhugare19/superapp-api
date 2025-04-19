const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const forgotPassword = catchAsync(async (req, res) => {

	const { phone, countryCode } = pick(req.body, ["phone", "countryCode"]);

	const userResult = await userService.forgotPassword({ phone, countryCode })
	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg)
	}
});

module.exports = forgotPassword