const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const statusCodeMap = require('../../../utilities/statusCodeMap');

const logout = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const addResult = await usersService.logout(userId);
    if (addResult?.status) {
        sendResponse(res, statusCodeMap[addResult?.code], addResult?.data, null);
    } else {
        sendResponse(res, statusCodeMap[addResult?.code], null, addResult?.msg)
    }
});

module.exports = logout