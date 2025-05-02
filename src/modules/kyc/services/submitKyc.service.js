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

// Helper function to ensure proper base64 format
function formatBase64Image(base64String) {
  // If it's already properly formatted, return as is
  if (base64String.startsWith("data:image/")) {
    return base64String;
  }

  // If it's just the base64 string without prefix, add the prefix
  if (base64String.match(/^[A-Za-z0-9+/=]+$/)) {
    return `data:image/jpeg;base64,${base64String}`;
  }

  // If it's not valid base64, throw error
  throw new Error("Invalid base64 image format");
}

async function createKycRecord({ job_id, user_id }) {
  try {
    const kycRecord = await Kyc.create({
      job_id,
      user_id,
      status: "PENDING",
    });
    return kycRecord;
  } catch (error) {
    console.error("Error creating KYC record:", error);
    throw error;
  }
}

async function submitKyc({
  job_id,
  user_id,
  country,
  id_type,
  selfie,
  id_front,
  id_back,
}) {
  try {
    // Create KYC record first
    await createKycRecord({ job_id, user_id });

    // Validate required fields
    if (!job_id || !user_id || !country || !id_type || !selfie || !id_front) {
      throw new Error("Missing required fields for KYC submission");
    }

    // Format and validate images
    try {
      selfie = formatBase64Image(selfie);
      id_front = formatBase64Image(id_front);
      if (id_back) {
        id_back = formatBase64Image(id_back);
      }
    } catch (error) {
      throw new Error(
        "Invalid image format. Please provide valid base64 encoded images"
      );
    }

    let image_details = [
      { image_type_id: 2, image: selfie },
      { image_type_id: 3, image: id_front },
    ];
    if (id_back) {
      image_details.push({ image_type_id: 7, image: id_back });
    }

    let partner_params = {
      job_id,
      user_id,
      job_type: 6,
    };

    let id_info = {
      country,
      id_type,
    };

    let options = {
      return_job_status: true,
      return_history: false,
      return_image_links: false,
      signature: true,
    };

    console.log("Submitting KYC job with params:", {
      partner_params,
      id_info,
      image_count: image_details.length,
    });

    const response = await connection.submit_job(
      partner_params,
      image_details,
      id_info,
      options
    );
    return { status: true, code: 200, data: response };
  } catch (error) {
    console.error("Error in submitKycJob:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      msg: error.response?.data?.message || error.message,
    };
  }
}

module.exports = {
  submitKyc,
  createKycRecord,
};
