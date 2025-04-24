const { db } = require("../../../db/db");
const verifyOtpOnEmail = require("../../../utilities/verifyOtpOnEmail");

const verifyEmailOtpService = async ({ email, otp, role }) => {
	try {
		if (process.env.NODE_ENV === 'development') {
			const result = await verifyOtpOnEmail(email, otp);
			if (!result?.success) {
				return { status: false, code: 400, msg: "Invalid email OTP." };
			}
		} else {
			if (otp !== "123456") {
				return { status: false, code: 400, msg: "Invalid OTP. Please try again." };
			}
		}

		let user = await db.Users.findOne({ where: { email } });
		if (user) {
			user.isEmailVerified = true;
			await user.save();
		} else {
			user = await db.Users.create({
				role,
				email,
				isEmailVerified: true,
				isActive: true
			});
		}

		return {
			status: true,
			code: 201,
			data: { data: user, msg: "Email OTP verified successfully." }
		};

	} catch (err) {
		console.error("Email OTP Error:", err);
		return { status: false, code: 500, msg: "Internal Server Error: Unable to verify email OTP." };
	}
};

module.exports = verifyEmailOtpService;
