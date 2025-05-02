const express = require("express");
const router = express.Router();
const kycControllers = require("../modules/kyc/controllers");
const  kycValidation = require("../modules/kyc/kyc.validations");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

// Protect KYC endpoints with auth
router.route("/submit").post(auth(), validate(kycValidation.submitKycSchema), kycControllers.submitKyc);

router.route("/status/:jobId").get(auth(), kycControllers.getKycStatus);

// Callback does NOT need auth (Smile ID server calls it)
router.route("/callback").post(validate(kycValidation.kycCallbackSchema), kycControllers.handleCallback);

module.exports = router;
