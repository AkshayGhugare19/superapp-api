const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

const verifyOtpOnPhone = async (phone, countryCode, otp) => {

	const verificationCheck = await client.verify
		.v2.services(serviceSid)
		.verificationChecks
		.create({
			to: `+${countryCode}${phone}`,
			code: otp,
		});
	return verificationCheck
};

module.exports = verifyOtpOnPhone;