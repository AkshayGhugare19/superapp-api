const { db } = require("../../../db/db");
const verifyOtpOnPhone = require("../../../utilities/verifyOtpOnPhone");

const verifyResetToken = async ({ resetToken, otp }) => {

    const currentTime = new Date();
    const user = await db.Users.findOne({ where: { resetToken: resetToken } });
    if (!user) {
        return { status: false, code: 400, msg: "Token is invalid" };
    }
    if (user?.resetTokenExpirationTime < currentTime) {
        return { status: false, code: 400, msg: "The token has expired!" };
    }
    if (user?.isResetPasswordOTPVerified) {
        return { status: false, code: 400, msg: "Token is already verified" };
    }

    try {
        console.log("MODE VERIFY OTP:",process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
            // Verify the OTP which has been sent to phone
            const verificationCheck = await verifyOtpOnPhone(phone, otp)
            if (verificationCheck.status !== "approved") {
                return { status: false, code: 400, msg: "Invalid OTP." };
            }
        } else {
            if (otp !== "123456") {
                return { status: false, code: 400, msg: "Invalid OTP." };
            }
        }

        user.isResetPasswordOTPVerified = true;
        await user.save();

        return { status: true, code: 200, data: { resetToken: user.resetToken, message: 'OTP verified successfully.' } };
    } catch (error) {
        console.error("Error while getting user information:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = verifyResetToken;
