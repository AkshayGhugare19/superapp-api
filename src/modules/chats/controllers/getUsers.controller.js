const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const chatService = require("../services");
const statusCodeMap = require('../../../utilities/statusCodeMap');
const pick = require('../../../utilities/pick');

const getUsers = catchAsync(async (req, res) => {

    const userId = req.user.id
    const { tenderId } = await pick(req?.query, ['tenderId']);
    const response = await chatService.getUsers({ userId, tenderId });

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = getUsers;
