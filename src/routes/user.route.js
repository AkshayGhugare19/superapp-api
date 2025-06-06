const express = require('express');
const userControllers = require('../modules/users/controllers');
const validate = require("../middlewares/validate");
const userValidation = require("../modules/users/user.validations");
const auth = require('../middlewares/auth');
const { roles } = require('../config/enums');
const router = express.Router();


router.route('/register').post(validate(userValidation.registerUser), userControllers.registerUser);
router.route('/login').post(validate(userValidation.loginUser), userControllers.loginUser);
router.route('/update/:id').post(validate(userValidation.updateUser), userControllers.updateUser);
router.route('/send-otp').post(validate(userValidation.sendOTP), userControllers.sendOTP);
router.route('/verify-otp').post(validate(userValidation.verifyOTP), userControllers.verifyOTP);
router.route('/forgotPassword').post(validate(userValidation.sendOTP), userControllers.forgotPassword);
router.route('/verifyResetToken').post(validate(userValidation.verifyResetToken), userControllers.verifyResetToken);
router.route('/resetPassword').post(validate(userValidation.resetPassword), userControllers.resetPassword);

//logout route
router.route('/logout').post(auth([roles.admin,roles.consumer,roles.merchant,roles.agent]), userControllers.logout);

// only for testing encryption
router.route('/encrypt').post(userControllers.encryption);


module.exports = router;
