const { db } = require("../../../db/db");
const verifyOtpOnPhone = require("../../../utilities/verifyOtpOnPhone");

const verifyOTP = async ({ phone, countryCode, otp, role }) => {
    try {
        console.log("MODE VERIFY OTP:",process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
            // Verify the OTP which has been sent to phone
            const verificationCheck = await verifyOtpOnPhone(phone, countryCode, otp)
            if (verificationCheck.status !== "approved") {
                return { status: false, code: 400, msg: "Invalid OTP." };
            }
        } else {
            if (otp !== "123456") {
                return { status: false, code: 400, msg: "Invalid OTP." };
            }
        }

        const userExists = await db.Users.findOne({ where: { phone, isActive: true } });

        if (userExists) {
            userExists.isMobileVerified = true;
            userExists.countryCode = countryCode;
            await userExists.save();
            return { status: true, code: 201, data: { data: userExists, msg: "OTP verified successfully" } };
        } else {
            const newUser = new db.Users({ phone, role, countryCode, isMobileVerified: true });
            const savedUser = await newUser.save();
            return { status: true, code: 201, data: { data: savedUser, msg: "OTP verified successfully" } };
        }
    } catch (error) {
        console.error("Error while getting user information:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = verifyOTP;
