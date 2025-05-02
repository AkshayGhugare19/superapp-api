const catchAsync = require('../../../../utilities/catchAsync');
const sendResponse = require('../../../../utilities/responseHandler');
const chatService = require("../../services");
const pick = require('../../../../utilities/pick');
const statusCodeMap = require('../../../../utilities/statusCodeMap');

const getMessages = catchAsync(async (req, res) => {

    const senderId = req.user.id
    const { conversationId, receiverId } = await pick(req?.query, ['conversationId', 'receiverId']);
    const response = await chatService.getMessages({ senderId, receiverId, conversationId });

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = getMessages;
