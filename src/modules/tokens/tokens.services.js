const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Token = require('./token.model');
const moment = require('moment');
const User = require('../users/user.model');
const { tokenTypes } = require('../../config/tokens');
const { db } = require('../../db/db');
const { sendVerificationEmail } = require('../../utilities/emailService');
const { Op } = require('sequelize');
const MAX_EMAIL_VERIFY_ATTEMPTS = 3;

const generateToken = (userId, userRole, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		role:userRole,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, user.role, accessTokenExpires, tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, user.role, tokenTypes.REFRESH, refreshTokenExpires);
	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

const saveToken = async (token, userId, userRole, type, expires, blacklisted = false) => {
	const tokenDoc = await db.Tokens.create({
		token,
		userId,  // Use 'userId' to correctly map to the foreign key in the Token model
		userRole,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

const verifyToken = async (token, type) => {
	try {
		const payload = jwt.verify(token, config.jwt.secret);
		const tokenDoc = await db.Tokens.findOne({
			where: {
				token, type, userId: payload.sub, blacklisted: false
			}
		});
		if (!tokenDoc) {
			throw new Error('Token not found');
		}
		return tokenDoc;
	} catch (error) {
		return { msg: error.message, status: false, code: 401 }
	}
};

const sendTokenForVerification = async (user) => {
	try {
		const oneDayAgo = moment().subtract(24, 'hour').toDate();
		const recentVerifyAttempts = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.VERIFY_EMAIL,
				createdAt: { [Op.gte]: oneDayAgo }
			}
		});

		if (recentVerifyAttempts >= MAX_EMAIL_VERIFY_ATTEMPTS) {
			return { status: false, code: 400, msg: "Too many email verification requests in the last one day. Please try again later." };
		}

		const existingVerifyToken = await db.Tokens.count({
			where: {
				userId: user.id, type: tokenTypes.VERIFY_EMAIL,
				expires: { [Op.gte]: Date.now() }
			},
			order: [['createdAt', 'DESC']]
		});

		if (existingVerifyToken) {
			return { status: true, code: 200, data: `An verification link has already been sent to verify your email.` };
		}

		const verifyTokenExpires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
		const verifyEmailToken = generateToken(user.id, verifyTokenExpires, tokenTypes.VERIFY_EMAIL);
		await saveToken(verifyEmailToken, user.id, tokenTypes.VERIFY_EMAIL, verifyTokenExpires);
		const inviteLink = `${process.env.REMOTE_BASE_URL}/verify-email/?token=${verifyEmailToken}`
		const emailResponse = await sendVerificationEmail(user, inviteLink);
		return emailResponse;
	} catch (error) {
		return { msg: error.message, status: false, code: 500 }
	}
}

module.exports = {
	generateAuthTokens,
	generateToken,
	verifyToken,
	saveToken,
	sendTokenForVerification
}