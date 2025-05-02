const pick = require('../../../../utilities/pick');
const statusCodeMap = require('../../../../utilities/statusCodeMap');
const catchAsync = require('../../../../utilities/catchAsync');
const createMessage = require('../services/createMessage.service');
const sendResponse = require('../../../../utilities/responseHandler');

const createMessageController = catchAsync(async (req, res) => {
  const user = req.user;
  const body = pick(req.body, [
    'conversationId',
    'message',
    'messageType',
    'media',
  ]);

  const response = await createMessage({
    ...body,
    user,
    senderId: user.id,
  });

  if (response?.status) {
    sendResponse(res, statusCodeMap[response.code], response.data, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.msg);
  }
});

module.exports = createMessageController;
