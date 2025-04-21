const bcrypt = require('bcryptjs');
const tokenServices = require("../../tokens/tokens.services");
const { db } = require('../../../db/db');
const decryptPassword = require('../../../utilities/decryptPassword');
const updaterUser = require('./updateUser.service');

const loginUser = async ({ email, phone, countryCode, password, role, type }) => {
	try {
		if (!type || !['email', 'phone'].includes(type)) {
			return { status: false, code: 400, msg: "Login type must be either 'email' or 'phone'." };
		}

		let userQuery = { role, isActive: true };

		if (type === 'email') {
			if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				return { status: false, code: 400, msg: "Please provide a valid email address." };
			}
			userQuery.email = email;
		} else if (type === 'phone') {
			if (!phone || !/^\d{6,15}$/.test(phone)) {
				return { status: false, code: 400, msg: "Please provide a valid phone number (6–15 digits)." };
			}
			if (!countryCode || !/^\d{1,5}$/.test(countryCode)) {
				return { status: false, code: 400, msg: "Please provide a valid country code." };
			}
			userQuery.phone = phone;
			userQuery.countryCode = countryCode;
		}

		const users = await db.Users.scope('withPassword').findAll({ where: userQuery });

		if (users.length === 0) {
			return {
				status: false,
				code: 404,
				msg: `${capitalize(role)} with given ${type} not found.`
			};
		}

		if (users.length > 1) {
			return {
				status: false,
				code: 400,
				msg: `Multiple users found for this ${type}. Please contact support.`
			};
		}

		const user = users[0];

		if (user.isAccountLocked) {
			return {
				status: false,
				code: 403,
				msg: "Your account is locked. Please contact support."
			};
		}

		const originalPassword = await decryptPassword(password);
		const isMatch = await bcrypt.compare(originalPassword, user.password);

		if (!isMatch) {
			return { status: false, code: 401, msg: "Incorrect password." };
		}

		const tokens = await tokenServices.generateAuthTokens(user);
		delete user.dataValues.password;

		if (tokens) {
			await updaterUser(user.id, { loggedInUser: true });
		}

		return {
			status: true,
			code: 200,
			data: {
				user,
				tokens
			}
		};

	} catch (err) {
		console.error("Login error:", err);
		return { status: false, code: 500, msg: "Internal server error." };
	}
};

function capitalize(str) {
	return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

module.exports = loginUser;
