const catchAsync = require('../../../../utilities/catchAsync');
const sendResponse = require('../../../../utilities/responseHandler');
const groupService = require("../services");
const statusCodeMap = require('../../../../utilities/statusCodeMap');

const updateGroup = catchAsync(async (req, res) => {
const adminId = req.user.id;

const { groupId, conversationId, ...groupData } = req.body;

const response = await groupService.updateGroup({
  adminId,
  groupId,
  conversationId,
  groupData
});

	if (response?.status) {
		sendResponse(res, statusCodeMap[response?.code], response?.data, null);
	} else {
		sendResponse(res, statusCodeMap[response?.code], null, response?.msg)
	}
});

module.exports = updateGroup