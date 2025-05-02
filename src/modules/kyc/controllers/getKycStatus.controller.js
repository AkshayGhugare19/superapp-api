const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const kycService = require('../services');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const getKycStatus = catchAsync(async (req, res) => {
  const { jobId } = req.params;

  const response = await kycService.getKycStatus(jobId);
  
  if (response.status) {
    sendResponse(res, statusCodeMap[response.code], response.data, null);
  } else {
    sendResponse(res, statusCodeMap[response.code], null, response.message);
  }
});

module.exports = getKycStatus;