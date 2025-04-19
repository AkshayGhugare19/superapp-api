const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

const sendOtpOnPhone = async (phone, countryCode) => {
    try {
        const verification = await client.verify
            .v2.services(serviceSid)
            .verifications
            .create({
                to: `+${countryCode}${phone}`,
                channel: 'sms',
                ttl: 120, // Time-to-live in seconds
            });

        return {
            success: true,
            status: verification.status, // typically 'pending'
            sid: verification.sid,
            to: verification.to,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to send OTP',
        };
    }
};

const sendInvitationPhone = async (phone, inviteLink, inviterName) => {
    try {
        const message = `Hello! ${inviterName} has invited you to join their platform. Tap the link to accept the invitation and get started: ${inviteLink}`;
        await client.messages.create({
            body: message,
            from: fromNumber,
            to: phone,
        });
        return { status: true, code: 200, data: "Invitation sent successfully." };
    } catch (error) {
        console.error("Error sending invitation via phone:", error);
        return { status: false, code: 500, data: error.message };
    }
};


module.exports = { sendOtpOnPhone, sendInvitationPhone };