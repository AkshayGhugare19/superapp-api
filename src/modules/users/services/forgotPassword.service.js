const { db } = require("../../../db/db");
const sendOtpOnPhone = require("../../../utilities/sendOTPOnPhone");
const crypto = require("crypto");


const forgotPassword = async ({ phone, countryCode }) => {

    const currentTime = new Date();
    const user = await db.Users.findOne({ where: { phone } })
    if (!user) {
        return { status: false, code: 400, msg: "That user doesn't exist" };
    }
    if (user?.isAccountLocked) {
        return { status: false, code: 400, msg: "Your account is locked." };
    }

    if (user?.resetTokenExpirationTime !== null && user?.resetTokenExpirationTime > currentTime) {
        return { status: false, code: 400, msg: "Forgot password request has already been raised recently" };
    }

    // create reset token that expires after 5 minutes
    user.resetToken = randomTokenString();
    user.resetTokenExpirationTime = AddMinutesToDate(currentTime, Number(process.env.FORGOT_PASSWORD_RESET_TOKEN_EXPIRATION));
    await user.save();

    try {
        console.log("MODE Forgot password:",process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'production') {
            // Send OTP to mobile number
            await sendOtpOnPhone(phone, countryCode)
        }

        return { status: true, code: 200, data: { resetToken: user.resetToken, message: "OTP Sent successfully" } }
    } catch (error) {
        console.error("Error while getting user information:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

// Helper functions
function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function AddMinutesToDate(date, min) {
    let newDate = new Date(date.getTime() + min * 60000);
    return newDate.getTime();
}

module.exports = forgotPassword;
