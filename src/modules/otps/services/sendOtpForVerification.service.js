const { otpType } = require('../../../config/enums');
const { db } = require('../../../db/db');
const moment = require('moment');
const generateOtp = require('../../../utilities/generateOtp');
const { Op, Sequelize } = require('sequelize');

const MAX_OTP_ATTEMPTS = 3;
const OTP_EXPIRATION_MINUTES = process.env.PHONE_VERIFY_OTP_EXPIRATION_MINUTES || 15; // Default to 10 minutes if not set

const sendOtpForVerification = async (phoneNumber) => {
	try {
		// const user = await db.Users.findOne({
		// 	where: { phone: phoneNumber, active: true }, 
		// 	raw: true
		// });
		const userExists = await db.Users.findAll({
			where: {
				[Op.or]: [
					// { phone: phoneNumber, active: true },
					{
                        [Op.and]: [
                            Sequelize.where(
                                Sequelize.fn('REPLACE', Sequelize.col('phone'), '+', ''),
                                phoneNumber.replace('+', '')
                            ),
                            { active: true }
                        ]
                    }
				]
			}, raw: true
		});
		if (userExists?.length > 1) {
			return { status: false, code: 400, msg: "We found multiple records for details provided." };
		}
		let user = userExists[0];

		if (!user) {
			return { status: false, code: 404, msg: "Record not found for this phone number." };
		}

		if (user.isAccountLocked) {
			return { status: false, code: 400, msg: "Your account is locked." };
		}

		if (user.isMobileVerified) {
			return { status: true, code: 200, data: "Your phone number is already verified." };
		}

		const oneHourAgo = moment().subtract(1, 'hour').toDate();

		// Check the number of OTP requests in the last hour
		const recentOtpAttempts = await db.Otps.count({
			where: {
				phoneNumber,
				otpFor: otpType.phoneVerify,
				createdAt: { [Op.gte]: oneHourAgo }
			}
		});

		if (recentOtpAttempts >= MAX_OTP_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many OTP requests in the last hour. Please try again later." };
		}

		// Check if an unexpired OTP already exists
		const existingOtp = await db.Otps.findOne({
			where: {
				phoneNumber,
				otpFor: otpType.phoneVerify,
				expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
			},
			order: [['createdAt', 'DESC']]
		});

		if (existingOtp) {
			return {
				status: true, code: 200, data: {
					user,
					msg: `An OTP has already been sent to verify your phone number.`
				}
			};
		}

		const otpCode = generateOtp();
		const expiresAt = moment().add(OTP_EXPIRATION_MINUTES, 'minutes').toDate();

		const newOtp = await db.Otps.create({
			phoneNumber,
			otpCode,
			otpFor: otpType.phoneVerify,
			expiresAt
		});

		// Implement your method to send OTP, e.g., sendSms(phoneNumber, otpCode);

		if (newOtp) {
			// await sendOtpOnMobile(otpCode, phoneNumber)
			return {
				status: true, code: 200, data: {
					user,
					msg: `An OTP has been send to verify your phone number.`
				}
			};
		} else {
			return { msg: "Something went wrong, please try again.", status: false, code: 400 };
		}
	} catch (error) {
		console.error("Error while sending OTP:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = sendOtpForVerification;
