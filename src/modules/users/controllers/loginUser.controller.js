const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const loginUser = catchAsync(async (req, res) => {

	const { email, password, role } = await pick(req?.body, ['email', 'password', 'role'])

	const loginResult = await usersService.loginUser({ email, password, role })
	if (loginResult?.status) {
		sendResponse(res, statusCodeMap[loginResult?.code], loginResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[loginResult?.code], null, loginResult?.msg);
	}
});

module.exports = loginUser