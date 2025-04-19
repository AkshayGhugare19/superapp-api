const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const registerUser = catchAsync(async (req, res) => {
	const { role, phone, email } = await pick(req?.body, ['role', 'phone', 'email']);

	const addResult = await usersService.registerUser({ role, phone, email });

	if (addResult?.status) {
		sendResponse(res, statusCodeMap[addResult?.code], addResult?.data, null);
	} else {
		sendResponse(res, statusCodeMap[addResult?.code], null, addResult?.msg);
	}
});

module.exports = registerUser;
