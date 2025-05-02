const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const kycService = require('../services');
const { v4: uuidv4 } = require('uuid');
const statusCodeMap = require('../../../utilities/statusCodeMap');

const submitKyc = catchAsync(async (req, res) => {
  // Generate job_id
  const job_id = uuidv4();
  // Get user_id from authentication middleware
  const user_id = req.user.id;
  const { country, id_type, selfie, id_front, id_back } = req.body;

  const response = await kycService.submitKyc({ job_id, user_id, country, id_type, selfie, id_front, id_back });
  
  if (response?.status) {
    sendResponse(res, statusCodeMap[response?.code], { ...response, job_id }, null);
  } else {
    sendResponse(res, statusCodeMap[response?.code], null, response?.msg);
  }
});

module.exports = submitKyc;