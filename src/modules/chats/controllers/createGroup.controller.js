const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const chatService = require('../services');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const createGroup = catchAsync(async (req, res) => {
  const adminId = req.user.id;
  const {
    groupName,
    groupDescription,
    groupImage,
    participantIds, // should be an array
  } = req.body;

  const response = await chatService.createGroup({
    adminId,
    groupName,
    groupDescription,
    groupImage,
    participantIds,
  });

  if (response?.status) {
    sendResponse(res, statusCodeMap[response.code], response.data, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.msg);
  }
});

module.exports = createGroup;
