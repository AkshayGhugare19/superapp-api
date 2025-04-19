const { db } = require("../../../db/db");
const decryptPassword = require("../../../utilities/decryptPassword");
const bcrypt = require('bcryptjs');


const resetPassword = async ({ resetToken, password }) => {

    const currentTime = new Date();
    const user = await db.Users.scope('withPassword').findOne({ where: { resetToken: resetToken } });
    if (!user) {
        return { status: false, code: 400, msg: "Token is invalid" };
    }
    if (user?.resetTokenExpirationTime < currentTime) {
        return { status: false, code: 400, msg: "The token has expired!" };
    }
    if (!user.isResetPasswordOTPVerified) {
        return { status: false, code: 400, msg: "Reset Password Token is not verified" };
    }
    let originalPassword;
    if (password && (password !== null || password !== "")) {
        originalPassword = await decryptPassword(password);

        const isPasswordValid = await bcrypt.compare(originalPassword, user?.password);
        if (isPasswordValid) {
            return { status: false, code: 400, msg: "The new password cannot be the same as the old password." };
        }
        if (originalPassword.length < 8) {
            return { status: false, code: 400, msg: "Password must be at least 8 characters long" };
        }
        if (!originalPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)) {
            return { status: false, code: 400, msg: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" };
        }
    }
    try {
        // hash password
        user.password = originalPassword
        user.resetToken = null;
        user.resetTokenExpirationTime = null;
        user.lastPasswordReset = Date.now();
        user.isResetPasswordOTPVerified = null;
        await user.save();

        return { status: true, code: 200, data: 'Password changed successfully' };
    } catch (error) {
        console.error("Error while getting user information:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = resetPassword;
