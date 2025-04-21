const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const loginUser = catchAsync(async (req, res) => {

	const { email, phone, countryCode, password, role, type } = await pick(req?.body, ['email', 'phone', 'countryCode', 'password', 'role', 'type'])

	const loginResult = await usersService.loginUser({ email, phone, countryCode, password, role, type })
	if (loginResult?.status) {
		sendResponse(res, statusCodeMap[loginResult?.code], loginResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[loginResult?.code], null, loginResult?.msg);
	}
});

module.exports = loginUser