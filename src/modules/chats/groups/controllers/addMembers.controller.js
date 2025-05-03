const catchAsync = require('../../../../utilities/catchAsync');
const sendResponse = require('../../../../utilities/responseHandler');
const statusCodeMap = require('../../../../utilities/statusCodeMap');
const groupService = require('../services');

const addGroupMembers = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const { participantIds } = req.body;
  const addedBy = req.user.id;

  const response = await groupService.addMembers({
    groupId,
    participantIds,
    addedBy,
  });

  if (response?.status) {
    sendResponse(res, statusCodeMap[response.code], response.data, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.msg);
  }
});

module.exports = addGroupMembers;
