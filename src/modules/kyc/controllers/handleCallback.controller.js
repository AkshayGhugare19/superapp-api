const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const kycService = require('../services');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const handleCallback = catchAsync(async (req, res) => {
  const response = await kycService.handleCallback(req.body);
  
  if (response.status) {
    sendResponse(res, statusCodeMap[response.code], response.message, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.message);
  }
});

module.exports = handleCallback; 
