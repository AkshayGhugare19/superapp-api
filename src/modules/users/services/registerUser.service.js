const { db } = require('../../../db/db');

const registerUser = async ({ role, phone, email }) => {
	try {
		if (!phone && !email) {
			return {
				msg: "At least one of 'phone' or 'email' must be provided.",
				status: false,
				code: 400
			};
		}

		const whereClause = {
			...(phone ? { phone } : {}),
			...(email ? { email } : {}),
			role
		};

		const existingUser = await db.Users.findOne({ where: whereClause });

		if (existingUser) {
			return {
				msg: "User with this phone/email and role already exists",
				status: false,
				code: 400
			};
		}

		const newUser = await db.Users.create({ role, phone, email });
		return { status: true, data: newUser, code: 201 };

	} catch (error) {
		console.error("Error while registering user:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = registerUser;
