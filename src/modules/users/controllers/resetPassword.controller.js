const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const resetPassword = catchAsync(async (req, res) => {

	const { resetToken, password } = pick(req.body, ["resetToken", "password"]);

	const userResult = await userService.resetPassword({ resetToken, password })
	if (userResult?.status) {
		sendResponse(res, statusCodeMap[userResult?.code], userResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[userResult?.code], null, userResult?.msg)
	}
});

module.exports = resetPassword