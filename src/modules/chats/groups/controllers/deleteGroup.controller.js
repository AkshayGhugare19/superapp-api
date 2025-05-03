const httpStatus = require('http-status');

const groupService = require('../services');
const catchAsync = require('../../../../utilities/catchAsync');
const pick = require('../../../../utilities/pick');
const sendResponse = require('../../../../utilities/responseHandler');
const statusCodeMap = require('../../../../utilities/statusCodeMap');


const deleteGroup = catchAsync(async (req, res) => {
    const { id } = await pick(req.params, ['id']);

    const response = await groupService.deleteGroup(id)
    if (response?.status) {
		sendResponse(res, statusCodeMap[response.code], response.data, null);
	  } else {
		sendResponse(res, statusCodeMap[response.code], null, response.msg);
	  }
})

module.exports = deleteGroup