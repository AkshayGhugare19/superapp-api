const { db } = require("../../../db/db");
const { sendOtpOnPhone } = require("../../../utilities/sendOTPOnPhone");

const sendOtpToPhone = async ({ phone, countryCode }) => {
	try {
		if (!phone || !countryCode) {
			return { status: false, code: 400, msg: 'Phone and country code are required.' };
		}

		// const user = await db.Users.scope('withPassword').findOne({ where: { phone, isActive: true } });

		// if (user?.password) {
		// 	return { status: false, code: 400, msg: 'User is already registered.' };
		// }

		if (process.env.NODE_ENV === 'development') {
			const res = await sendOtpOnPhone(phone, countryCode);
			if (res?.success) return { status: true, code: 200, msg: 'OTP sent successfully to phone.' };
			else return { status: false, code: 400, msg: 'Failed to send OTP to phone.' };
		} else {
			return { status: true, code: 200, msg: 'OTP sent successfully to phone (test).' };
		}
	} catch (error) {
		console.error("Phone OTP Error:", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = sendOtpToPhone 
