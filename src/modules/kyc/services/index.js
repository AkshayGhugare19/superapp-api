const submitKycService = require('./submitKyc.service');
const getKycStatusService = require('./getKycStatus.service');
const handleCallbackService = require('./handleCallback.service');

module.exports = {
  submitKyc: submitKycService.submitKyc,
  getKycStatus: getKycStatusService.getKycStatus,
  handleCallback: handleCallbackService.handleCallback
};

