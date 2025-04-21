const { db } = require("../db/db");

const verifyOtpOnEmail = async (email, otp) => {
	try {
		const otpEntry = await db.Otps.findOne({
			where: {
				email:email,
				otpCode:otp,
			}
		});

		if (!otpEntry) {
			return {
				status: false,
				data: "Invalid or expired OTP",
				code: 400 // Use 400 for bad request
			};
		}

		// Destroy OTP after successful verification
		await otpEntry.destroy();

		return {
            success: true,
			status: true,
			data: "OTP verified successfully",
			code: 200
		};

	} catch (error) {
		console.error("❌ OTP verification error:", error);
		return {
            success: false,
			status: false,
			data: "Something went wrong",
			code: 500 // Internal server error
		};
	}
};

module.exports = verifyOtpOnEmail;
