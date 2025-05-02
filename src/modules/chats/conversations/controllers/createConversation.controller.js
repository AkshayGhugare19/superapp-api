
const pick = require('../../../../utilities/pick');
const statusCodeMap = require('../../../../utilities/statusCodeMap');
const catchAsync = require('../../../../utilities/catchAsync');
const  controllers  = require('../services');
const sendResponse = require('../../../../utilities/responseHandler');



const createConversation = catchAsync(async (req, res) => {

    const user = req.user
    const {  participantIds } = pick(req.body, ['participantIds']);
    const response = await controllers.createConversation({ participantIds , initiatorId : user.id, groupName: null});

    if (response?.status) {
        sendResponse(res, statusCodeMap[response?.code], response?.data, null);
    } else {
        sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
    }
});

module.exports = createConversation;
