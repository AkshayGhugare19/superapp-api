const { otpType } = require("../../../config/enums");
const { db } = require("../../../db/db");
const { sendOtpOnPhone } = require("../../../utilities/sendOTPOnPhone");
const { sendOtpOnEmail } = require("../../../utilities/sendOtpOnEmail");

const sendOTP = async ({ phone, countryCode, email, type }) => {
    try {
        if (type === 'phone') {
            if (!phone || !countryCode) {
                return { status: false, code: 400, msg: 'Phone and country code are required.' };
            }

            const userExists = await db.Users.scope('withPassword').findOne({ where: { phone, isActive: true } });
            if (userExists?.password) {
                return { status: false, code: 400, msg: 'User is already registered.' };
            }

            //on production
            if (process.env.NODE_ENV === 'development') {
                const phoneOtpRes = await sendOtpOnPhone(phone, countryCode);
                if (phoneOtpRes?.success) {
                    return { status: true, code: 200, msg: 'OTP sent successfully to phone.' };
                } else {
                    return { status: false, code: 400, msg: 'Something went wrong.' };
                }
            } else {
                //on testing
                return { status: true, code: 200, msg: 'OTP sent successfully to phone.' };
            }


        } else if (type === 'email') {
            if (!email) {
                return { status: false, code: 400, msg: 'Email is required.' };
            }
            const otp = Math.floor(100000 + Math.random() * 900000); // generate 6-digit OTP

            const userExists = await db.Users.scope('withPassword').findOne({ where: { email, isActive: true } });
            if (userExists?.password) {
                return { status: false, code: 400, msg: 'User is already registered.' };
            }

            const emailOtpRes = await sendOtpOnEmail({
                to: email,
                subject: "Email Verification - Confirm Your Registration",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #333;">Verify Your Email Address</h2>
                        <p>Thank you for registering with us!</p>
                        <p>To complete your registration, please verify your email address using the One-Time Password (OTP) below:</p>
                        <div style="padding: 10px 20px; background-color: #f2f2f2; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                            ${otp}
                        </div>
                        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
                        <p>If you did not initiate this request, please ignore this email.</p>
                        <br/>
                        <p>Best regards,<br/>The Team</p>
                    </div>
                `,
            });

            if (emailOtpRes?.success) {
                const existingOtp = await db.Otps.findOne({
                    where: { email: email, otpFor: otpType.emailVerify }
                });
            console.log("ototot",otp)
                if (existingOtp) {
                    // Update the existing OTP
                    await db.Otps.update(
                        { otpCode: otp },
                        { where: { email: email, otpFor: otpType.emailVerify } }
                    );
                } else {
                    // Create a new OTP entry
                    await db.Otps.create({
                        email: email,
                        otpCode: otp,
                        otpFor: otpType.emailVerify,
                        expiresAt:emailOtpRes?.expiresAt
                    });
                }
            
                return { status: true, code: 200, msg: 'OTP sent successfully to email.' };
            } else {
                return { status: false, code: 400, msg: 'Something went wrong.' };
            }
            

        } else {
            return { status: false, code: 400, msg: 'Invalid OTP type.' };
        }
    } catch (error) {
        console.error("Error while sending OTP:", error);
        return { status: false, code: 500, msg: error.message };
    }
};

module.exports = sendOTP;
