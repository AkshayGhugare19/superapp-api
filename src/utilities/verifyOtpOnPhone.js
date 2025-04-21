const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

const verifyOtpOnPhone = async (phone, countryCode, otp) => {
   try {
	const verificationCheck = await client.verify
		.v2.services(serviceSid)
		.verificationChecks
		.create({
			to: `+${countryCode}${phone}`,
			code: otp,
		});

		return {
            success: true,
            status: verificationCheck.status, // typically 'pending'
            sid: verificationCheck.sid,
            to: verificationCheck.to,
        };
   } catch (error) {
	return {
		success: false,
		error: error.message || 'Failed to verify OTP',
	};
}
	
};

module.exports = verifyOtpOnPhone;