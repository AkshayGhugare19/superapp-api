const { db } = require("../../../db/db");
const { otpType } = require("../../../config/enums");
const { sendOtpOnEmail } = require("../../../utilities/sendOtpOnEmail");

const sendOtpToEmail = async (email) => {
	try {
		if (!email) return { status: false, code: 400, msg: 'Email is required.' };

		// const user = await db.Users.scope('withPassword').findOne({ where: { email, isActive: true } });
		// if (user?.password) return { status: false, code: 400, msg: 'User is already registered.' };

		const otp = Math.floor(100000 + Math.random() * 900000);
		const emailOtpRes = await sendOtpOnEmail({
			to: email,
			subject: "Email Verification - Confirm Your Registration",
			html: `
				<h2>Verify Your Email</h2>
				<p>Use the OTP below to verify your email:</p>
				<h3>${otp}</h3>
				<p>This OTP is valid for 10 minutes.</p>
			`
		});

		if (emailOtpRes?.success) {
			const existingOtp = await db.Otps.findOne({ where: { email, otpFor: otpType.emailVerify } });

			if (existingOtp) {
				await db.Otps.update({ otpCode: otp }, { where: { email, otpFor: otpType.emailVerify } });
			} else {
				await db.Otps.create({
					email,
					otpCode: otp,
					otpFor: otpType.emailVerify,
					expiresAt: emailOtpRes?.expiresAt,
				});
			}

			return { status: true, code: 200, msg: 'OTP sent successfully to email.' };
		} else {
			return { status: false, code: 400, msg: 'Failed to send OTP to email.' };
		}
	} catch (error) {
		console.error("Email OTP Error:", error);
		return { status: false, code: 500, msg: error.message };
	}
};

module.exports = sendOtpToEmail 
