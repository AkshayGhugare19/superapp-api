const smileIdentityCore = require('smile-identity-core');
const WebApi = smileIdentityCore.WebApi;
const Signature = smileIdentityCore.Signature;
const { db } = require('../../../db/db');
const Kyc = db.Kyc;

const partner_id = process.env.SMILE_PARTNER_ID;
const default_callback = process.env.SMILE_CALLBACK_URL;
const api_key = process.env.SMILE_API_KEY;
const sid_server = process.env.SMILE_ENVIRONMENT || '0';

// Debug logging
// console.log('Smile ID Configuration:', {
//   partner_id: partner_id ? 'Set' : 'Not Set',
//   default_callback: default_callback ? 'Set' : 'Not Set',
//   api_key: api_key ? 'Set' : 'Not Set',
//   sid_server
// });

if (!partner_id || !default_callback || !api_key) {
  console.error('Missing required Smile ID environment variables');
  throw new Error('Missing required Smile ID environment variables. Please check your .env file.');
}

const connection = new WebApi(partner_id, default_callback, api_key, sid_server);
const signatureVerifier = new Signature(partner_id, api_key);

async function verifyCallback(callbackData) {
    try {
      const { timestamp, signature } = callbackData;
      return signatureVerifier.confirm_signature(timestamp, signature);
    } catch (error) {
      console.error('Error verifying callback signature:', error);
      return false;
    }
  }

async function updateKycStatus(callbackData) {
  try {
    const { SmileJobID, ResultCode, ResultText, IsFinalResult, PartnerParams } = callbackData;

    // Update KYC record
    await Kyc.update({
      status: IsFinalResult ? 'COMPLETED' : 'PROCESSING',
      result: callbackData
    }, {
      where: { job_id: PartnerParams.job_id }
    });

    // If verification is successful and final
    if (IsFinalResult && ResultCode.startsWith('0')) {
      // Handle success case - you might want to update user status, send notifications, etc.
      console.log(`KYC verification successful for job ${SmileJobID}`);
    }

    return {
      status: true,
      code: 200,
      message: 'Callback processed successfully'
    };
  } catch (error) {
    console.error('Error updating KYC status:', error);
    return {
      status: false,
      code: 500,
      message: error.message || 'Failed to process callback'
    };
  }
}

async function validateCallbackData(callbackData) {
  try {
    if (!callbackData) {
      return {
        status: false,
        code: 400,
        message: 'Callback data is required'
      };
    }

    if (!callbackData.PartnerParams) {
      return {
        status: false,
        code: 400,
        message: "'PartnerParams' is required."
      };
    }

    const { job_id, user_id, job_type } = callbackData.PartnerParams;
    if (!job_id || !user_id || !job_type) {
      return {
        status: false,
        code: 400,
        message: "PartnerParams must contain job_id, user_id, and job_type"
      };
    }

    return { status: true };
  } catch (error) {
    console.error('Error validating callback data:', error);
    return {
      status: false,
      code: 400,
      message: error.message || 'Invalid callback data'
    };
  }
}

async function handleCallback(callbackData) {
  try {
    // Validate callback data first
    const validationResult = await validateCallbackData(callbackData);
    if (!validationResult.status) {
      return validationResult;
    }

    // Verify callback signature
    const isValidCallback = await verifyCallback(callbackData);
    if (!isValidCallback) {
      return {
        status: false,
        code: 401,
        message: 'Invalid callback signature'
      };
    }

    // Process the callback
    return await updateKycStatus(callbackData);
  } catch (error) {
    console.error('Error handling callback:', error);
    return {
      status: false,
      code: 500,
      message: error.message || 'Failed to handle callback'
    };
  }
}

module.exports = {
  handleCallback,
  verifyCallback,
  updateKycStatus,
  validateCallbackData
};
