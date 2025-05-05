const catchAsync = require('../../../../utilities/catchAsync');
const sendResponse = require('../../../../utilities/responseHandler');
const statusCodeMap = require('../../../../utilities/statusCodeMap');
const groupService = require('../services');

const removeMember = catchAsync(async (req, res) => {
  const { id: groupId, memberId } = req.params;
  const removedBy = req.user.id;

  const response = await groupService.removeMember({
    groupId,
    memberId,
    removedBy
  });

  if (response?.status) {
    sendResponse(res, statusCodeMap[response.code], response.data, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.msg);
  }
});

module.exports = removeMember; 