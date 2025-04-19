const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const chatService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const sendMessage = catchAsync(async (req, res) => {

    const senderId = req.user.id
    const { receiverId, message, conversationId } = await pick(req?.body, ['receiverId', 'message', 'conversationId']);

    const response = await chatService.sendMessage({ senderId, receiverId, message, conversationId });

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = sendMessage;
