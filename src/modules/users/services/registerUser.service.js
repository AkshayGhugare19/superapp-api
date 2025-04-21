const { db } = require('../../../db/db');

const registerUser = async ({ role, phone, email, type, countryCode, password }) => {
	try {
		if (!type || !role) {
			return {
				msg: "'type' and 'role' are required fields.",
				status: false,
				code: 400
			};
		}

		let whereClause = { role };

		if (type === 'phone') {
			if (!phone || !countryCode) {
				return {
					msg: "'phone' and 'countryCode' are required for type 'phone'.",
					status: false,
					code: 400
				};
			}
			whereClause = { ...whereClause, phone, countryCode };
		} else if (type === 'email') {
			if (!email) {
				return {
					msg: "'email' is required for type 'email'.",
					status: false,
					code: 400
				};
			}
			whereClause = { ...whereClause, email };
		} else {
			return {
				msg: "Invalid type. Type must be either 'phone' or 'email'.",
				status: false,
				code: 400
			};
		}

		const existingUser = await db.Users.findOne({ where: whereClause });

		if (existingUser) {
			if (!password) {
				return {
					msg: "'password' is required to update existing user.",
					status: false,
					code: 400
				};
			}
			existingUser.password = password;
			await existingUser.save();

			return {
				status: true,
				data: existingUser,
				code: 200
			};
		}

		// Create new user
		const newUserData = { role, password };
		if (type === 'phone') {
			newUserData.phone = phone;
			newUserData.countryCode = countryCode;
		} else {
			newUserData.email = email;
		}

		const newUser = await db.Users.create(newUserData);

		return {
			status: true,
			data: newUser,
			code: 201
		};

	} catch (error) {
		console.error("Error while registering/updating user:", error);
		return {
			msg: error.message,
			status: false,
			code: 500
		};
	}
};

module.exports = registerUser;
