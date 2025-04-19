
const httpStatus = require("http-status");
const tokenService = require("../tokens/tokens.services");
const userService = require("../users/services");
const otpServices = require("../otps/services");
const { tokenTypes } = require("../../config/tokens");
const ApiError = require("../../utilities/apiErrors");
const bcrypt = require('bcryptjs');
const { db } = require("../../db/db");
const { Op, Sequelize } = require("sequelize");
const { roles } = require("../../config/enums");
const tokenServices = require("../tokens/tokens.services");
const decryptPassword = require("../../utilities/decryptPassword");

const renewToken = async (refreshToken) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(
			refreshToken,
			tokenTypes.REFRESH
		);

		const user = await userService.getUserById(refreshTokenDoc.userId);

		if (!user) {
			throw new Error();
		}

		await db.Tokens.destroy({ where: { token: refreshToken } })

		// Generate new auth tokens (access and refresh tokens)
		const newTokens = await tokenService.generateAuthTokens(user);
		return newTokens;
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
	}
};


const changePassword = async ({ user, currentPassword, newPassword }) => {
	try {
		const currentPasswordOriginal = await decryptPassword(currentPassword);
		const newPasswordOriginal = await decryptPassword(newPassword);

		if (!user?.email) {
			return { status: false, code: 401, msg: "Please update your Email" };
		}
		userExists = await db.Users.scope('withPassword').findAll({
			where: {
				email: user?.email,
				isActive: true
			},
		});

		let userData = userExists[0];
		// Validate password
		let matchPassword = await bcrypt.compare(currentPasswordOriginal, userData?.password);
		if (!matchPassword) {
			return { status: false, code: 400, msg: "Password do not match" };
		}
		if (user?.isAccountLocked) {
			return { status: false, code: 400, msg: "Your account is locked." };
		}

		const updatedUser = await userData.update({ password: newPasswordOriginal });

		return { data: "Updated", status: true, code: 200 };

	} catch (error) {
		console.error("Error while login admin:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

const verifyEmail = async (token) => {
	try {
		if (!token || token === undefined) {
			return { msg: "Invalid verification link.", status: false, code: 400 }
		}
		let tokenResult = await db.Tokens.findOne({
			where: {
				token, type: tokenTypes.VERIFY_EMAIL,
				expires: { [Op.gt]: new Date() } // Ensure token has not expired
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		if (!tokenResult) {
			return {
				msg: "Verification link is invalid or expired.",
				status: false,
				code: 400
			};
		}

		let verifyEmailToken = await tokenService.verifyToken(tokenResult.token, tokenResult.type)

		if (!verifyEmailToken?.dataValues) {
			return verifyEmailToken;
		}

		let checkUser = await db.Users.findOne({ where: { id: tokenResult?.userId } });

		if (!checkUser) {
			return {
				msg: "User not found",
				status: false,
				code: 404
			};
		}

		await checkUser.update({ isEmailVerified: true })

		await db.Tokens.destroy({
			where: {
				userId: checkUser.id,
				type: tokenTypes.VERIFY_EMAIL
			}
		})

		return {
			data: "Email verified successfully.",
			status: true,
			code: 200
		};
	} catch (error) {
		console.error('Error in verifyEmail service:', error);
		return { msg: error.message, status: false, code: 500 };
	}
};

const resendVerificationEmail = async (token) => {
	try {
		if (!token || token === undefined) {
			return { msg: "Token is required.", status: false, code: 400 }
		}
		let tokenResult = await db.Tokens.findOne({
			where: {
				token,
				type: tokenTypes.VERIFY_EMAIL,
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		if (!tokenResult) {
			return {
				msg: "Token is not valid.",
				status: false,
				code: 400
			};
		}

		if (tokenResult && tokenResult.expires > new Date()) {
			return {
				msg: "Token is already valid.",
				status: false,
				code: 400
			};
		}

		const user = await db.Users.findOne({
			where: {
				id: tokenResult.userId
			},
			order: [['createdAt', 'DESC']],
			raw: true
		});

		const sendEmailResponse = await tokenServices.sendTokenForVerification(user);
		if (sendEmailResponse.status && sendEmailResponse.code === 200) {
			return { data: "Verification email sent successfully!", status: true, code: 200 };
		}
	} catch (error) {
		console.error('Error in verifyEmail service:', error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = {
	renewToken,
	verifyEmail,
	resendVerificationEmail,
	changePassword
}