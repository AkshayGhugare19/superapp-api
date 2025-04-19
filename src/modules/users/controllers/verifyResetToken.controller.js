const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const verifyResetToken = catchAsync(async (req, res) => {

	const { resetToken, otp } = pick(req.body, ["resetToken", "otp"]);

	const userResult = await userService.verifyResetToken({ resetToken, otp })
	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg)
	}
});

module.exports = verifyResetToken