const smileIdentityCore = require("smile-identity-core");
const WebApi = smileIdentityCore.WebApi;
const Signature = smileIdentityCore.Signature;
const { db } = require("../../../db/db");
const Kyc = db.Kyc;

const partner_id = process.env.SMILE_PARTNER_ID;
const default_callback = process.env.SMILE_CALLBACK_URL;
const api_key = process.env.SMILE_API_KEY;
const sid_server = process.env.SMILE_ENVIRONMENT || "0";

// Debug logging
console.log("Smile ID Configuration:", {
  partner_id: partner_id ? "Set" : "Not Set",
  default_callback: default_callback ? "Set" : "Not Set",
  api_key: api_key ? "Set" : "Not Set",
  sid_server,
});

if (!partner_id || !default_callback || !api_key) {
  console.error("Missing required Smile ID environment variables");
  throw new Error(
    "Missing required Smile ID environment variables. Please check your .env file."
  );
}

const connection = new WebApi(
  partner_id,
  default_callback,
  api_key,
  sid_server
);
const signatureVerifier = new Signature(partner_id, api_key);

async function checkKycStatus(job_id, user_id) {
  try {
    const partner_params = {
      user_id,
      job_id,
      job_type: 6,
    };

    const options = {
      return_history: true,
      return_image_links: false,
    };

    // Query job status from Smile ID
    const response = await connection.query_job(partner_params, options);

    // Map Smile ID status codes to readable status
    const statusMap = {
      "0810": "VERIFIED", // Document Verified
      "0811": "VERIFIED_WITH_CHANGES", // Document Verified with Human Review Changes
      "0812": "UNVERIFIED", // Document Unverified
      "0813": "UNVERIFIED", // Document Unverified after Human Review
      "0814": "PROCESSING", // Awaiting Human Review
      "0815": "PROCESSING", // Under Human Review
      1000: "ERROR", // General Error
    };

    const resultCode = response.ResultCode || "1000";
    const status = statusMap[resultCode] || "UNKNOWN";

    return {
      status,
      job_complete: response.job_complete || false,
      result_code: resultCode,
      result_text: response.ResultText,
      actions: response.Actions || {},
      verification_type: response.VerificationType,
      timestamp: response.timestamp,
    };
  } catch (error) {
    console.error("Error checking KYC status:", error);
    throw new Error("Failed to check KYC status");
  }
}

async function getKycRecord(jobId) {
  try {
    const kycRecord = await Kyc.findOne({ where: { job_id: jobId } });
    if (!kycRecord) {
      return { status: false, code: 404, message: "KYC record not found" };
    }
    return { status: true, data: kycRecord };
  } catch (error) {
    console.error("Error fetching KYC record:", error);
    throw error;
  }
}

async function updateKycRecord(kycRecord, status) {
  try {
    await kycRecord.update({
      status: status.status,
      result: status,
    });
    return { status: true, data: kycRecord };
  } catch (error) {
    console.error("Error updating KYC record:", error);
    throw error;
  }
}

async function getKycStatus(jobId) {
  try {
    // First check our database
    const { status: dbStatus, data: kycRecord } = await getKycRecord(jobId);
    if (!dbStatus) {
      return { status: false, code: 404, message: "KYC record not found" };
    }

    // If status is COMPLETED, return stored result
    if (kycRecord.status === "COMPLETED") {
      return {
        status: true,
        code: 200,
        data: {
          status: kycRecord.status,
          result: kycRecord.result,
        },
      };
    }

    // Check status from Smile ID
    const status = await checkKycStatus(jobId, kycRecord.user_id);

    // Update our record if needed
    if (status.job_complete) {
      await updateKycRecord(kycRecord, status);
    }

    return {
      status: true,
      code: 200,
      data: {
        status: status.status,
        result: status,
      },
    };
  } catch (error) {
    console.error("Error in getKycStatus:", error);
    return {
      status: false,
      code: 500,
      message: error.message || "Failed to get KYC status",
    };
  }
}

module.exports = {
  getKycStatus,
  checkKycStatus,
  getKycRecord,
  updateKycRecord,
};
