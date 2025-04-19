const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const statusCodeMap = require('../../../utilities/statusCodeMap');

const updateUser = catchAsync(async (req, res) => {

    const body = req?.body || {};
    const userId = req.params.id;

    const addResult = await usersService.updateUser(userId, body);
    if (addResult?.status) {
        sendResponse(res, statusCodeMap[addResult?.code], addResult?.data, null);
    } else {
        sendResponse(res, statusCodeMap[addResult?.code], null, addResult?.msg)
    }
});

module.exports = updateUser