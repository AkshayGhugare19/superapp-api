const { db } = require("../../../db/db");
const verifyOtpOnPhone = require("../../../utilities/verifyOtpOnPhone");
const verifyOtpOnEmail = require("../../../utilities/verifyOtpOnEmail");

const verifyOTP = async ({ phone, countryCode, email, otp, role, type }) => {
	try {
		// Verification
		if (process.env.NODE_ENV === 'development') {
			let verificationCheck;
			if (type === 'phone') {
				verificationCheck = await verifyOtpOnPhone(phone, countryCode, otp);
			} else if (type === 'email') {
				verificationCheck = await verifyOtpOnEmail(email, otp);
			}
			if (verificationCheck?.success===false) {
				return { status: false, code: 400, msg: "Invalid OTP." };
			}
		} else {
			if (otp !== "123456") {
				return { status: false, code: 400, msg: "Invalid OTP." };
			}
		}

		// Find or create user
		const whereClause = type === 'phone' ? { phone } : { email};
		let userExists = await db.Users.findOne({ where: whereClause });

		if (userExists) {
			if (type === 'phone') {
				userExists.isMobileVerified = true;
				userExists.countryCode = countryCode;
			} else {
				userExists.isEmailVerified = true;
			}
			await userExists.save();
			return { status: true, code: 201, data: { data: userExists, msg: "OTP verified successfully" } };
		} else {
			const newUserData = {
				role,
				isActive: true,
				isMobileVerified: type === 'phone',
				isEmailVerified: type === 'email',
				...(type === 'phone' && { phone, countryCode }),
				...(type === 'email' && { email })
			};
			const newUser = await db.Users.create(newUserData);
			return { status: true, code: 201, data: { data: newUser, msg: "OTP verified successfully" } };
		}
	} catch (error) {
		console.error("Error while verifying OTP:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = verifyOTP;
