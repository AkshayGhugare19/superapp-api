const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const chatService = require("../services");
const pick = require('../../../utilities/pick');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const createConversation = catchAsync(async (req, res) => {

    const participant1Id = req.user.id
    const { participant2Id, tenderId } = pick(req.body, ['participant2Id', 'tenderId']);
    const response = await chatService.createConversation({ participant1Id, participant2Id, tenderId });

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = createConversation;
