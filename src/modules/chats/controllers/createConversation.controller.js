const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const chatService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const createConversation = catchAsync(async (req, res) => {

    const user = req.user
    const { chatType, participants } = pick(req.body, ['chatType', 'participants']);
    const response = await chatService.createConversation({ chatType, participants, user});

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = createConversation;
