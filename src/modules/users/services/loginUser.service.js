const bcrypt = require('bcryptjs');
const tokenServices = require("../../tokens/tokens.services");
const otpServices = require("../../otps/services");
const { db } = require('../../../db/db');
const decryptPassword = require('../../../utilities/decryptPassword');
const updaterUser = require('./updateUser.service');

const loginUser = async ({ email, password, role }) => {
	try {

		const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
		const isPhone = /^[0-9]{10,15}$/.test(email);

		let userExists;
		if (isEmail) {
			// If it's an email, search by email
			userExists = await db.Users.scope('withPassword').findAll({
				where: {
					email: email,
					role: role,
					isActive: true
				},
			});
		} else if (isPhone) {
			// If it's a phone number, search by phone number
			userExists = await db.Users.scope('withPassword').findAll({
				where: {
					phone: email,  // here email represents phone number
					role: role,
					isActive: true
				},
			});
		} else {
			return {
				status: false, code: 400,
				msg: "Please provide a valid email or phone number."
			};
		}

		if (userExists?.length > 1) {
			return { status: false, code: 400, msg: "We found multiple records for details provided." };
		}

		let user = userExists[0];
		if (!user) {
			return {
				msg: `${capitalize(role)} with ${isEmail ? 'email' : 'phone'} ${email} not found`,
				status: false,
				code: 404
			};
		}

		const originalPassword = await decryptPassword(password);
		
		// Validate password
		let matchPassword = await bcrypt.compare(originalPassword, user?.password);
		if (!matchPassword) {
			return { status: false, code: 400, msg: "Password do not match" };
		}

		if (user?.isAccountLocked) {
			return { status: false, code: 400, msg: "Your account is locked." };
		}

		const tokens = await tokenServices.generateAuthTokens(user);
		delete user?.dataValues?.password;
		if(tokens){
			const payload = {
				loggedInUser:true
			}
			updaterUser(user?.dataValues?.id,payload)
		}

		return { data: { user, tokens }, status: true, code: 200 };

	} catch (error) {
		console.error("Error while login User:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

function capitalize(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = loginUser;
