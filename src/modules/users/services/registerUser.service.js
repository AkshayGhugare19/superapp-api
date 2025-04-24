const { db } = require('../../../db/db');

const registerUser = async ({ role, phone, email, type, countryCode, password }) => {
	console.log("jjj",role, phone, email, type, countryCode, password)
	try {
		if (!type || !role) {
			return {
				msg: "'type' and 'role' are required fields.",
				status: false,
				code: 400
			};
		}

		let whereClause = { role };

		// Handle the 'phone' type
		if (type === 'phone') {
			if (!phone || !countryCode) {
				return {
					msg: "'phone' and 'countryCode' are required for type 'phone'.",
					status: false,
					code: 400
				};
			}
			whereClause = { ...whereClause, phone, countryCode };
		} 
		// Handle the 'email' type
		else if (type === 'email') {
			if (!email) {
				return {
					msg: "'email' is required for type 'email'.",
					status: false,
					code: 400
				};
			}
			whereClause = { ...whereClause, email };
		} 
		// Invalid type
		else {
			return {
				msg: "Invalid type. Type must be either 'phone' or 'email'.",
				status: false,
				code: 400
			};
		}

		// Check if user already exists
		const existingUser = await db.Users.findOne({ where: whereClause });

		if (existingUser) {
			// If user exists and we need to update, check if password is provided
			if (!password) {
				return {
					msg: "'password' is required to update existing user.",
					status: false,
					code: 400
				};
			}

			// Update password and role
			existingUser.password = password;
			existingUser.role = role; // Update the role as well
			await existingUser.save();

			return {
				status: true,
				data: existingUser,
				code: 200
			};
		}

		// If no existing user, create a new user
		const newUserData = { role, password };
		if (type === 'phone') {
			newUserData.phone = phone;
			newUserData.countryCode = countryCode;
		} else {
			newUserData.email = email;
		}

		// Try to insert the new user and handle potential duplicate errors
		try {
			const newUser = await db.Users.create(newUserData);
			return {
				status: true,
				data: newUser,
				code: 201
			};
		} catch (insertError) {
			// Check for duplicate entry error
			if (insertError.sqlState === '23000') {
				return {
					msg: `Duplicate entry for ${type}: ${type === 'phone' ? phone : email}.`,
					status: false,
					code: 409 // Conflict error
				};
			}
			// Handle other errors
			return {
				msg: insertError.message,
				status: false,
				code: 500
			};
		}

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
