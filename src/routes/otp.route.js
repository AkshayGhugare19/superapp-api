const express = require('express');
const otpControllers = require('../modules/otps/controllers');
const validate = require("../middlewares/validate");
const otpValidation = require("../modules/otps/otp.validations");
const auth = require('../middlewares/auth');
const router = express.Router();

router.route('/send').post(
	validate(otpValidation.sendOtpForVerification),
	otpControllers.sendOtpForVerification
);
router.route('/verify').post(
	validate(otpValidation.verifyOtpPhone),
	otpControllers.verifyOtpPhone
);
router.route('/get-expiry/:phoneNumber').get(
	validate(otpValidation.getExpiryByPhone),
	otpControllers.getExpiryByPhone
);

module.exports = router;
